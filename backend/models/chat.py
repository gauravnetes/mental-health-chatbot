from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    persona: str = "default" # e.g., "doraemon"
    customPrompt: Optional[str] = None # This is the new field

class MoodLogRequest(BaseModel):
    score: int