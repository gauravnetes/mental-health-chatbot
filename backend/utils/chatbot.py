import os
import google.generativeai as genai

# Configure the Gemini API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize the Gemini Pro model
model = genai.GenerativeModel('gemini-1.5-flash-latest')

# --- Persona Prompts ---
# We define the core instructions for our personas here
persona_prompts = {
    "doraemon": "You are Doraemon... a helpful and optimistic robotic cat. Your specialty is offering practical solutions and tools, which you should refer to as 'gadgets' from your pocket. Your tone is always encouraging and friendly.",
    "shizuka": "You are Shizuka... a kind, gentle, and deeply empathetic friend. Your primary goal is to make the user feel heard, validated, and safe. Use soft, reassuring language and focus on emotional support.",
    "default": "You are a helpful and compassionate mental health chatbot. Listen carefully and respond with empathy."
}

async def get_gemini_response(message: str, prompt_input: str, is_custom: bool) -> str:
    """
    Generates a response from the Gemini API based on the user's message and chosen persona.
    """
    # Select the system prompt based on the persona, or use default
    system_prompt = ""
    if is_custom:
        # If it's custom, the prompt_input is the full prompt itself
        system_prompt = prompt_input
    else:
        # If it's not custom, the prompt_input is a key like "doraemon"
        system_prompt = persona_prompts.get(prompt_input.lower(), persona_prompts["default"])
    
    full_prompt = f"{system_prompt}\n\nUser: {message}\n\nAI:"

    try:
        response = await model.generate_content_async(full_prompt)
        return response.text
    except Exception as e:
        print(f"Error generating response from Gemini: {e}")
        return "I'm sorry, I'm having a little trouble thinking right now. Please try again in a moment."
    
    
async def get_gemini_response_stream(message: str, prompt_input: str, is_custom: bool):
    """
    Yields chunks of a response from the Gemini API for streaming.
    """
    system_prompt = ""
    if is_custom:
        system_prompt = prompt_input
    else:
        system_prompt = persona_prompts.get(prompt_input.lower(), persona_prompts["default"])
    
    full_prompt = f"{system_prompt}\n\nUser: {message}\n\nAI:"

    try:
        # The key is stream=True
        response_stream = await model.generate_content_async(full_prompt, stream=True)
        
        # Asynchronously iterate over the stream and yield each chunk
        async for chunk in response_stream:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        print(f"Error during streaming: {e}")
        yield "I'm sorry, I'm having a little trouble thinking right now."