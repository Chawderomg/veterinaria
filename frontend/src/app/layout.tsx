import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = Figtree({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Huellitas · Gestión veterinaria",
  description: "Clientes, mascotas, productos y proveedores de tu veterinaria",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body style={{ position: "relative", minHeight: "100vh", backgroundColor: "#f8fafc" }}>

        {/* FONDO PATRÓN SUTIL DE HUELLITAS */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.05, // Opacidad baja para que no distraiga al leer los datos
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 24 24' fill='%20000'%3E%3Cpath d='M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.1.9-2 2-2zm-5 3a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.1.9-2 2-2zm10 0a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.1.9-2 2-2zm-9.3 5.4c.5-.7 1.4-.9 2.1-.4.6.4 1.8.8 2.2.8.4 0 1.6-.4 2.2-.8.7-.5 1.6-.3 2.1.4.6.8.5 2-.2 2.7l-2.4 2.4c-.9.9-2.3.9-3.2 0l-2.4-2.4c-.7-.7-.8-1.9-.2-2.7z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "80px 80px",
          }}
        />

        {/* CONTENIDO PRINCIPAL */}
        <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
          {children}
        </div>

      </body>
    </html>
  );
}