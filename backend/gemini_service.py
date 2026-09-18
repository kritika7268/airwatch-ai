"""
Gemini Service for AirWatch AI.
=================================
MANDATORY HACKATHON INTEGRATION:
Uses Google Gemini 2.0 Flash (`gemini-2.0-flash`) via `google-generativeai` SDK for two core tasks:
  1. VISION: Multimodal visual classification of citizen pollution photos (stubble burning, industrial plume, diesel exhaust, construction dust) & severity rating.
  2. REASONING: Multivariable environmental risk fusion (PM2.5, PM10, wind speed, report density, visual findings) returning structured JSON {risk_score, status, likely_cause, recommended_action}.

Includes automatic zero-crash fallback simulator if no Gemini API key is configured.
"""

import os
import json
import re
import io
import base64
from typing import Dict, Any, Optional
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

# Global state for Gemini API Key and configured models
_GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
_IS_INITIALIZED = False

# Try importing google.generativeai
try:
    import google.generativeai as genai
    _GENAI_AVAILABLE = True
except ImportError:
    _GENAI_AVAILABLE = False


def initialize_gemini(api_key: Optional[str] = None) -> bool:
    """Configures the Google Generative AI SDK with the provided or environment API key."""
    global _GEMINI_API_KEY, _IS_INITIALIZED
    
    key_to_use = api_key or _GEMINI_API_KEY
    if not key_to_use or not _GENAI_AVAILABLE:
        _IS_INITIALIZED = False
        return False
    
    try:
        genai.configure(api_key=key_to_use.strip())
        _GEMINI_API_KEY = key_to_use.strip()
        _IS_INITIALIZED = True
        return True
    except Exception as e:
        print(f"[GeminiService] Failed to configure Gemini: {e}")
        _IS_INITIALIZED = False
        return False


# Attempt initial configuration if environment variable is present
if _GEMINI_API_KEY:
    initialize_gemini(_GEMINI_API_KEY)


def get_gemini_status() -> Dict[str, Any]:
    """Returns the current operational status of the Gemini 2.0 Flash integration."""
    return {
        "is_configured": bool(_GEMINI_API_KEY and _IS_INITIALIZED),
        "sdk_available": _GENAI_AVAILABLE,
        "model": "gemini-2.0-flash",
        "has_key": bool(_GEMINI_API_KEY),
        "key_preview": f"{_GEMINI_API_KEY[:6]}...{_GEMINI_API_KEY[-4:]}" if len(_GEMINI_API_KEY) > 10 else ("Configured" if _GEMINI_API_KEY else "Not Set"),
        "mode": "Live Google Gemini 2.0 Flash" if (_GEMINI_API_KEY and _IS_INITIALIZED) else "Mock Fallback Simulator"
    }


