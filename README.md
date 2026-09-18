# AirWatch AI 🍃
### Hyperlocal Air Pollution Detection & Civic Action Platform for Indian Cities
*Submission for Google AI Hackathon — Clean Air & Climate Resilience Track*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-AirWatch_AI-00C853?style=for-the-badge&logo=render&logoColor=white)](https://airwatch-ai-992k.onrender.com/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/kritika7268/airwatch-ai)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://airwatch-ai-992k.onrender.com/api)

> 🔗 **Live Web Application**: **[https://airwatch-ai-992k.onrender.com](https://airwatch-ai-992k.onrender.com/)**  
> 📡 **Live API & Health**: **[https://airwatch-ai-992k.onrender.com/api](https://airwatch-ai-992k.onrender.com/api)**

---

## 🌟 Overview
**AirWatch AI** is a real-time, hyperlocal air pollution detection, multimodal verification, and municipal alert platform engineered specifically for the air sheds of Northern and Central India (such as Kanpur, Lucknow, Prayagraj, and Delhi-NCR).

Unlike traditional regional AQI dashboards that report city-wide averages hours after hazardous spikes occur, AirWatch AI bridges:
1. **Continuous Ambient Air Quality Monitoring Stations (CAAQMS)** telemetry modeled after the Central Pollution Control Board (CPCB / `data.gov.in`) standards.
2. **Multimodal Citizen Crowdsourcing**, allowing residents to submit geotagged photos of pollution sources.
3. **Google Gemini 2.0 Flash (`gemini-2.0-flash`)** as the core intelligence engine to perform visual classification of emissions and physics-informed multivariable civic risk reasoning.
4. **Automated Authority Alert Workflows** that immediately dispatch municipal teams (Nagar Nigam anti-smog mist cannons, UPPCB flying squads, traffic diversions).
5. **Cross-City Federation Architecture** that preserves citizen data sovereignty locally while federating dispersion models across Indian states.

---

## 🤖 Mandatory Google Gemini 2.0 Flash Integration

AirWatch AI integrates **Google Gemini 2.0 Flash** via the `google-generativeai` SDK for two real tasks:

### 1. Multimodal Vision Classification (`analyze_pollution_image`)
- **Code Pointer**: [`backend/gemini_service.py` L62-L135](file:///d:/Air-watchAI/backend/gemini_service.py#L62-L135)
- **Task**: When a citizen submits a report with a photo, the image and contextual metadata are transmitted to Gemini 2.0 Flash.
- **Output**: Gemini classifies the emission into domain categories:
  - `industrial_smoke` (unscrubbed boiler chimneys, brick kilns, foundries)
  - `crop_burning` (agricultural stubble / *parali* fires)
  - `vehicle_emission` (heavy diesel freight trucks, idling transit)
  - `dust` (unpaved road dust, construction excavation)
  - `other` (municipal waste burning, urban smog)
- **Severity Rating**: Evaluates visual particulate opacity and plume dispersion to rate severity (`low`, `medium`, `high`) and estimate impact radius in meters.

### 2. Multivariable Risk Reasoning Engine (`generate_risk_assessment`)
- **Code Pointer**: [`backend/gemini_service.py` L138-L225](file:///d:/Air-watchAI/backend/gemini_service.py#L138-L225)
- **Task**: Fuses quantitative sensor data (PM2.5, PM10, ground wind speed) + crowdsourced report density + Gemini multimodal visual findings.
- **Output**: Returns strict structured JSON containing:
  - `risk_score` (0–100 integer)
  - `status` (`Moderate`, `High`, or `Critical`)
  - `likely_cause` (plain-language technical diagnosis of root cause)
  - `recommended_action` (concrete municipal directive, e.g. dispatch anti-smog mist cannon, inspect boiler stack)
  - `target_authority` (designated department, e.g. Kanpur Nagar Nigam, UPPCB)
- **Automatic Alert Escalation**: When `risk_score >= 70`, an actionable alert is automatically generated in the Authority Alert Console.

> [!NOTE]
> **Zero-Crash Fallback Simulator**: If no Gemini API key is configured or quota is exhausted during a live judging session, the platform automatically activates a labeled high-fidelity simulation engine so the live demonstration never crashes or hangs.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+** (tested on Python 3.14)
- **Node.js 18+** & **npm**

### Step 1: Start the FastAPI Backend
```bash
cd backend
python -m pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*Backend runs at `http://127.0.0.1:8000` (Swagger docs at `/docs`).*

### Step 2: Start the React Frontend
Open a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🔑 Configuring Your Google Gemini API Key

You can configure your Gemini API Key in two ways:
1. **Via `.env` file**:
   Create a `.env` file in the root or `backend/` directory:
   ```env
   GEMINI_API_KEY=your_google_ai_studio_key_here
   ```
2. **Directly via UI (Hot-Swap)**:
   Click the **Gemini 2.0: Fallback Mode** button in the top navbar to paste your API key live during demonstrations.

---

## 🗺️ Scaling Beyond One City: Interoperability Across Indian States & Districts

A critical evaluation factor in the Clean Air & Climate Resilience track is demonstrating how a single-city solution scales nationally across Indian states and districts:

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│   Kanpur Edge Node     │      │   Lucknow Edge Node    │      │  Delhi-NCR Edge Node   │
│ • Local CPCB CAAQMS    │      │ • Local CPCB CAAQMS    │      │ • Local DPCC CAAQMS    │
│ • Citizen Photos (Ward)│      │ • Citizen Photos (Ward)│      │ • Citizen Photos (Ward)│
└───────────┬────────────┘      └───────────┬────────────┘      └───────────┬────────────┘
            │                               │                               │
            │ (Sanitized Model Weights      │ (Sanitized Model Weights      │
            │  & Plume Vectors Only)        │  & Plume Vectors Only)        │
            ▼                               ▼                               ▼
     ══════════════════════════════════════════════════════════════════════════════
               NATIONAL SHARED FEDERATED INTELLIGENCE LAYER (CPCB / MoEFCC)
     ══════════════════════════════════════════════════════════════════════════════
                                            │
               Downwind Trajectory Early Warnings (e.g., Stubble Smog Forecasts)
                                            ▼
                                ┌────────────────────────┐
                                │ Downwind Cities/States │
                                │ (Varanasi, Patna, etc.)│
                                └────────────────────────┘
```

### 1. Integration with CPCB Public Air Quality API (`data.gov.in`)
In production deployment, AirWatch AI connects directly to the Central Pollution Control Board (CPCB) open API published under the National Data Sharing and Accessibility Policy (NDSAP) on `data.gov.in`. Each municipal corporation (Nagar Nigam) maps its local CAAQMS sensor stations by latitude/longitude, automatically feeding minute-by-minute PM2.5, PM10, SO2, NOx, and CO streams into the Gemini Risk Engine.

### 2. Privacy-Preserving Federated Architecture
- **Citizen Data Sovereignty**: Raw citizen photographs, device fingerprints, and exact GPS coordinates are processed and stored strictly within the municipal edge server. No citizen PII leaves the city boundary.
- **Federated Insight Exchange**: Rather than sending raw data to a central cloud, each city node computes local model gradients and dispersion vectors (e.g. how industrial stack emissions disperse under seasonal North-Westerly winds). Only these sanitized weights and heuristics are synchronized with the national aggregator.
- **Transboundary Early Warning**: Downwind cities (e.g. Varanasi or Patna) receive proactive alerts 12–24 hours before transboundary agricultural or industrial plumes reach their boundaries, enabling proactive mist cannon deployment and school advisories before air quality drops.

---

## 📋 Hackathon Deliverable Checklist

| Requirement | Implementation Status | Location |
| :--- | :--- | :--- |
| **End-to-End Flow** | Citizen submits photo & location → Gemini Vision analyzes → Risk score computed → Colored marker appears on map → Alert auto-fires if risk &ge; 70 | Tested & Verified |
| **Google Gemini Multimodal Vision** | Real `gemini-2.0-flash` multimodal call classifying 5 pollution categories and 3 severity levels | [`backend/gemini_service.py` L62](file:///d:/Air-watchAI/backend/gemini_service.py#L62) |
| **Google Gemini Reasoning Engine** | Real `gemini-2.0-flash` multivariable prompt returning structured JSON `{risk_score, status, likely_cause, recommended_action}` | [`backend/gemini_service.py` L138](file:///d:/Air-watchAI/backend/gemini_service.py#L138) |
| **Interactive Map** | Leaflet map with color-coded markers (🟢 &lt;50, 🟠 50-79, 🔴 80+) and interactive popups | [`frontend/src/components/CityMap.jsx`](file:///d:/Air-watchAI/frontend/src/components/CityMap.jsx) |
| **Authority Alert Panel** | Complete lifecycle workflow: `Pending` &rarr; `Assigned` &rarr; `Resolved` | [`frontend/src/components/AuthorityAlertPanel.jsx`](file:///d:/Air-watchAI/frontend/src/components/AuthorityAlertPanel.jsx) |
| **Cross-City Federation** | Architecture schematic and explanation of privacy-preserving multi-state scaling | [`frontend/src/components/FederationSection.jsx`](file:///d:/Air-watchAI/frontend/src/components/FederationSection.jsx) |
| **Indian City Seed Data** | Realistic PM2.5 readings (100–200 range) for Kanpur, Lucknow, Prayagraj modeled on CPCB | [`backend/seed_data.py`](file:///d:/Air-watchAI/backend/seed_data.py) |
| **Zero-Crash Live Demo Guarantee** | Automatic labeled fallback simulation if no API key is provided | [`backend/gemini_service.py` L228](file:///d:/Air-watchAI/backend/gemini_service.py#L228) |

---

## 👥 Authors
Built for the **Google AI Hackathon — Clean Air & Climate Resilience Track**.
