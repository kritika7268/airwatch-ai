"""
Seed data for AirWatch AI.
Simulates real-time sensor streams modeled after Central Pollution Control Board (CPCB)
Continuous Ambient Air Quality Monitoring Stations (CAAQMS) available via data.gov.in.
"""

from typing import Dict, List, Any
import datetime

CITIES_DATA: Dict[str, Dict[str, Any]] = {
    "Kanpur": {
        "city": "Kanpur",
        "state": "Uttar Pradesh",
        "center_lat": 26.4499,
        "center_lng": 80.3319,
        "current_aqi": 312,
        "primary_pollutant": "PM2.5",
        "summary": "Severe particulate accumulation across industrial belts and riverfront tanneries. Low wind speed impeding dispersion.",
        "stations": [
            {
                "id": "kan-01",
                "name": "Panki Industrial Area",
                "lat": 26.4764,
                "lng": 80.2450,
                "pm25": 195.4,
                "pm10": 348.0,
                "wind_speed": 3.2,
                "temperature": 27.5,
                "humidity": 62,
                "risk_score": 88,
                "status": "Critical",
                "likely_cause": "Industrial coal boiler and thermal plant stack emissions",
                "report_count": 14,
                "last_updated": "5 mins ago"
            },
            {
                "id": "kan-02",
                "name": "Jajmau Leather Cluster",
                "lat": 26.4312,
                "lng": 80.4021,
                "pm25": 162.0,
                "pm10": 290.5,
                "wind_speed": 4.1,
                "temperature": 28.0,
                "humidity": 58,
                "risk_score": 76,
                "status": "High",
                "likely_cause": "Tannery generator fumes and heavy transport truck exhaust",
                "report_count": 9,
                "last_updated": "12 mins ago"
            },
            {
                "id": "kan-03",
                "name": "Kalyanpur GT Road",
                "lat": 26.4950,
                "lng": 80.2580,
                "pm25": 128.5,
                "pm10": 210.0,
                "wind_speed": 5.0,
                "temperature": 27.8,
                "humidity": 55,
                "risk_score": 58,
                "status": "Moderate",
                "likely_cause": "Unpaved road dust resuspension and stop-and-go diesel transit",
                "report_count": 4,
                "last_updated": "18 mins ago"
            },
            {
                "id": "kan-04",
                "name": "Civil Lines Ward 12",
                "lat": 26.4710,
                "lng": 80.3450,
                "pm25": 84.0,
                "pm10": 142.0,
                "wind_speed": 6.8,
                "temperature": 28.2,
                "humidity": 51,
                "risk_score": 42,
                "status": "Low",
                "likely_cause": "Normal urban background with good tree canopy cover",
                "report_count": 1,
                "last_updated": "22 mins ago"
            }
        ]
    },
    "Lucknow": {
        "city": "Lucknow",
        "state": "Uttar Pradesh",
        "center_lat": 26.8467,
        "center_lng": 80.9462,
        "current_aqi": 285,
        "primary_pollutant": "PM2.5",
        "summary": "High particulate levels around Talkatora industrial clusters and railway transit hubs. Surface inversion trapping vehicular smoke.",
        "stations": [
            {
                "id": "lko-01",
                "name": "Talkatora Industrial Estate",
                "lat": 26.8320,
                "lng": 80.8990,
                "pm25": 182.0,
                "pm10": 320.0,
                "wind_speed": 2.8,
                "temperature": 28.1,
                "humidity": 64,
                "risk_score": 84,
                "status": "Critical",
                "likely_cause": "Small-scale furnace burning and open biomass waste incineration",
                "report_count": 11,
                "last_updated": "8 mins ago"
            },
            {
                "id": "lko-02",
                "name": "Charbagh Transit Hub",
                "lat": 26.8310,
                "lng": 80.9230,
                "pm25": 145.6,
                "pm10": 265.0,
                "wind_speed": 3.9,
                "temperature": 28.4,
                "humidity": 59,
                "risk_score": 72,
                "status": "High",
                "likely_cause": "Heavy interstate diesel bus idling and auto-rickshaw congestion",
                "report_count": 7,
                "last_updated": "15 mins ago"
            },
            {
                "id": "lko-03",
                "name": "Gomti Nagar Vibhuti Khand",
                "lat": 26.8650,
                "lng": 81.0020,
                "pm25": 92.0,
                "pm10": 160.0,
                "wind_speed": 6.2,
                "temperature": 27.9,
                "humidity": 53,
                "risk_score": 45,
                "status": "Low",
                "likely_cause": "Moderate construction dust buffered by green park buffer zones",
                "report_count": 2,
                "last_updated": "25 mins ago"
            }
        ]
    },
    "Prayagraj": {
        "city": "Prayagraj",
        "state": "Uttar Pradesh",
        "center_lat": 25.4358,
        "center_lng": 81.8463,
        "current_aqi": 240,
        "primary_pollutant": "PM2.5",
        "summary": "Moderate to high dust and particulate loads near riverbed sand transit and Naini manufacturing zone.",
        "stations": [
            {
                "id": "pry-01",
                "name": "Naini Industrial Cluster",
                "lat": 25.3850,
                "lng": 81.8680,
                "pm25": 158.0,
                "pm10": 278.0,
                "wind_speed": 4.5,
                "temperature": 29.0,
                "humidity": 56,
                "risk_score": 75,
                "status": "High",
                "likely_cause": "Foundry emissions and heavy freight transit along NH-30",
                "report_count": 6,
                "last_updated": "10 mins ago"
            },
            {
                "id": "pry-02",
                "name": "Civil Lines Commercial Area",
                "lat": 25.4520,
                "lng": 81.8340,
                "pm25": 105.0,
                "pm10": 185.0,
                "wind_speed": 5.4,
                "temperature": 28.7,
                "humidity": 52,
                "risk_score": 48,
                "status": "Low",
                "likely_cause": "Commercial market generator sets and high peak-hour 2-wheeler density",
                "report_count": 3,
                "last_updated": "30 mins ago"
            }
        ]
    }
}

