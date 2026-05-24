from groq import Groq
from app.core.config import settings
import json

def get_groq_client():
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set")
    return Groq(api_key=settings.GROQ_API_KEY)

def refine_prompts(campaign_brief: str, platform: str, persona: str):
    """
    Refines a simple campaign brief into optimized prompts for text and image generation.
    Returns a dictionary with 'text_prompt' and 'image_prompt'.
    """
    client = get_groq_client()
    
    system_prompt = f"""
    You are an expert AI Prompt Engineer and Marketing Strategist. 
    Your goal is to take a user's marketing brief and generate two highly optimized prompts:
    1. A text generation prompt for writing a social media caption tailored for {platform} with a {persona} tone.
    2. An image generation prompt (for DALL-E 3/Stability AI) to create a high-quality, cinematic marketing visual for this campaign.
    
    Return the result strictly as a JSON object with two keys:
    - "text_prompt": The optimized prompt for text generation.
    - "image_prompt": The optimized prompt for image generation.
    
    Do NOT include any markdown formatting like ```json in the output. Just return the raw JSON object.
    """
    
    user_prompt = f"Marketing Brief:\n{campaign_brief}"
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1024,
            response_format={"type": "json_object"}
        )
        
        result_json = chat_completion.choices[0].message.content
        return json.loads(result_json)
    except Exception as e:
        print(f"Error in prompt refinement: {e}")
        # Fallback in case of error
        return {
            "text_prompt": f"Write a {platform} post for: {campaign_brief} in a {persona} tone.",
            "image_prompt": f"A high quality marketing image for: {campaign_brief}"
        }
