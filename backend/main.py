import sys
import os

# --- FIX FOR PYLANCE IMPORT ERROR ---
# This adds the project's root directory to the Python path
# so that it can find the 'routers' and 'models' modules.
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
# ------------------------------------

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from router.chat import router as chat_router

# Load environment variables from the .env file
load_dotenv()

# Initialize the main FastAPI application instance
app = FastAPI(title="HOMH04 AI Chatbot API")

# --- CORS Middleware ---
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*" # A simple wildcard for hackathon purposes
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Connection ---
@app.on_event("startup")
async def startup_db_client():
    """Connects to MongoDB when the app starts up."""
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        raise ValueError("MONGO_URI environment variable not set!")
    app.mongodb_client = AsyncIOMotorClient(mongo_uri)
    app.database = app.mongodb_client["homh04_db"]
    print("🚀 Successfully connected to the MongoDB database.")

@app.on_event("shutdown")
async def shutdown_db_client():
    """Closes the MongoDB connection when the app shuts down."""
    app.mongodb_client.close()
    print("MongoDB connection closed.")

# --- API Routers ---
app.include_router(chat_router, prefix="/api")

# --- Root Endpoint ---
@app.get("/")
def read_root():
    """Root GET endpoint for health check."""
    return {"status": "ok", "message": "HOMH04 Backend is online and ready!"}