INITIAL_ALERTS: List[Dict[str, Any]] = [
    {
        "id": "ALT-1001",
        "city": "Kanpur",
        "hotspot_name": "Panki Industrial Area",
        "risk_score": 88,
        "severity": "Critical",
        "likely_cause": "Heavy black particulate plume from industrial boiler stacks combined with zero ground breeze.",
        "recommended_action": "Deploy Nagar Nigam Anti-Smog water mist canon; dispatch UPPCB regional officer flying squad for stack audit; alert Ward 16 health dispensary.",
        "status": "Pending",
        "assigned_team": None,
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "trigger_source": "Gemini AI Risk Engine (Combined PM2.5: 195.4 µg/m³ + 14 Citizen Photo Reports)"
    },
    {
        "id": "ALT-1002",
        "city": "Lucknow",
        "hotspot_name": "Talkatora Industrial Estate",
        "risk_score": 84,
        "severity": "Critical",
        "likely_cause": "Multiple open waste burning fire spots detected alongside scrap metal smelting furnaces.",
        "recommended_action": "Direct Lucknow Nagar Nigam fire suppression squad to extinguish open burning; impose section 15 Air Act stop-work notices on unregistered foundries.",
        "status": "Assigned",
        "assigned_team": "UPPCB Flying Squad Alpha & Lucknow Nagar Nigam Ward 5 Team",
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "trigger_source": "Gemini AI Risk Engine (Combined PM2.5: 182.0 µg/m³ + 11 Citizen Photo Reports)"
    },
    {
        "id": "ALT-1003",
        "city": "Kanpur",
        "hotspot_name": "Jajmau Leather Cluster",
        "risk_score": 76,
        "severity": "High",
        "likely_cause": "Heavy diesel commercial vehicle congestion coupled with unscrubbed tannery exhaust vents.",
        "recommended_action": "Enforce Kanpur Traffic Police heavy truck diversion away from residential Jajmau; verify wet scrubber operation at Unit 4 & 9.",
        "status": "Pending",
        "assigned_team": None,
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "trigger_source": "Gemini AI Risk Engine (Combined PM2.5: 162.0 µg/m³ + 9 Citizen Photo Reports)"
    }
]
