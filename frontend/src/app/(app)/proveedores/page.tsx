"use client";
import ResourcePage, { Column, Field } from "@/components/ResourcePage";

const fields: Field[] = [
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "correo", label: "Correo", type: "email" },
  { name: "telefono", label: "Teléfono", type: "tel" },
];
const columns: Column[] = [
  { key: "nombre", label: "Nombre" },
  { key: "correo", label: "Correo" },
  { key: "telefono", label: "Teléfono" },
];

export default function Page() {
  return <ResourcePage title="Proveedores" subtitle="Quién te abastece." singular="proveedor" path="/proveedores" fields={fields} columns={columns} searchKeys={["nombre", "correo"]} />;
}
