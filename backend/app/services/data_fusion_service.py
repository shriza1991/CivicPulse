"""
data_fusion_service.py — Cross-Border Data Fusion & Enrichment Engine (Phase 5)

Fuses Demand Clusters with:
1. Ward-level Census Demographics (population density, vulnerability ratio, poverty rate)
2. Nearby Infrastructure Assets (type, age, load vs capacity, condition)
3. Active Public Investments (allocated capital, spending status, target completion)

Supports India (IND), Brazil (BRA), and South Africa (ZAF).
"""
import os
import json
import logging
from typing import Dict, Any, Optional, List
from pydantic import BaseModel
from sqlmodel import Session, select
from app.models.cluster import Cluster
from app.models.demographics import CensusDemographics
from app.services.country_adapters import get_country_config

logger = logging.getLogger("nivaran")

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "..", "fixtures")

class FusedClusterContext(BaseModel):
    cluster_id: str
    country_code: str
    ward_id: str
    ward_name: str
    population_density: float
    vulnerable_ratio: float
    poverty_rate: float
    infrastructure_assets: List[Dict[str, Any]]
    public_investments: List[Dict[str, Any]]
    is_demo: bool = True
    provenance: str

def _load_json_fixture(filename: str) -> Dict[str, Any]:
    file_path = os.path.join(FIXTURES_DIR, filename)
    if not os.path.exists(file_path):
        logger.warning(f"Fixture file missing: {file_path}")
        return {}
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading fixture {filename}: {str(e)}")
        return {}

def resolve_ward_for_location(country_code: str, lat: float, lng: float) -> str:
    """
    Deterministically maps (lat, lng) to administrative Ward / District code.
    Fallback default mapping per country if strict spatial boundary check is not loaded.
    """
    code = country_code.upper() if country_code else "IND"
    if code == "IND":
        if lat > 19.10:
            return "WARD_MUM_K_WEST"
        return "WARD_MUM_M_EAST"
    elif code == "BRA":
        return "DIST_SAO_HELIOPOLIS"
    elif code == "ZAF":
        return "WARD_JHB_SOWETO_10"
    return "WARD_MUM_M_EAST"

def get_fused_cluster_context(cluster_id: str, session: Session) -> FusedClusterContext:
    """
    Fuses a Demand Cluster with demographics, infrastructure assets, and public investments.
    """
    cluster = session.get(Cluster, cluster_id)
    country_code = cluster.country_code if (cluster and cluster.country_code) else "IND"
    
    lat = cluster.center_lat if cluster else 19.065
    lng = cluster.center_lng if cluster else 72.879
    ward_id = resolve_ward_for_location(country_code, lat, lng)

    # 1. Fetch Demographics from DB or Fixture
    db_demo = session.exec(
        select(CensusDemographics).where(CensusDemographics.ward_id == ward_id)
    ).first()

    demographics_fixture = _load_json_fixture("demographics_data.json")
    country_demos = demographics_fixture.get(country_code, [])
    fixture_demo = next((d for d in country_demos if d.get("ward_id") == ward_id), None)
    if not fixture_demo and country_demos:
        fixture_demo = country_demos[0]

    ward_name = db_demo.ward_name if db_demo else (fixture_demo.get("ward_name") if fixture_demo else f"Ward {ward_id}")
    pop_density = db_demo.population_density if db_demo else (fixture_demo.get("population_density", 15000.0) if fixture_demo else 15000.0)
    vuln_ratio = db_demo.vulnerable_ratio if db_demo else (fixture_demo.get("vulnerable_ratio", 0.25) if fixture_demo else 0.25)
    pov_rate = db_demo.poverty_rate if db_demo else (fixture_demo.get("poverty_rate", 0.20) if fixture_demo else 0.20)

    # 2. Fetch Infrastructure Assets Fixtures
    infra_fixture = _load_json_fixture("infrastructure_assets.json")
    country_infra = infra_fixture.get(country_code, [])
    matched_infra = [asset for asset in country_infra if asset.get("ward_id") == ward_id]
    if not matched_infra and country_infra:
        matched_infra = country_infra

    # 3. Fetch Public Investments Fixtures
    investments_fixture = _load_json_fixture("public_investments.json")
    country_investments = investments_fixture.get(country_code, [])
    matched_investments = [inv for inv in country_investments if inv.get("ward_id") == ward_id]
    if not matched_investments and country_investments:
        matched_investments = country_investments

    provenance_info = f"Census Data ({country_code}) + Municipal Infrastructure Registry (Sample)"

    return FusedClusterContext(
        cluster_id=cluster_id,
        country_code=country_code,
        ward_id=ward_id,
        ward_name=ward_name,
        population_density=pop_density,
        vulnerable_ratio=vuln_ratio,
        poverty_rate=pov_rate,
        infrastructure_assets=matched_infra,
        public_investments=matched_investments,
        is_demo=True,
        provenance=provenance_info
    )
