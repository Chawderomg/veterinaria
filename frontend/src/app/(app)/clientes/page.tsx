"use client";
import ResourcePage, { Column, Field } from "@/components/ResourcePage";

const fields: Field[] = [
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "telefono", label: "Teléfono", type: "tel" },
  { name: "direccion", label: "Dirección", type: "text" },
  { name: "correo", label: "Correo", type: "email" },
];
const columns: Column[] = [
  { key: "nombre", label: "Nombre" },
  { key: "telefono", label: "Teléfono" },
  { key: "direccion", label: "Dirección" },
  { key: "correo", label: "Correo" },
];

export default function Page() {
  return <ResourcePage title="Clientes" subtitle="Los dueños de tus pacientes." singular="cliente" path="/clientes" fields={fields} columns={columns} searchKeys={["nombre", "telefono", "correo"]} />;
}
