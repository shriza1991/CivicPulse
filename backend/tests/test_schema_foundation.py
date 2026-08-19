"""
Unit tests for Phase 2 database schema foundation: CensusDemographics, PolicyRecommendation, and extended Cluster/Issue models.
"""
import pytest
from sqlmodel import Session, select
from app.models.demographics import CensusDemographics
from app.models.policy_recommendation import PolicyRecommendation
from app.models.cluster import Cluster
from app.models.issue import Issue

def test_census_demographics_model_persistence(session: Session):
    demo = CensusDemographics(
        country_code="IND",
        region_code="MH_MUM",
        ward_id="WARD_MUM_01",
        ward_name="Dharavi Ward M-East",
        population_density=35000.0,
        vulnerable_ratio=0.45,
        poverty_rate=0.38,
        primary_language="hi"
    )
    session.add(demo)
    session.commit()

    saved = session.exec(select(CensusDemographics).where(CensusDemographics.ward_id == "WARD_MUM_01")).first()
    assert saved is not None
    assert saved.country_code == "IND"
    assert saved.population_density == 35000.0
    assert saved.vulnerable_ratio == 0.45

def test_extended_cluster_and_policy_recommendation_relation(session: Session):
    cluster = Cluster(
        area_label="Kurla West Bus Depot",
        category="Road Infrastructure",
        country_code="IND",
        center_lat=19.065,
        center_lng=72.879,
        report_count=12,
        priority_score=84.5,
        demographic_impact_score=92.0,
        status="active"
    )
    session.add(cluster)
    session.commit()

    rec = PolicyRecommendation(
        cluster_id=cluster.id,
        country_code="IND",
        title="Emergency Asphalt Resurfacing & Drainage Overhaul",
        summary="High-density pothole cluster causing traffic delays and safety hazards near transport hub.",
        action_type="infrastructure_repair",
        priority_score=84.5,
        estimated_budget=450000.0,
        currency="INR"
    )
    session.add(rec)
    session.commit()

    saved_rec = session.exec(select(PolicyRecommendation).where(PolicyRecommendation.cluster_id == cluster.id)).first()
    assert saved_rec is not None
    assert saved_rec.currency == "INR"
    assert saved_rec.estimated_budget == 450000.0
    assert saved_rec.action_type == "infrastructure_repair"

def test_extended_issue_model(session: Session):
    issue = Issue(
        photo_url="/static/uploads/test.jpg",
        audio_url="/static/uploads/voice.wav",
        latitude=19.065,
        longitude=72.879,
        country_code="IND",
        ward_id="WARD_MUM_01",
        issue_type="road_damage",
        severity=4,
        description="Severe asphalt collapse",
        credibility_score=0.92
    )
    session.add(issue)
    session.commit()

    saved_issue = session.exec(select(Issue).where(Issue.photo_url == "/static/uploads/test.jpg")).first()
    assert saved_issue is not None
    assert saved_issue.audio_url == "/static/uploads/voice.wav"
    assert saved_issue.country_code == "IND"
    assert saved_issue.ward_id == "WARD_MUM_01"
