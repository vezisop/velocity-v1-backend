from fastapi import FastAPI
from database import init_db

# Import Routers
from api.routers import activities

app = FastAPI(title="Velocity API", version="1.0.0")

# --- Lifecycle ---
@app.get("/")
async def root():
    return {"status": "running", "service": "Velocity Backend", "docs": "/docs"}

@app.on_event("startup")
async def on_startup():
    print("Connecting to PostGIS...")
    await init_db()
    print("Database Connected & Schemas Verified.")

# --- Include Routers ---
app.include_router(activities.router, prefix="/activities", tags=["Activities"])
