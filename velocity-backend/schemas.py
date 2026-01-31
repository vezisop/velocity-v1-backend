from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class GPSPoint(BaseModel):
    lat: float
    lon: float
    timestamp: Optional[datetime] = None

class ActivityUpload(BaseModel):
    title: str
    user_id: int
    description: Optional[str] = None
    points: List[GPSPoint]

class ActivityResponse(BaseModel):
    id: Optional[int]
    name: str
    distance_km: float
    moving_time_seconds: int
    elevation_gain_meters: float
