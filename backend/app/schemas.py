from pydantic import BaseModel, EmailStr, Field


class ClienteIn(BaseModel):
    nombre: str = Field(min_length=1)
    telefono: str | None = None
    direccion: str | None = None
    correo: EmailStr | None = None


class MascotaIn(BaseModel):
    nombre: str = Field(min_length=1)
    tipo: str = Field(min_length=1)  # perro, gato, ave...
    descripcion: str | None = None
    peso: float | None = Field(default=None, ge=0)  # kg
    foto_url: str | None = None
    cliente_id: str | None = None  # dueño


class ProductoIn(BaseModel):
    nombre: str = Field(min_length=1)
    marca: str | None = None
    precio: float = Field(ge=0)
    stock: int = Field(default=0, ge=0)


class ProveedorIn(BaseModel):
    nombre: str = Field(min_length=1)
    correo: EmailStr | None = None
    telefono: str | None = None
