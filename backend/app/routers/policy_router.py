"""
policy_router.py — Policy Brief & Advisor Endpoints (Phase 7)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from sqlmodel import Session, select
from datetime import datetime, timezone

from app.db import get_session
from app.models.policy_recommendation import PolicyRecommendation
from app.services.policy_advisor_service import generate_policy_recommendation

router = APIRouter(prefix="/policy", tags=["policy"])

class ReviewRequest(BaseModel):
    status: str  # "approved", "rejected", "drafted"
    reviewer_note: Optional[str] = None

@router.post("/generate/{cluster_id}", response_model=PolicyRecommendation)
async def create_or_update_policy_recommendation(
    cluster_id: str,
    session: Session = Depends(get_session)
):
    try:
        rec = await generate_policy_recommendation(cluster_id, session)
        return rec
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate policy recommendation: {str(e)}")

@router.get("/recommendations/{cluster_id}", response_model=PolicyRecommendation)
async def get_policy_recommendation(
    cluster_id: str,
    session: Session = Depends(get_session)
):
    rec = session.exec(
        select(PolicyRecommendation).where(PolicyRecommendation.cluster_id == cluster_id)
    ).first()
    if not rec:
        raise HTTPException(status_code=404, detail="No policy recommendation found for this cluster.")
    return rec

@router.post("/recommendations/{id}/review", response_model=PolicyRecommendation)
async def review_policy_recommendation(
    id: str,
    body: ReviewRequest,
    session: Session = Depends(get_session)
):
    rec = session.get(PolicyRecommendation, id)
    if not rec:
        raise HTTPException(status_code=404, detail="Policy recommendation not found.")

    if body.status not in ["approved", "rejected", "drafted"]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be 'approved', 'rejected', or 'drafted'.")

    rec.status = body.status
    rec.reviewed_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    session.add(rec)
    session.commit()
    session.refresh(rec)
    return rec
