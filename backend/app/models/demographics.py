"""
Demographics model for Ward / Area level census and vulnerability data.
"""
import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

class CensusDemographics(SQLModel, table=True):
    __tablename__ = "census_demographics"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    country_code: str = Field(default="IND", index=True)  # IND, BRA, ZAF
    region_code: str = Field(index=True)                  # State / Province / District code
    ward_id: str = Field(index=True)                     # Ward or Census tract identifier
    ward_name: str
    population_density: float                            # People per sq km
    vulnerable_ratio: float = Field(default=0.0)         # Ratio of elderly, low-income, disabled (0.0 - 1.0)
    poverty_rate: float = Field(default=0.0)             # Poverty index (0.0 - 1.0)
    primary_language: str = Field(default="en")
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"))
