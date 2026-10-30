"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

// Definimos la estructura incluyendo un icono o emoji representativo para cada sección
const items = [
  { key: "clientes", label: "Clientes registrados", icon: "👥", color: "#3b82f6" },
  { key: "mascotas", label: "Mascotas", icon: "🐾", color: "#10b981" },
  { key: "productos", label: "Productos en catálogo", icon: "📦", color: "#f59e0b" },
  { key: "proveedores", label: "Proveedores", icon: "🚚", color: "#8b5cf6" },
];

export default function Inicio() {
  const [data, setData] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/resumen").then(setData).catch((e) => setError(e.message));
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Encabezado del Dashboard */}
      <div className="page-head" style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1e293b", marginBottom: "8px" }}>
            Panel Principal 🏥
          </h1>
          <p style={{ color: "#64748b", fontSize: "1.05rem" }}>
            Bienvenido al sistema de gestión de tu veterinaria. Aquí tienes el resumen actual:
          </p>
        </div>
      </div>

      {/* Mensaje de error si falla la API */}
      {error && (
        <div style={{ padding: "16px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "24px" }}>
          Error al cargar el resumen: {error}
        </div>
      )}

      {/* Cuadrícula de Estadísticas Mejorada */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px"
        }}
      >
        {items.map((i) => (
          <Link
            key={i.key}
            href={`/${i.key}`}
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "24px",
              textDecoration: "none",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
              transition: "all 0.2s ease-in-out",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            className="stat-card"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "2rem", padding: "10px", backgroundColor: "#f1f5f9", borderRadius: "12px" }}>
                {i.icon}
              </span>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: i.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Ver más &rarr;
              </span>
            </div>

            <div>
              <b style={{ fontSize: "2.25rem", color: "#0f172a", display: "block", fontWeight: "700", marginBottom: "4px" }}>
                {data ? data[i.key] : "–"}
              </b>
              <span style={{ color: "#64748b", fontSize: "0.95rem", fontWeight: "500" }}>
                {i.label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Estilo CSS en línea para el efecto Hover de las tarjetas */}
      <style jsx>{`
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border-color: #cbd5e1;
        }
      `}</style>
    </div>
  );
}