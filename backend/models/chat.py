# in backend/models/chat.py
from pydantic import BaseModel, Field
from typing import Optional, List

# Define the shape of a single chat message for history
class ChatMessage(BaseModel):
    role: str # "user" or "model"
    parts: List[str]

# Define the shape of the persona object
class Persona(BaseModel):
    id: str # "doraemon", "shizuka", or "custom"
    name: Optional[str] = None
    description: Optional[str] = None
    tone: Optional[str] = None

# This is our new main request model
class ChatRequest(BaseModel):
    message: str
    persona: Persona
    chatHistory: List[ChatMessage] = Field(default_factory=list)

# MoodLogRequest remains the same
class MoodLogRequest(BaseModel):
    score: int