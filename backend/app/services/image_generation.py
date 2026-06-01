import requests
import os
import io
from PIL import Image
from app.core.config import settings
from app.services.cloudinary_service import upload_image_buffer_to_cloudinary

def generate_marketing_image(image_prompt: str) -> str:
    """
    Generates a marketing image using DALL-E 3 (via OpenAI API) and uploads to Cloudinary.
    Returns the Cloudinary URL.
    """
    if not settings.OPENAI_API_KEY:
        print("OPENAI_API_KEY is not set, returning placeholder image.")
        return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1024&auto=format&fit=crop"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {settings.OPENAI_API_KEY}"
    }
    
    payload = {
        "model": "dall-e-2",
        "prompt": image_prompt,
        "n": 1,
        "size": "512x512",
        "response_format": "url"
    }
    
    try:
        response = requests.post("https://api.openai.com/v1/images/generations", headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        
        # Get the URL directly from OpenAI
        image_url = result['data'][0]['url']
        
        # Cloudinary can upload directly from a remote URL, bypassing local download
        from app.services.cloudinary_service import upload_image_to_cloudinary
        cloudinary_url = upload_image_to_cloudinary(image_url)
        
        return cloudinary_url
        
    except Exception as e:
        print(f"Error generating image: {e}")
        return ""
