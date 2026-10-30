from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from .auth import get_current_user
from .supabase_client import supabase


def crud_router(table: str, model: type[BaseModel], select: str = "*") -> APIRouter:
    """Genera listar / crear / actualizar / eliminar para una tabla de Supabase."""
    router = APIRouter(
        prefix=f"/{table}", tags=[table], dependencies=[Depends(get_current_user)]
    )

    @router.get("")
    def listar():
        return (
            supabase.table(table)
            .select(select)
            .order("created_at", desc=True)
            .execute()
            .data
        )

    @router.post("", status_code=201)
    def crear(item: model):  # type: ignore[valid-type]
        data = item.model_dump(mode="json")
        return supabase.table(table).insert(data).execute().data[0]

    @router.put("/{item_id}")
    def actualizar(item_id: str, item: model):  # type: ignore[valid-type]
        data = item.model_dump(mode="json")
        rows = supabase.table(table).update(data).eq("id", item_id).execute().data
        if not rows:
            raise HTTPException(status_code=404, detail="Registro no encontrado")
        return rows[0]

    @router.delete("/{item_id}", status_code=204)
    def eliminar(item_id: str):
        rows = supabase.table(table).delete().eq("id", item_id).execute().data
        if not rows:
            raise HTTPException(status_code=404, detail="Registro no encontrado")

    return router
