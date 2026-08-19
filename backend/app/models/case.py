from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import uuid
from sqlmodel import SQLModel, Field, JSON, Relationship

class Department(SQLModel, table=True):
    __tablename__ = "departments"

    id: str = Field(default_factory=lambda: f"DEP-{uuid.uuid4().hex[:6].upper()}", primary_key=True, index=True)
    name: str = Field(unique=True, index=True) # Roads & Infrastructure, Solid Waste Management, Water Supply, Electrical
    code: str = Field(unique=True, index=True) # ROADS, WASTE, WATER, ELEC
    ward_name: str = Field(default="K-East Ward")
    contact_email: Optional[str] = Field(default=None)
    contact_phone: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OfficerProfile(SQLModel, table=True):
    __tablename__ = "officer_profiles"

    id: str = Field(default_factory=lambda: f"OFF-{uuid.uuid4().hex[:6].upper()}", primary_key=True, index=True)
    user_id: str = Field(foreign_key="users.id", unique=True, index=True)
    department_id: str = Field(foreign_key="departments.id", index=True)
    designation: str = Field(default="Assistant Engineer")
    badge_number: str = Field(unique=True, index=True)
    is_available: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CaseAssignment(SQLModel, table=True):
    __tablename__ = "case_assignments"

    id: str = Field(default_factory=lambda: f"ASN-{uuid.uuid4().hex[:12].upper()}", primary_key=True, index=True)
    issue_id: str = Field(foreign_key="issues.id", index=True)
    department_id: Optional[str] = Field(default=None, foreign_key="departments.id", index=True)
    assigned_officer_id: Optional[str] = Field(default=None, foreign_key="users.id", index=True)
    assigned_by_id: Optional[str] = Field(default=None, foreign_key="users.id")
    assigned_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = Field(default="active", index=True) # active, transferred, unassigned
    notes: Optional[str] = Field(default=None)

class CaseTransition(SQLModel, table=True):
    __tablename__ = "case_transitions"

    id: str = Field(default_factory=lambda: f"TRN-{uuid.uuid4().hex[:12].upper()}", primary_key=True, index=True)
    issue_id: str = Field(foreign_key="issues.id", index=True)
    actor_id: Optional[str] = Field(default=None, foreign_key="users.id", index=True)
    actor_role: str = Field(default="system")
    actor_department: Optional[str] = Field(default=None)
    previous_state: str = Field(index=True)
    new_state: str = Field(index=True)
    action: str = Field(index=True) # assign, acknowledge, accept, repair_complete, verify, resolve, close, reopen, escalate
    reason: Optional[str] = Field(default=None)
    metadata_json: Dict[str, Any] = Field(default={}, sa_type=JSON)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), index=True)

class RepairVerification(SQLModel, table=True):
    __tablename__ = "repair_verifications"

    id: str = Field(default_factory=lambda: f"REP-{uuid.uuid4().hex[:12].upper()}", primary_key=True, index=True)
    issue_id: str = Field(foreign_key="issues.id", index=True)
    officer_id: Optional[str] = Field(default=None, foreign_key="users.id", index=True)
    before_photo_url: str = Field(nullable=False)
    after_photo_url: str = Field(nullable=False)
    officer_notes: Optional[str] = Field(default=None)
    repair_cost: Optional[float] = Field(default=None)
    contractor_name: Optional[str] = Field(default=None)
    completed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    verification_status: str = Field(default="pending_community", index=True) # pending_community, verified_passed, verified_failed
    ai_confidence_score: float = Field(default=0.92)
    community_votes_passed: int = Field(default=0)
    community_votes_failed: int = Field(default=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ResolutionRecord(SQLModel, table=True):
    __tablename__ = "resolution_records"

    id: str = Field(default_factory=lambda: f"RES-{uuid.uuid4().hex[:12].upper()}", primary_key=True, index=True)
    issue_id: str = Field(foreign_key="issues.id", index=True)
    resolution_summary: str = Field(nullable=False)
    resolved_by_id: Optional[str] = Field(default=None, foreign_key="users.id")
    resolution_type: str = Field(default="repaired") # repaired, invalid, duplicate, structural_redesign
    resolved_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