# ============================================================================
# TASK 1: MULTIMODAL VISION CLASSIFICATION
# ============================================================================
def analyze_pollution_image(image_bytes: bytes, user_description: str = "", location: str = "") -> Dict[str, Any]:
    """
    GOOGLE AI CALL #1: Gemini 2.0 Flash Multimodal Vision
    Classifies pollution type and estimates severity from citizen photos.
    
    Pollution Types:
      - 'industrial_smoke': Factory chimneys, brick kilns, smelters, chemical plumes
      - 'vehicle_emission': Diesel exhaust, congested traffic corridors, idling buses
      - 'crop_burning': Agricultural residue, stubble (parali) fires, open biomass burning
      - 'dust': Construction sites, unpaved roads, dry riverbed sand
      - 'other': Mixed urban haze, municipal garbage burning
    """
    global _IS_INITIALIZED
    
    # 1. Fallback Mock if Gemini is not configured
    if not _IS_INITIALIZED or not _GEMINI_API_KEY:
        return _mock_vision_analysis(user_description, location)
    
    try:
        # Load image via Pillow for Gemini multimodal input
        pil_image = Image.open(io.BytesIO(image_bytes))
        
        # -------------------------------------------------------------
        # GOOGLE GEMINI API CALL (Vision: gemini-2.0-flash)
        # -------------------------------------------------------------
        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            generation_config={
                "temperature": 0.2,
                "response_mime_type": "application/json"
            }
        )
        
        prompt = f"""
You are an expert environmental computer vision analyst inspecting hyperlocal citizen air pollution photos in Indian cities.
Location context: {location or 'Indian Urban Area'}
Citizen Note: {user_description or 'None provided'}

Examine this image and provide a structured JSON assessment of the air pollution source.
Classify the dominant pollution type into exactly one of:
- "industrial_smoke" (Brick kilns, factory stacks, coal boilers, metal foundries)
- "vehicle_emission" (Heavy truck exhausts, bumper-to-bumper diesel traffic, autorickshaw smoke)
- "crop_burning" (Agricultural crop stubble, parali fires, roadside biomass burning)
- "dust" (Demolition/construction debris, unpaved road dust, dry riverbed soil)
- "other" (Municipal solid waste burning, tyre fires, general winter smog)

Estimate the severity as one of: "low", "medium", "high".

Return ONLY valid JSON matching this exact structure:
{{
  "pollution_type": "industrial_smoke" | "vehicle_emission" | "crop_burning" | "dust" | "other",
  "pollution_type_label": "Human friendly title, e.g. Industrial Boiler Stack Smoke",
  "severity": "low" | "medium" | "high",
  "confidence_score": 0.0 to 1.0,
  "visual_clues": ["item 1", "item 2", "item 3"],
  "estimated_radius_meters": 200 to 3000,
  "summary": "2-line technical description of the visible airborne particulate plume",
  "is_mock": false,
  "ai_badge": "Live Google Gemini 2.0 Flash (Multimodal)"
}}
"""
        response = model.generate_content([prompt, pil_image])
        text_response = response.text.strip()
        
        # Parse JSON
        parsed = _clean_and_parse_json(text_response)
        parsed["is_mock"] = False
        parsed["ai_badge"] = "Live Google Gemini 2.0 Flash (Multimodal)"
        return parsed

    except Exception as e:
        print(f"[GeminiVision] Error during live vision call, falling back to mock: {e}")
        mock_res = _mock_vision_analysis(user_description, location)
        mock_res["fallback_reason"] = str(e)
        return mock_res


