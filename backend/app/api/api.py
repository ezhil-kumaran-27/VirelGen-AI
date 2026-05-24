from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.content import router as content_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(content_router, prefix="/content", tags=["content"])
