"""
test_data_fusion.py — Unit tests for Phase 5 Data Fusion engine.
"""
import pytest
from sqlmodel import Session, select
from app.models.cluster import Cluster
from app.models.demographics import CensusDemographics
from app.services.data_fusion_service import (
    resolve_ward_for_location,
    get_fused_cluster_context,
    FusedClusterContext
)

def test_resolve_ward_for_location():
    # India locations
    ward_ind_south = resolve_ward_for_location("IND", 19.065, 72.879)
    assert ward_ind_south == "WARD_MUM_M_EAST"

    ward_ind_north = resolve_ward_for_location("IND", 19.120, 72.850)
    assert ward_ind_north == "WARD_MUM_K_WEST"

    # Brazil location
    ward_bra = resolve_ward_for_location("BRA", -23.5505, -46.6333)
    assert ward_bra == "DIST_SAO_HELIOPOLIS"

    # South Africa location
    ward_zaf = resolve_ward_for_location("ZAF", -26.2041, 28.0473)
    assert ward_zaf == "WARD_JHB_SOWETO_10"

def test_get_fused_cluster_context(session: Session):
    # Setup test cluster in India
    cluster = Cluster(
        area_label="Kurla West Bus Depot",
        category="Road Infrastructure",
        country_code="IND",
        center_lat=19.065,
        center_lng=72.879,
        report_count=8,
        priority_score=78.5,
        status="active"
    )
    session.add(cluster)
    session.commit()

    fused = get_fused_cluster_context(cluster.id, session)
    assert fused is not None
    assert fused.cluster_id == cluster.id
    assert fused.country_code == "IND"
    assert fused.ward_id == "WARD_MUM_M_EAST"
    assert fused.population_density > 0
    assert fused.is_demo is True
    assert len(fused.infrastructure_assets) > 0
    assert len(fused.public_investments) > 0
    assert "Census Data" in fused.provenance
