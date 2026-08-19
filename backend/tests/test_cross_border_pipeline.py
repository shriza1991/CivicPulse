"""
test_cross_border_pipeline.py — Multi-Country End-to-End Test Suite (Phase 9)

Verifies the full Nivaran intelligence flow for India (IND), Brazil (BRA), and South Africa (ZAF):
  1. Intake & Spatial Clustering
  2. Demographic, Infrastructure & Investment Data Fusion
  3. Deterministic Priority Engine Calculation
  4. Gemini Policy Brief Generation
"""
import pytest
from sqlmodel import Session, select
from app.models.cluster import Cluster
from app.models.issue import Issue
from app.services.country_adapters import get_country_config, list_supported_countries, format_currency
from app.services.data_fusion_service import get_fused_cluster_context
from app.services.priority_engine import compute_cluster_priority_breakdown
from app.services.policy_advisor_service import generate_policy_recommendation

def test_country_registry_completeness():
    countries = list_supported_countries()
    assert len(countries) >= 3
    codes = {c.country_code for c in countries}
    assert {"IND", "BRA", "ZAF"}.issubset(codes)

    assert format_currency(50000.0, "IND").startswith("₹")
    assert format_currency(50000.0, "BRA").startswith("R$")
    assert format_currency(50000.0, "ZAF").startswith("R")

@pytest.mark.asyncio
@pytest.mark.parametrize("country_code,lat,lng,expected_currency,expected_ward", [
    ("IND", 19.065, 72.879, "INR", "WARD_MUM_M_EAST"),
    ("BRA", -23.5505, -46.6333, "BRL", "DIST_SAO_HELIOPOLIS"),
    ("ZAF", -26.2041, 28.0473, "ZAR", "WARD_JHB_SOWETO_10")
])
async def test_end_to_end_cross_border_pipeline(
    session: Session,
    country_code: str,
    lat: float,
    lng: float,
    expected_currency: str,
    expected_ward: str
):
    country_config = get_country_config(country_code)
    assert country_config.currency_code == expected_currency

    # 1. Create Cluster & Member Issues
    cluster = Cluster(
        area_label=f"Hotspot in {country_config.country_name}",
        category="Public Infrastructure",
        country_code=country_code,
        center_lat=lat,
        center_lng=lng,
        report_count=7,
        priority_score=80.0,
        status="active"
    )
    session.add(cluster)
    session.commit()

    for i in range(7):
        iss = Issue(
            cluster_id=cluster.id,
            photo_url=f"/static/uploads/cross_border_{country_code.lower()}_{i+1}.jpg",
            latitude=lat,
            longitude=lng,
            country_code=country_code,
            issue_type="road_damage",
            severity=4,
            credibility_score=0.90,
            description=f"Citizen report {i+1} in {country_config.country_name}"
        )
        session.add(iss)
    session.commit()

    # 2. Data Fusion
    fused_context = get_fused_cluster_context(cluster.id, session)
    assert fused_context.country_code == country_code
    assert fused_context.ward_id == expected_ward
    assert fused_context.population_density > 0

    # 3. Deterministic Priority Engine
    priority_breakdown = compute_cluster_priority_breakdown(
        signal_count=7,
        avg_severity=4.0,
        avg_trust_score=0.90,
        fused_context=fused_context
    )
    assert 0.0 <= priority_breakdown.total_score <= 100.0
    assert priority_breakdown.vulnerability_score > 0

    # 4. Policy Advisor Brief
    rec = await generate_policy_recommendation(cluster.id, session)
    assert rec is not None
    assert rec.country_code == country_code
    assert rec.currency == expected_currency
    assert rec.status == "drafted"
    assert rec.priority_score == priority_breakdown.total_score
