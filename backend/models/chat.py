from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    persona: str = "default" # e.g., "doraemon"

class MoodLogRequest(BaseModel):
    score: int