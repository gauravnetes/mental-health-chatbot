import google.generativeai as genai
from google.api_core import exceptions
from models.chat import ChatRequest

# --- Persona Prompts ---
persona_prompts = {
    "doraemon": "You are Doraemon... a helpful and optimistic robotic cat. Your specialty is offering practical solutions and tools, which you should refer to as 'gadgets' from your pocket. Your tone is always encouraging and friendly.",
    "shizuka": "You are Shizuka... a kind, gentle, and deeply empathetic friend. Your primary goal is to make the user feel heard, validated, and safe. Use soft, reassuring language and focus on emotional support.",
    "default": "You are a helpful and compassionate mental health chatbot. Listen carefully and respond with empathy."
}

async def get_gemini_response_stream(api_key: str, request: ChatRequest):
    """
    Generates a streamed response from Gemini using a full chat request object.
    """
    try:
        genai.configure(api_key=api_key)
        
        system_prompt = ""
        # Check if it's a custom persona and build the prompt
        if request.persona.id == "custom" and request.persona.description:
            system_prompt = f"""
              You are a chatbot persona named {request.persona.name}.
              Your core identity is: "{request.persona.description}".
              You must always communicate in a {request.persona.tone} style.
              Your goal is to be a supportive companion.
            """
        else:
            # Otherwise, look up the pre-made persona prompt
            system_prompt = persona_prompts.get(request.persona.id.lower(), persona_prompts["default"])

        # Format the chat history for the Gemini API
        history = [{"role": msg.role, "parts": msg.parts} for msg in request.chatHistory]
        
        # Initialize the model with the system instruction and chat history
        model = genai.GenerativeModel(
            'gemini-1.5-flash-latest',
            system_instruction=system_prompt
        )
        chat = model.start_chat(history=history)

        # Send the new message and stream the response
        response_stream = await chat.send_message_async(request.message, stream=True)
        
        async for chunk in response_stream:
            if chunk.text:
                yield chunk.text
                
    except Exception as e:
        print(f"Error during streaming: {e}")
        yield "I'm sorry, an error occurred. Please try again."


async def get_gemini_response(api_key: str, message: str, prompt_input: str, is_custom: bool):
    """Gets a full response from the Gemini API using a provided API key."""
    try:
        # Configure the API key just-in-time
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')

        system_prompt = prompt_input if is_custom else persona_prompts.get(prompt_input.lower(), persona_prompts["default"])
        full_prompt = f"{system_prompt}\n\nUser: {message}\n\nAI:"

        response = await model.generate_content_async(full_prompt)
        return response.text
    except exceptions.PermissionDenied as e:
        print(f"Authentication Error: {e}")
        return "Error: The provided API Key is invalid or has insufficient permissions."
    except Exception as e:
        print(f"Error generating response from Gemini: {e}")
        return None