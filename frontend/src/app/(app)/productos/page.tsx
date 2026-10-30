"use client";
import ResourcePage, { Column, Field } from "@/components/ResourcePage";

const fields: Field[] = [
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "marca", label: "Marca", type: "text" },
  { name: "precio", label: "Precio", type: "number", step: "0.01", required: true },
  { name: "stock", label: "Stock (unidades)", type: "number", step: "1", required: true },
];
const columns: Column[] = [
  { key: "nombre", label: "Nombre" },
  { key: "marca", label: "Marca" },
  { key: "precio", label: "Precio", render: (r) => Number(r.precio).toFixed(2) },
  { key: "stock", label: "Stock", render: (r) => <span className={r.stock <= 5 ? "low" : ""}>{r.stock}{r.stock <= 5 ? " · bajo" : ""}</span> },
];

export default function Page() {
  return <ResourcePage title="Productos" subtitle="Catálogo e inventario. El stock bajo (5 o menos) se marca en ámbar." singular="producto" path="/productos" fields={fields} columns={columns} searchKeys={["nombre", "marca"]} />;
}
