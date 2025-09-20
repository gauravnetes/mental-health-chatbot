from fastapi import APIRouter, Request, HTTPException
from models.chat import ChatRequest, MoodLogRequest
from datetime import datetime
from utils.chatbot import get_gemini_response # <-- IMPORT THIS

router = APIRouter()

@router.post("/chat")
async def handle_chat(request: ChatRequest):
    # TODO: Add a safety check for crisis keywords before calling the AI
    
    # Call our new Gemini utility function
    ai_response = await get_gemini_response(message=request.message, persona=request.persona)
    
    if not ai_response:
        raise HTTPException(status_code=500, detail="Failed to get a response from the AI model.")
        
    return {"response": ai_response}

# The /log-mood endpoint remains unchanged
@router.post("/log-mood")
async def log_mood(request: MoodLogRequest, http_request: Request):
    db = http_request.app.database
    mood_collection = db["mood_logs"]
    
    log_entry = {
        "score": request.score,
        "timestamp": datetime.now()
    }
    
    result = await mood_collection.insert_one(log_entry)
    return {"status": "success", "log_id": str(result.inserted_id)}