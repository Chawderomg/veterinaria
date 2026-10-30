from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .supabase_client import supabase

bearer = HTTPBearer(auto_error=False)


def get_current_user(creds: HTTPAuthorizationCredentials | None = Depends(bearer)):
    """Valida el JWT que Supabase Auth entregó al frontend."""
    if creds is None:
        raise HTTPException(status_code=401, detail="Falta el token de acceso")
    try:
        res = supabase.auth.get_user(creds.credentials)
        user = res.user if res else None
    except Exception:
        user = None
    if user is None:
        raise HTTPException(status_code=401, detail="Sesión inválida o expirada")
    return user
