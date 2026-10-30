-- Ejecuta este script en Supabase > SQL Editor

create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text,
  direccion text,
  correo text,
  created_at timestamptz not null default now()
);

create table if not exists mascotas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tipo text not null,
  descripcion text,
  peso numeric(6,2),
  foto_url text,
  cliente_id uuid references clientes(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  marca text,
  precio numeric(10,2) not null default 0,
  stock integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists proveedores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  correo text,
  telefono text,
  created_at timestamptz not null default now()
);

-- RLS activado: el backend usa la service_role key (que ignora RLS),
-- así el navegador nunca accede directo a las tablas.
alter table clientes    enable row level security;
alter table mascotas    enable row level security;
alter table productos   enable row level security;
alter table proveedores enable row level security;

-- Bucket público para las fotos de mascotas (la subida la hace el backend)
insert into storage.buckets (id, name, public)
values ('mascotas', 'mascotas', true)
on conflict (id) do nothing;
