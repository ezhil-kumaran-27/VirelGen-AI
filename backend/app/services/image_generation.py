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
        "model": "dall-e-3",
        "prompt": image_prompt,
        "n": 1,
        "size": "1024x1024",
        "response_format": "b64_json"
    }
    
    try:
        response = requests.post("https://api.openai.com/v1/images/generations", headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        
        # In a real scenario, you could decode the b64 json to a buffer and upload to Cloudinary.
        # Alternatively, request an 'url' response format and download it.
        # Here we simulate fetching the URL from DALL-E response format if "url" was used.
        # But since we used b64_json:
        import base64
        image_data = base64.b64decode(result['data'][0]['b64_json'])
        image_buffer = io.BytesIO(image_data)
        
        # Add basic watermark/composition if needed (PIL)
        # img = Image.open(image_buffer)
        # ... process img ...
        # temp_buffer = io.BytesIO()
        # img.save(temp_buffer, format="PNG")
        # temp_buffer.seek(0)
        
        # Upload to Cloudinary
        cloudinary_url = upload_image_buffer_to_cloudinary(image_buffer.getvalue())
        return cloudinary_url
        
    except Exception as e:
        print(f"Error generating image: {e}")
        return ""
