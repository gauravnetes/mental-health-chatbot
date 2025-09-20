import os
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse
from models.chat import ChatRequest, MoodLogRequest
from datetime import datetime
from utils.chatbot import generate_stream_response

router = APIRouter()

@router.post("/chat/stream")
async def serve_streaming_chat(payload: ChatRequest):
    gemini_api_key = os.getenv("GOOGLE_API_KEY")
    if not gemini_api_key:
        async def error_generator():
            yield "Configuration error: The server's API key is missing."
        return StreamingResponse(error_generator(), media_type="text/event-stream")

    # print(f"Received request body: {payload.model_dump()}")
    return StreamingResponse(
        generate_stream_response(
            api_key=gemini_api_key,
            chat_payload=payload 
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