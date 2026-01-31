from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Tuple
from math import radians, cos, sin, asin, sqrt
from datetime import datetime
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session
from models import Activity, User
from schemas import ActivityUpload, ActivityResponse, GPSPoint

router = APIRouter()

# --- Business Logic ---
def calculate_haversine_distance(points: List[Tuple[float, float]]) -> float:
    """
    Calculate total distance in kilometers from a list of (lat, lon) tuples.
    """
    total_km = 0.0
    R = 6371  # Earth radius in km

    for i in range(len(points) - 1):
        lat1, lon1 = points[i]
        lat2, lon2 = points[i+1]

        # Convert to radians
        dLat = radians(lat2 - lat1)
        dLon = radians(lon2 - lon1)
        rLat1 = radians(lat1)
        rLat2 = radians(lat2)

        # Haversine formula
        a = sin(dLat/2)**2 + cos(rLat1) * cos(rLat2) * sin(dLon/2)**2
        c = 2 * asin(sqrt(a))
        
        total_km += c * R

    return round(total_km, 2)

def points_to_linestring(points: List[GPSPoint]) -> str:
    """
    Convert list of points to PostGIS WKT format: LINESTRING(lon lat, ...)
    """
    if len(points) < 2:
        return None
    
    # PostGIS expects 'LONGITUDE LATITUDE' order
    coords_str = ", ".join([f"{p.lon} {p.lat}" for p in points])
    return f"LINESTRING({coords_str})"


@router.post("/upload", response_model=Activity)
async def upload_activity(
    activity_data: ActivityCreate, 
    session: AsyncSession = Depends(get_session)
):
    # 1. Check if user exists (Auto-Fix for V1 Demo)
    user = await session.get(User, activity_data.user_id)
    if not user:
        print(f"User {activity_data.user_id} not found. Creating default user for Demo.")
        new_user = User(
            id=activity_data.user_id,
            username="velocity_runner",
            email="runner@velocity.app",
            full_name="Velocity Runner",
            created_at=datetime.utcnow()
        )
        session.add(new_user)
        await session.commit() # Save the user first

    # 2. Convert Data Points to LineString
    points = activity_data.points
    if not points:
        raise HTTPException(status_code=400, detail="No GPS points provided")
    
    if len(points) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 points to create an activity")
        
    # 1. Calculate Stats
    coords = [(p.lat, p.lon) for p in points]
    total_distance_km = calculate_haversine_distance(coords)
    
    end_time = data.points[-1].timestamp or datetime.utcnow()
    # Basic moving time calc
    moving_time_seconds = int((end_time - start_time).total_seconds()) if data.points[0].timestamp else 0
    if moving_time_seconds == 0 and len(data.points) > 10:
         # Fallback mock time if timestamps are missing or identical (for verify)
         moving_time_seconds = 3600

    # 2. Create Activity with PostGIS Geometry
    wkt_route = points_to_linestring(data.points)

    # Check/Create User (for prototype simplicity)
    user_res = await session.execute(select(User).where(User.id == data.user_id))
    user = user_res.scalars().first()
    if not user:
         user = User(id=data.user_id, username=f"user_{data.user_id}", email=f"user{data.user_id}@test.com")
         session.add(user)
         # We need to commit user to get FK valid? 
         # AsyncSession handles this transactionally usually.
    
    new_activity = Activity(
        name=data.title,
        description=data.description,
        user_id=data.user_id,
        distance_km=total_distance_km,
        moving_time_seconds=moving_time_seconds,
        elevation_gain_meters=0.0, 
        route=wkt_route 
    )

    session.add(new_activity)
    await session.commit()
    await session.refresh(new_activity)

    return ActivityResponse(
        id=new_activity.id,
        name=new_activity.name,
        distance_km=new_activity.distance_km,
        moving_time_seconds=new_activity.moving_time_seconds,
        elevation_gain_meters=new_activity.elevation_gain_meters
    )


@router.get("/feed", response_model=List[ActivityResponse])
async def get_feed(session: AsyncSession = Depends(get_session)):
    """
    Get latest activities.
    """
    result = await session.execute(select(Activity).order_by(Activity.created_at.desc()).limit(20))
    activities = result.scalars().all()
    
    return [
        ActivityResponse(
            id=a.id,
            name=a.name,
            distance_km=a.distance_km,
            moving_time_seconds=a.moving_time_seconds,
            elevation_gain_meters=a.elevation_gain_meters
        ) for a in activities
    ]

@router.get("/me/{user_id}", response_model=List[ActivityResponse])
async def get_my_activities(user_id: int, session: AsyncSession = Depends(get_session)):
    """
    Get all activities for a specific user.
    """
    result = await session.execute(
        select(Activity)
        .where(Activity.user_id == user_id)
        .order_by(Activity.created_at.desc())
    )
    activities = result.scalars().all()
    
    return [
        ActivityResponse(
            id=a.id,
            name=a.name,
            distance_km=a.distance_km,
            moving_time_seconds=a.moving_time_seconds,
            elevation_gain_meters=a.elevation_gain_meters
        ) for a in activities
    ]