# ============================================================================
# TASK 2: MULTI-VARIABLE REASONING ENGINE
# ============================================================================
def generate_risk_assessment(
    pm25: float,
    pm10: float,
    wind_speed: float,
    report_count: int,
    recent_vision_type: Optional[str] = None,
    city_name: str = "Kanpur",
    hotspot_name: str = "Panki Industrial Area"
) -> Dict[str, Any]:
    """
    GOOGLE AI CALL #2: Gemini 2.0 Flash Multivariable Reasoning
    Combines quantitative sensor data (CPCB continuous sensors) with qualitative
    citizen crowdsourced reports and Gemini vision findings to deduce:
      - risk_score: 0-100 integer
      - status: 'Low' (<50), 'High' (50-79), 'Critical' (80+)
      - likely_cause: Plain language root cause explanation
      - recommended_action: Concrete instructions for municipal authorities
      - target_authority: Designated agency (Nagar Nigam, State Pollution Board, Traffic Police)
    """
    global _IS_INITIALIZED
    
    # 1. Fallback Mock if Gemini is not configured
    if not _IS_INITIALIZED or not _GEMINI_API_KEY:
        return _mock_reasoning_assessment(pm25, pm10, wind_speed, report_count, recent_vision_type, city_name, hotspot_name)
    
    try:
        # -------------------------------------------------------------
        # GOOGLE GEMINI API CALL (Reasoning: gemini-2.0-flash)
        # -------------------------------------------------------------
        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            generation_config={
                "temperature": 0.2,
                "response_mime_type": "application/json"
            }
        )
        
        prompt = f"""
You are the AirWatch AI Environmental Risk Reasoner, operating for municipal municipal corporations and State Pollution Control Boards in India (e.g. UPPCB, DPCC).

Current Hyperlocal Sensor & Citizen Telemetry:
- City: {city_name}, Hotspot: {hotspot_name}
- Sensor PM2.5: {pm25} µg/m³ (India National Ambient Air Quality Standard 24h limit is 60 µg/m³)
- Sensor PM10: {pm10} µg/m³ (NAAQS 24h limit is 100 µg/m³)
- Ground Wind Speed: {wind_speed} km/h (Under 5 km/h causes stagnation/inversion)
- Citizen Crowdsourced Photo Reports logged in last 60 mins: {report_count}
- Dominant Gemini Multimodal Vision classification from citizen photos: {recent_vision_type or 'unspecified / mixed plumes'}

Analyze the physical dispersion dynamics and civic risk.
Compute:
1. "risk_score": An integer from 0 to 100 reflecting public health hazard and rapid escalation probability.
   - Under 50: Moderate/Acceptable
   - 50 to 79: High / Unhealthy for sensitive groups
   - 80 to 100: Severe / Hazardous (Emergency civic intervention required)
2. "status": Exactly "Moderate", "High", or "Critical"
3. "likely_cause": A concise, technically sound root cause sentence combining the particulate profile, wind dispersion physics, and citizen observations.
4. "recommended_action": Concrete, authoritative action instructions for the municipal commissioner or environmental task force (e.g., anti-smog mist cannon deployment, vehicular diversions, temporary industrial furnace shutdown, or flying squad inspections).
5. "target_authority": Designated agency (e.g. "Kanpur Nagar Nigam Rapid Response", "UP State Pollution Control Board (UPPCB)", "City Traffic Enforcement Division").

Return ONLY a JSON object matching this schema:
{{
  "risk_score": integer (0-100),
  "status": "Moderate" | "High" | "Critical",
  "likely_cause": "...",
  "recommended_action": "...",
  "target_authority": "...",
  "key_factors": ["factor 1", "factor 2", "factor 3"],
  "health_advisory": "plain language advice for citizens and schools in ward",
  "is_mock": false,
  "ai_badge": "Live Google Gemini 2.0 Flash (Reasoning)"
}}
"""
        response = model.generate_content(prompt)
        text_response = response.text.strip()
        
        parsed = _clean_and_parse_json(text_response)
        parsed["is_mock"] = False
        parsed["ai_badge"] = "Live Google Gemini 2.0 Flash (Reasoning)"
        return parsed

    except Exception as e:
        print(f"[GeminiReasoning] Error during live reasoning call, falling back to mock: {e}")
        mock_res = _mock_reasoning_assessment(pm25, pm10, wind_speed, report_count, recent_vision_type, city_name, hotspot_name)
        mock_res["fallback_reason"] = str(e)
        return mock_res


# ============================================================================
# HELPER PARSER
# ============================================================================
def _clean_and_parse_json(text: str) -> Dict[str, Any]:
    """Cleans code blocks or accidental markdown wrappers from Gemini JSON output."""
    cleaned = text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()
    return json.loads(cleaned)


# ============================================================================
# ZERO-CRASH MOCK FALLBACK ENGINES (FOR LIVE DEMOS WITHOUT CRASHES)
# ============================================================================
def _mock_vision_analysis(user_description: str, location: str) -> Dict[str, Any]:
    """Deterministic fallback vision analysis when API key is missing."""
    desc = (user_description or "").lower()
    
    if any(k in desc for k in ["stubble", "parali", "farm", "crop", "field"]):
        p_type = "crop_burning"
        p_label = "Agricultural Biomass / Stubble Burning"
        severity = "high"
        clues = ["Open field ground fires", "Dense yellowish-white smoke plume", "High acreage dispersion"]
        radius = 2500
        summary = "Citizen photo shows localized agricultural field burning with high PM2.5 aerosol signature spreading downwind."
    elif any(k in desc for k in ["factory", "industry", "chimney", "boiler", "stack", "panki"]):
        p_type = "industrial_smoke"
        p_label = "Industrial Boiler / Kiln Stack Emissions"
        severity = "high"
        clues = ["Vertical dark particulate column", "Elevated industrial stack source", "Soot residue visible"]
        radius = 1800
        summary = "Citizen imagery captures heavy unscrubbed flue gas emissions from manufacturing stack."
    elif any(k in desc for k in ["traffic", "truck", "bus", "diesel", "road", "vehicle"]):
        p_type = "vehicle_emission"
        p_label = "Commercial Diesel Vehicle Exhaust"
        severity = "medium"
        clues = ["Heavy commercial vehicle idling", "Black soot tailpipe exhaust", "Roadway particulate haze"]
        radius = 600
        summary = "Visible tailpipe emissions from overloaded commercial freight and diesel transit corridor."
    elif any(k in desc for k in ["dust", "construction", "sand", "building", "dig"]):
        p_type = "dust"
        p_label = "Fugitive Construction / Road Dust"
        severity = "medium"
        clues = ["Uncovered earth excavation", "Absence of water sprinkling", "Coarse particulate suspension"]
        radius = 450
        summary = "Resuspended soil and fine construction dust lacking required particulate dust barriers."
    else:
        p_type = "industrial_smoke"
        p_label = "Industrial Particulate Emissions"
        severity = "high"
        clues = ["Dense dark smoke plume", "Low thermal buoyancy dispersion", "High opacity plume"]
        radius = 1200
        summary = "Identified dense particulate emissions indicative of unregulated industrial combustion."

    return {
        "pollution_type": p_type,
        "pollution_type_label": p_label,
        "severity": severity,
        "confidence_score": 0.94,
        "visual_clues": clues,
        "estimated_radius_meters": radius,
        "summary": summary,
        "is_mock": True,
        "ai_badge": "Mock Fallback Simulator (Add Gemini Key for Live Model)"
    }


