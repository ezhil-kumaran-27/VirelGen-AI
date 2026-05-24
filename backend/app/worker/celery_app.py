from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "viralgen_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.task_routes = {
    "app.worker.tasks.*": {"queue": "main-queue"}
}
celery_app.conf.update(task_track_started=True)
