from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .auth import get_current_user
from .config import settings
from .crud import crud_router
from .routers import uploads
from .schemas import ClienteIn, MascotaIn, ProductoIn, ProveedorIn
from .supabase_client import supabase

app = FastAPI(title="API Veterinaria")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crud_router("clientes", ClienteIn))
# Trae también el nombre del dueño: clientes(nombre)
app.include_router(crud_router("mascotas", MascotaIn, select="*, clientes(nombre)"))
app.include_router(crud_router("productos", ProductoIn))
app.include_router(crud_router("proveedores", ProveedorIn))
app.include_router(uploads.router)


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/resumen", dependencies=[Depends(get_current_user)])
def resumen():
    tablas = ["clientes", "mascotas", "productos", "proveedores"]
    out = {}
    for t in tablas:
        out[t] = supabase.table(t).select("id", count="exact").limit(1).execute().count or 0
    return out
