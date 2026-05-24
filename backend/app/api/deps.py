from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user(db: Session = Depends(get_db)) -> User:
    # Bypassed authentication: auto-provision a default user
    demo_email = "demo@viralgen.ai"
    user = db.query(User).filter(User.email == demo_email).first()
    
    if not user:
        from app.core.security import get_password_hash
        user = User(
            email=demo_email,
            password_hash=get_password_hash("auto-provisioned"),
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    return user
