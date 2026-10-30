from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from ..auth import get_current_user
from ..config import settings
from ..supabase_client import supabase

router = APIRouter(prefix="/uploads", tags=["uploads"], dependencies=[Depends(get_current_user)])

MAX_BYTES = 5 * 1024 * 1024
ALLOWED = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}


@router.post("/foto")
async def subir_foto(file: UploadFile = File(...)):
    ext = ALLOWED.get(file.content_type or "")
    if ext is None:
        raise HTTPException(400, "Formato no permitido. Usa JPG, PNG o WEBP.")
    content = await file.read()
    if len(content) > MAX_BYTES:
        raise HTTPException(400, "La imagen supera los 5 MB.")

    path = f"{uuid4()}.{ext}"
    bucket = supabase.storage.from_(settings.storage_bucket)
    bucket.upload(path, content, {"content-type": file.content_type})
    return {"url": bucket.get_public_url(path)}
