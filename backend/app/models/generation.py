from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Generation(Base):
    __tablename__ = "generations"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    optimized_text_prompt = Column(Text, nullable=True)
    optimized_image_prompt = Column(Text, nullable=True)
    
    generated_text = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    
    status = Column(String, default="Pending") # Pending, Processing, Completed, Failed
    task_id = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    campaign = relationship("Campaign", back_populates="generations")
    user = relationship("User", backref="generations")
