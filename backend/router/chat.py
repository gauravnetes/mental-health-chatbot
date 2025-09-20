from fastapi import APIRouter, Request, HTTPException
from models.chat import ChatRequest, MoodLogRequest
from datetime import datetime
from utils.chatbot import get_gemini_response # <-- IMPORT THIS
from fastapi.responses import StreamingResponse # <-- IMPORT THIS
from utils.chatbot import get_gemini_response_stream # <-- IMPORT THE NEW FUNCTION


router = APIRouter()

@router.post("/chat")
async def handle_chat(request: ChatRequest):
    # TODO: Add a safety check for crisis keywords before calling the AI
    
    # Call our new Gemini utility function
    prompt_to_use = request.customPrompt if request.customPrompt else request.persona
    
    ai_response = await get_gemini_response(
        message=request.message,
        prompt_input=prompt_to_use, # Pass the chosen prompt/persona
        is_custom=(request.customPrompt is not None)
    )
    
    if not ai_response: 
        raise HTTPException(status_code=500, detail="Failed to get AI response.")
        
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


@router.post("/chat/stream")
async def handle_chat_stream(request: ChatRequest):
    prompt_to_use = request.customPrompt if request.customPrompt else request.persona
    
    # Return a StreamingResponse that calls our generator
    return StreamingResponse(
        get_gemini_response_stream(
            message=request.message,
            prompt_input=prompt_to_use,
            is_custom=(request.customPrompt is not None)
        ),
        media_type="text/event-stream"
    )