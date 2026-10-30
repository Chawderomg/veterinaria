"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAviso("");
    setCargando(true);
    if (modo === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Correo o contraseña incorrectos.");
      else router.replace("/inicio");
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setError(`${error.message} (${error.code ?? error.status})`);
      else if (data.session) router.replace("/inicio");
      else setAviso("Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.");
    }
    setCargando(false);
  }

  return (
    <main className="login">
      <section className="login-side">
        <h1>Huellitas</h1>
        <p>Clientes, mascotas, productos y proveedores de tu veterinaria en un solo lugar.</p>
      </section>
      <section className="login-form">
        <form onSubmit={enviar}>
          <h2>{modo === "login" ? "Iniciar sesión" : "Crear cuenta"}</h2>
          <div>
            <label htmlFor="email">Correo</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={modo === "login" ? "current-password" : "new-password"} />
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          {aviso && <p className="ok" role="status">{aviso}</p>}
          <button className="btn" disabled={cargando}>
            {cargando ? "Un momento…" : modo === "login" ? "Entrar" : "Crear cuenta"}
          </button>
          <button type="button" className="link" onClick={() => { setModo(modo === "login" ? "registro" : "login"); setError(""); setAviso(""); }}>
            {modo === "login" ? "¿Primera vez? Crea una cuenta" : "Ya tengo cuenta"}
          </button>
        </form>
      </section>
    </main>
  );
}
