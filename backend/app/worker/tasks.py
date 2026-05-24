import asyncio
from app.worker.celery_app import celery_app
from app.services.image_generation import generate_marketing_image
from app.core.database import SessionLocal
from app.models.generation import Generation # Assuming this will be created

@celery_app.task(bind=True, name="app.worker.tasks.process_campaign_generation")
def process_campaign_generation(self, generation_id: int, image_prompt: str):
    """
    Background task to generate an image via DALL-E, upload to Cloudinary,
    and update the Generation status in the database.
    """
    db = SessionLocal()
    try:
        # Mark as processing
        generation = db.query(Generation).filter(Generation.id == generation_id).first()
        if generation:
            generation.status = "Processing"
            db.commit()
            
        # Generate image and upload to Cloudinary
        image_url = generate_marketing_image(image_prompt)
        
        if image_url and generation:
            generation.image_url = image_url
            generation.status = "Completed"
            db.commit()
            return {"status": "success", "image_url": image_url}
        else:
            if generation:
                generation.status = "Failed"
                db.commit()
            return {"status": "failed", "error": "Image generation or upload failed."}
            
    except Exception as e:
        db.rollback()
        generation = db.query(Generation).filter(Generation.id == generation_id).first()
        if generation:
            generation.status = "Failed"
            db.commit()
        return {"status": "failed", "error": str(e)}
    finally:
        db.close()
