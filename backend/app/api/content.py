from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.campaign import Campaign
from app.models.generation import Generation
from app.api.deps import get_current_user
from app.services.prompt_refinement import refine_prompts
from app.services.text_generation import generate_marketing_copy
from app.worker.tasks import process_campaign_generation
from pydantic import BaseModel

router = APIRouter()

class CampaignRequest(BaseModel):
    title: str
    product_name: str
    target_audience: str
    platform: str
    tone: str
    keywords: str = ""
    cta: str = ""
    product_description: str

class GenerationResponse(BaseModel):
    generation_id: int
    task_id: str
    status: str
    message: str

@router.post("/generate", response_model=GenerationResponse)
def generate_campaign(request: CampaignRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    
    # 1. Save Campaign
    campaign = Campaign(
        user_id=current_user.id,
        title=request.title,
        platform=request.platform,
        persona=request.tone
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    
    # 2. Refine Prompts
    brief = f"Product: {request.product_name}. Description: {request.product_description}. Audience: {request.target_audience}. Keywords: {request.keywords}. CTA: {request.cta}."
    refined = refine_prompts(brief, request.platform, request.tone)
    text_prompt = refined.get("text_prompt", brief)
    image_prompt = refined.get("image_prompt", brief)
    
    # 3. Generate Text (Synchronous)
    generated_text = generate_marketing_copy(text_prompt)
    
    # 4. Save Generation Record
    generation = Generation(
        campaign_id=campaign.id,
        user_id=current_user.id,
        optimized_text_prompt=text_prompt,
        optimized_image_prompt=image_prompt,
        generated_text=generated_text,
        status="Pending"
    )
    db.add(generation)
    db.commit()
    db.refresh(generation)
    
    # 5. Trigger Async Celery Task for Image
    task = process_campaign_generation.delay(generation.id, image_prompt)
    
    generation.task_id = task.id
    db.commit()
    
    return {
        "generation_id": generation.id,
        "task_id": task.id,
        "status": "Pending",
        "message": "Campaign text generated successfully. Image generation in progress."
    }

@router.get("/status/{generation_id}")
def get_generation_status(generation_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    generation = db.query(Generation).filter(Generation.id == generation_id, Generation.user_id == current_user.id).first()
    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")
        
    return {
        "id": generation.id,
        "status": generation.status,
        "generated_text": generation.generated_text,
        "image_url": generation.image_url
    }
