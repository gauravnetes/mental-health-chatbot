import google.generativeai as genai
from google.api_core import exceptions

# --- Persona Prompts ---
persona_prompts = {
    "doraemon": "You are Doraemon... a helpful and optimistic robotic cat. Your specialty is offering practical solutions and tools, which you should refer to as 'gadgets' from your pocket. Your tone is always encouraging and friendly.",
    "shizuka": "You are Shizuka... a kind, gentle, and deeply empathetic friend. Your primary goal is to make the user feel heard, validated, and safe. Use soft, reassuring language and focus on emotional support.",
    "default": "You are a helpful and compassionate mental health chatbot. Listen carefully and respond with empathy."
}

async def get_gemini_response_stream(api_key: str, message: str, prompt_input: str, is_custom: bool):
    """Yields chunks of a response from the Gemini API using a provided API key."""
    try:
        # Configure the API key just-in-time
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        system_prompt = prompt_input if is_custom else persona_prompts.get(prompt_input.lower(), persona_prompts["default"])
        full_prompt = f"{system_prompt}\n\nUser: {message}\n\nAI:"

        response_stream = await model.generate_content_async(full_prompt, stream=True)
        async for chunk in response_stream:
            if chunk.text:
                yield chunk.text
    # Handle specific authentication error
    except exceptions.PermissionDenied as e:
        print(f"Authentication Error: {e}")
        yield "Error: The provided API Key is invalid or has insufficient permissions."
    except Exception as e:
        print(f"Error during streaming: {e}")
        yield "I'm sorry, I'm having a little trouble thinking right now."

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