"use client";
import ResourcePage, { Column, Field } from "@/components/ResourcePage";

const fields: Field[] = [
  { name: "foto_url", label: "Foto", type: "image" },
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "tipo", label: "Tipo (perro, gato, ave…)", type: "text", required: true },
  { name: "cliente_id", label: "Dueño", type: "select", optionsFrom: { path: "/clientes", label: "nombre" } },
  { name: "peso", label: "Peso (kg)", type: "number", step: "0.01" },
  { name: "descripcion", label: "Descripción", type: "textarea" },
];

const columns: Column[] = [
  {
    key: "foto_url",
    label: "Foto",
    render: (r) =>
      r.foto_url ? (
        <img
          src={r.foto_url}
          alt={r.nombre}
          style={{
            width: "80px",       // Ancho más grande para la foto
            height: "80px",      // Alto fijo para mantener proporción cuadrada
            objectFit: "cover",  // Evita que la imagen se deforme
            borderRadius: "12px",// Bordes redondeados modernos
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        />
      ) : (
        <span
          style={{
            display: "inline-flex",
            width: "80px",
            height: "80px",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e2e8f0",
            borderRadius: "12px",
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#475569"
          }}
        >
          {r.nombre?.[0]?.toUpperCase()}
        </span>
      ),
  },
  {
    key: "nombre",
    label: "Nombre",
    render: (r) => <span style={{ fontWeight: "600", fontSize: "1.05rem" }}>{r.nombre}</span>
  },
  { key: "tipo", label: "Tipo" },
  { key: "dueno", label: "Dueño", render: (r) => r.clientes?.nombre ?? "—" },
  { key: "peso", label: "Peso", render: (r) => (r.peso != null ? `${r.peso} kg` : "—") },
  {
    key: "descripcion",
    label: "Descripción",
    render: (r) => (
      <span style={{ display: "inline-block", maxWidth: "250px", whiteSpace: "normal", color: "#475569" }}>
        {r.descripcion || "—"}
      </span>
    )
  },
];

export default function Page() {
  return (
    <ResourcePage
      title="Mascotas"
      subtitle="Tus pacientes y sus dueños."
      singular="mascota"
      path="/mascotas"
      fields={fields}
      columns={columns}
      searchKeys={["nombre", "tipo", "descripcion"]}
    />
  );
}