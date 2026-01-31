from typing import List, Optional, Any
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from geoalchemy2 import Geometry
from sqlalchemy import Column

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(unique=True)
    full_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    activities: List["Activity"] = Relationship(back_populates="user")

class Activity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str # Renamed from title to match prompt
    user_id: int = Field(foreign_key="user.id")
    
    # Additional stats
    description: Optional[str] = None
    distance_km: float = Field(default=0.0)
    moving_time_seconds: int = Field(default=0)
    elevation_gain_meters: float = Field(default=0.0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # PostGIS Geometry column for route (LineString)
    # Using SRID 4326 (WGS 84) for GPS coordinates
    route: Any = Field(sa_column=Column(Geometry("LINESTRING", srid=4326)))
    
    user: Optional[User] = Relationship(back_populates="activities")
