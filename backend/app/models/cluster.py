import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

class Cluster(SQLModel, table=True):
    __tablename__ = "clusters"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    area_label: str
    category: str = Field(default="general", index=True)
    country_code: str = Field(default="IND", index=True)
    center_lat: float
    center_lng: float
    report_count: int = Field(default=1)
    priority_score: float = Field(default=0.0)
    demographic_impact_score: float = Field(default=0.0)
    status: str = Field(default="active", index=True)  # active, under_review, resolved
    summary: Optional[str] = Field(default=None, nullable=True)
    first_reported_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"))
    last_reported_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"))
