# Huellitas · Gestión de veterinaria

```
veterinaria/
├── backend/    FastAPI + Supabase (DB, Auth, Storage) con service key
└── frontend/   Next.js 14 (App Router) + Supabase Auth
```

Flujo: el navegador inicia sesión con Supabase Auth → envía el JWT al backend →
el backend lo valida y accede a la base y al Storage con la service key.

## 1. Supabase
1. Crea un proyecto en supabase.com.
2. SQL Editor → pega y ejecuta `backend/supabase/schema.sql` (crea tablas y el bucket público `mascotas`).
3. Settings → API: copia **Project URL**, **anon key** y **service_role key**.
4. (Opcional en desarrollo) Authentication → Providers → Email → desactiva "Confirm email" para entrar sin confirmar.

## 2. Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Documentación interactiva: http://localhost:8000/docs

## 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Abre http://localhost:3000, crea una cuenta y empieza a registrar datos.

## Endpoints (todos requieren `Authorization: Bearer <jwt>`)
| Recurso | Rutas |
|---|---|
| clientes, mascotas, productos, proveedores | `GET /x`, `POST /x`, `PUT /x/{id}`, `DELETE /x/{id}` |
| fotos | `POST /uploads/foto` (JPG/PNG/WEBP, máx. 5 MB) → `{ "url": ... }` |
| resumen | `GET /resumen` |

## Notas
- La `service_role key` solo va en `backend/.env`. Nunca en el frontend ni en git.
- Cualquier usuario autenticado puede gestionar los datos. Si necesitas roles
  (admin, recepción), el siguiente paso es agregarlos en `app_metadata` y validarlos en `auth.py`.
