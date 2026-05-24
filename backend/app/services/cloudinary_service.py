import cloudinary
import cloudinary.uploader
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

def upload_image_to_cloudinary(file_path: str, folder: str = "viralgen") -> str:
    """
    Uploads an image to Cloudinary and returns the secure URL.
    """
    try:
        response = cloudinary.uploader.upload(file_path, folder=folder)
        return response.get("secure_url")
    except Exception as e:
        print(f"Error uploading to Cloudinary: {e}")
        return ""

def upload_image_buffer_to_cloudinary(buffer, folder: str = "viralgen") -> str:
    """
    Uploads an image buffer directly to Cloudinary.
    """
    try:
        response = cloudinary.uploader.upload(buffer, folder=folder)
        return response.get("secure_url")
    except Exception as e:
        print(f"Error uploading to Cloudinary: {e}")
        return ""
