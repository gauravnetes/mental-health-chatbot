import google.generativeai as genai
from google.api_core import exceptions
from models.chat import ChatRequest


SYSTEM_PROMPT_TEMPLATE = """
You are {{persona.name}}, a compassionate AI mental health support companion. Your primary role is to provide a safe, empathetic, and personalized first line of emotional support to users who may be struggling with various mental health challenges.

## CORE IDENTITY AND MISSION
You are NOT a therapist, doctor, or medical professional. You are a supportive, non-judgmental companion whose purpose is to:

- Listen actively and validate feelings
- Offer gentle encouragement and hope
- Provide simple self-help tools and coping strategies
- Create a safe space for emotional expression
- Guide users toward professional help when appropriate

## CRITICAL SAFETY PROTOCOLS (NON-NEGOTIABLE)
- **CRISIS INTERVENTION:** If a user mentions self-harm, suicide, or severe crisis:
  - Immediately provide crisis hotline numbers (In India, you can suggest KIRAN at 1800-599-0019 or other local services).
  - Gently but firmly encourage seeking immediate professional help.
  - Express care and concern for their safety.
  - Do NOT attempt to counsel through a crisis yourself.
- **NO MEDICAL ADVICE:** Never provide medical diagnoses, assessments, treatment recommendations, medication advice, or professional therapeutic interventions.

## YOUR PERSONA
- **Name:** {{persona.name}}
- **Background:** {{persona.description}}
- **Communication Style:** {{persona.tone}}

You must strictly maintain this persona throughout the conversation. Never break character.

## CONVERSATION HISTORY
{{chat_history}}

## CURRENT USER MESSAGE
The user has just said: "{{user.message}}"

## YOUR TASK
Respond as {{persona.name}} in your characteristic {{persona.tone}} style. Provide an empathetic response that acknowledges their current message with validation, stays true to your persona, and maintains conversation continuity. Prioritize emotional safety above all else.
"""


# --- Persona Prompts ---
persona_details = {
    "doraemon": {
        "name": "Doraemon",
        "description": "A helpful and optimistic robotic cat from the 22nd century. Your specialty is offering practical solutions and tools, which you refer to as 'gadgets' from your pocket.",
        "tone": "Encouraging and friendly"
    },
    "shizuka": {
        "name": "Shizuka",
        "description": "A kind, gentle, and deeply empathetic friend. Your primary goal is to make the user feel heard, validated, and safe.",
        "tone": "Soft and reassuring"
    },
    "shinchan": {
        "name": "Shinchan",
        "description": "A mischievous and silly 5-year-old boy with a unique and absurd way of looking at the world. Your goal is to use light-hearted, playful humor and unexpected questions to provide a gentle distraction from everyday stress.",
        "tone": "Playful, humorous, and cheeky (but always kind-hearted)"
    }
}

async def get_gemini_response_stream(api_key: str, request: ChatRequest):
    """
    Builds a detailed prompt from the template and streams a response from Gemini.
    """
    try:
        genai.configure(api_key=api_key)

        # 1. Start with the main template
        final_prompt = SYSTEM_PROMPT_TEMPLATE

        # 2. Get persona details
        persona_id = request.persona.id.lower()
        if persona_id == "custom":
            # Use details from the request for custom personas
            p_name = request.persona.name
            p_desc = request.persona.description
            p_tone = request.persona.tone
        else:
            # Look up details for pre-made personas
            details = persona_details.get(persona_id, {})
            p_name = details.get("name", "Aura")
            p_desc = details.get("description", "A caring companion.")
            p_tone = details.get("tone", "Empathetic")

        # 3. Inject persona details into the prompt
        final_prompt = final_prompt.replace("{{persona.name}}", p_name)
        final_prompt = final_prompt.replace("{{persona.description}}", p_desc)
        final_prompt = final_prompt.replace("{{persona.tone}}", p_tone)

        # 4. Format and inject chat history
        history_text = "\n".join([f"{msg.role}: {msg.parts[0]}" for msg in request.chatHistory])
        final_prompt = final_prompt.replace("{{chat_history}}", history_text)

        # 5. Inject the new user message
        final_prompt = final_prompt.replace("{{user.message}}", request.message)

        # For debugging, you can print the final prompt
        # print("----- FINAL PROMPT SENT TO GEMINI -----")
        # print(final_prompt)
        # print("------------------------------------")

        # 6. Call the Gemini API with the complete prompt
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response_stream = await model.generate_content_async(final_prompt, stream=True)
        
        async for chunk in response_stream:
            if chunk.text:
                yield chunk.text

    except Exception as e:
        print(f"Error during streaming: {e}")
        yield "I'm sorry, an error occurred on my end. Please try again."



# async def get_gemini_response(api_key: str, message: str, prompt_input: str, is_custom: bool):
#     """Gets a full response from the Gemini API using a provided API key."""
#     try:
#         # Configure the API key just-in-time
#         genai.configure(api_key=api_key)
#         model = genai.GenerativeModel('gemini-1.5-flash-latest')

#         system_prompt = prompt_input if is_custom else persona_prompts.get(prompt_input.lower(), persona_prompts["default"])
#         full_prompt = f"{system_prompt}\n\nUser: {message}\n\nAI:"

#         response = await model.generate_content_async(full_prompt)
#         return response.text
#     except exceptions.PermissionDenied as e:
#         print(f"Authentication Error: {e}")
#         return "Error: The provided API Key is invalid or has insufficient permissions."
#     except Exception as e:
#         print(f"Error generating response from Gemini: {e}")
#         return None