def _mock_reasoning_assessment(
    pm25: float,
    pm10: float,
    wind_speed: float,
    report_count: int,
    recent_vision_type: Optional[str],
    city_name: str,
    hotspot_name: str
) -> Dict[str, Any]:
    """Deterministic fallback reasoning assessment when API key is missing."""
    # Compute realistic hazard score
    base_score = min(100, int((pm25 / 220.0) * 60 + (min(report_count, 15) * 2.2) + (max(0, 8.0 - wind_speed) * 3)))
    
    if base_score >= 80:
        status = "Critical"
        likely_cause = f"Stagnant microclimate ({wind_speed} km/h wind) trapping {recent_vision_type or 'industrial boiler'} plumes; PM2.5 exceeds standard by {round(pm25/60.0, 1)}x."
        recommended_action = f"Immediate dispatch of Nagar Nigam Anti-Smog water mist trucks along arterial roads; issue Section 15 Air Act compliance check on adjacent industrial boiler units; notify Ward hospitals."
        target_authority = f"{city_name} Nagar Nigam Emergency Task Force & State Pollution Control Board"
    elif base_score >= 50:
        status = "High"
        likely_cause = f"Elevated particulate concentration ({pm25} µg/m³) driven by {recent_vision_type or 'vehicular congestion'} with moderate atmospheric trapping."
        recommended_action = f"Enforce commercial truck route diversions; deploy mechanised road sweepers and water mist sprinkling; conduct spot checks on local diesel generator sets."
        target_authority = f"{city_name} Traffic Police & Municipal Sanitation Wing"
    else:
        status = "Moderate"
        likely_cause = f"Ambient baseline particulate load with sufficient wind dispersion ({wind_speed} km/h)."
        recommended_action = f"Maintain routine continuous CAAQMS sensor monitoring and regular road cleaning cycles."
        target_authority = f"{city_name} Municipal Ward Environmental Cell"

    return {
        "risk_score": max(25, min(98, base_score)),
        "status": status,
        "likely_cause": likely_cause,
        "recommended_action": recommended_action,
        "target_authority": target_authority,
        "key_factors": [
            f"PM2.5: {pm25} µg/m³ (India NAAQS standard: 60)",
            f"Wind Dispersion: {wind_speed} km/h (Low dispersion threshold: <5 km/h)",
            f"Citizen Crowdsourced Validations: {report_count} verified reports",
            f"Dominant Source: {recent_vision_type or 'Industrial stack / combustion'}"
        ],
        "health_advisory": "High-risk groups (children, elderly, asthmatics) should avoid prolonged outdoor exertion. Wear N95 masks during morning hours.",
        "is_mock": True,
        "ai_badge": "Mock Fallback Simulator (Add Gemini Key for Live Model)"
    }
