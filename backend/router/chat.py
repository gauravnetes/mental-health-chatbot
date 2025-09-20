import os
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse
from models.chat import ChatRequest, MoodLogRequest
from datetime import datetime
from utils.chatbot import get_gemini_response_stream

router = APIRouter()

# @router.post("/chat")
# async def handle_chat(request: ChatRequest):
#     google_api_key = os.getenv("GOOGLE_API_KEY")
#     if not google_api_key:
#         raise HTTPException(status_code=500, detail="GOOGLE_API_KEY not configured on server.")

#     prompt_to_use = request.customPrompt if request.customPrompt else request.persona
    
#     ai_response = await get_gemini_response(
#         api_key=google_api_key,
#         message=request.message,
#         prompt_input=prompt_to_use,
#         is_custom=(request.customPrompt is not None)
#     )
    
#     if not ai_response:
#         raise HTTPException(status_code=500, detail="Failed to get AI response.")
        
#     return {"response": ai_response}

@router.post("/chat/stream")
async def handle_chat_stream(request: ChatRequest): # The request body is now the new model
    google_api_key = os.getenv("GOOGLE_API_KEY")
    if not google_api_key:
        async def error_stream():
            yield "Error: GOOGLE_API_KEY not configured on server."
        return StreamingResponse(error_stream(), media_type="text/event-stream")

    return StreamingResponse(
        get_gemini_response_stream(
            api_key=google_api_key,
            request=request # Pass the entire request object
        ),
        media_type="text/event-stream"
    )

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