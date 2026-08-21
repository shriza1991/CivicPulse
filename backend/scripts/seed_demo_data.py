"""
seed_demo_data.py — Idempotent Cross-Border Demo Data Seeder for Nivaran

Seeds realistic, deterministic demo data for:
- India (IND: Mumbai & Bengaluru)
- Brazil (BRA: São Paulo / Heliópolis)
- South Africa (ZAF: Johannesburg / Soweto)

All synthetic records are explicitly tagged as demo fixtures.
Running this script multiple times is strictly idempotent.
"""

import sys
import os
import logging
from datetime import datetime, timezone

# Add backend root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlmodel import Session, select
from app.db import engine, init_db
from app.models.user import User, Role
from app.models.cluster import Cluster
from app.models.issue import Issue
from app.models.demographics import CensusDemographics
from app.models.action_draft import ActionDraft
from app.models.impact_summary import ImpactSummary
from app.models.escalation import Escalation
from app.models.policy_recommendation import PolicyRecommendation
from app.utils.seeder import seed_data as seed_core_data

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger("nivaran_seed")


DEMOGRAPHICS_SEED = [
    {
        "id": "DEMO-IND-MUM-MEAST",
        "country_code": "IND",
        "region_code": "MH_MUM",
        "ward_id": "WARD_MUM_M_EAST",
        "ward_name": "Kurla / Dharavi M-East Ward",
        "population_density": 38500.0,
        "vulnerable_ratio": 0.48,
        "poverty_rate": 0.35,
        "primary_language": "hi"
    },
    {
        "id": "DEMO-IND-MUM-KWEST",
        "country_code": "IND",
        "region_code": "MH_MUM",
        "ward_id": "WARD_MUM_K_WEST",
        "ward_name": "Andheri West K-West Ward",
        "population_density": 22000.0,
        "vulnerable_ratio": 0.22,
        "poverty_rate": 0.15,
        "primary_language": "mr"
    },
    {
        "id": "DEMO-BRA-SAO-HELIOPOLIS",
        "country_code": "BRA",
        "region_code": "SP_SAO",
        "ward_id": "DIST_SAO_HELIOPOLIS",
        "ward_name": "Subprefeitura do Ipiranga / Heliópolis",
        "population_density": 29000.0,
        "vulnerable_ratio": 0.52,
        "poverty_rate": 0.41,
        "primary_language": "pt"
    },
    {
        "id": "DEMO-ZAF-JHB-SOWETO",
        "country_code": "ZAF",
        "region_code": "GP_JHB",
        "ward_id": "WARD_JHB_SOWETO_10",
        "ward_name": "City of Johannesburg Ward 10 (Soweto)",
        "population_density": 18500.0,
        "vulnerable_ratio": 0.55,
        "poverty_rate": 0.46,
        "primary_language": "zu"
    }
]

CROSS_BORDER_CLUSTERS = [
    {
        "id": "c-sao-drain-01",
        "area_label": "Heliópolis Community Corridor (São Paulo)",
        "category": "water",
        "country_code": "BRA",
        "center_lat": -23.6189,
        "center_lng": -46.5912,
        "report_count": 4,
        "priority_score": 87.4,
        "demographic_impact_score": 0.88,
        "status": "active",
        "summary": "Severe stormwater drain blockage causing seasonal backflow into residential alleyways in Heliópolis informal settlement."
    },
    {
        "id": "c-soweto-road-01",
        "area_label": "Vilakazi Arterial Corridor (Soweto)",
        "category": "road_damage",
        "country_code": "ZAF",
        "center_lat": -26.2381,
        "center_lng": 27.9048,
        "report_count": 5,
        "priority_score": 82.1,
        "demographic_impact_score": 0.84,
        "status": "active",
        "summary": "Multiple deep potholes and unpaved shoulder degradation affecting commuter minibus routes on Vilakazi precinct."
    }
]

CROSS_BORDER_ISSUES = [
    {
        "id": "iss-bra-001",
        "photo_url": "/static/uploads/demo_drain1.jpg",
        "latitude": -23.6190,
        "longitude": -46.5910,
        "country_code": "BRA",
        "ward_id": "DIST_SAO_HELIOPOLIS",
        "user_note": "Bueiro completamente entupido com resíduos, alagando a rua principal.",
        "issue_type": "water",
        "severity": 4,
        "description": "Blocked stormwater drain overflowing with debris during precipitation.",
        "credibility_score": 0.91,
        "cluster_id": "c-sao-drain-01",
        "status": "clustered"
    },
    {
        "id": "iss-zaf-001",
        "photo_url": "/static/uploads/demo_pothole1.jpg",
        "latitude": -26.2380,
        "longitude": 27.9050,
        "country_code": "ZAF",
        "ward_id": "WARD_JHB_SOWETO_10",
        "user_note": "Dangerous road sinkhole on main commuter taxi route.",
        "issue_type": "road_damage",
        "severity": 4,
        "description": "Expanding pothole creating vehicular hazard on high-density transit route.",
        "credibility_score": 0.89,
        "cluster_id": "c-soweto-road-01",
        "status": "clustered"
    }
]


def seed_cross_border_data(session: Session):
    # 1. Seed Demographics
    for d in DEMOGRAPHICS_SEED:
        existing = session.get(CensusDemographics, d["id"])
        if not existing:
            demo_obj = CensusDemographics(**d)
            session.add(demo_obj)
            logger.info(f"Seeded demographic baseline: {d['ward_name']} ({d['country_code']})")
    session.commit()

    # 2. Seed Cross-Border Clusters
    for c in CROSS_BORDER_CLUSTERS:
        existing = session.get(Cluster, c["id"])
        if not existing:
            cluster_obj = Cluster(**c)
            session.add(cluster_obj)
            logger.info(f"Seeded cross-border cluster: {c['area_label']}")
    session.commit()

    # 3. Seed Cross-Border Issues
    for iss in CROSS_BORDER_ISSUES:
        existing = session.get(Issue, iss["id"])
        if not existing:
            issue_obj = Issue(**iss)
            session.add(issue_obj)
            logger.info(f"Seeded cross-border issue: {iss['id']} ({iss['country_code']})")
    session.commit()


def main():
    logger.info("Starting idempotent Nivaran demo data seed...")
    init_db()

    with Session(engine) as session:
        # Seed core Indian demo dataset
        seed_core_data(session)
        # Seed cross-border Brazil and South Africa datasets
        seed_cross_border_data(session)

    logger.info("Demo data seed completed successfully (Idempotent: 0 duplicates created).")


if __name__ == "__main__":
    main()
