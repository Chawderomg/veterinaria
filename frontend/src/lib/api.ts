import { supabase } from "./supabase";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    await supabase.auth.signOut();
    throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail;
    const msg = Array.isArray(detail)
      ? detail.map((d: { loc: string[]; msg: string }) => `${d.loc.at(-1)}: ${d.msg}`).join(". ")
      : detail;
    throw new Error(msg || "No se pudo completar la operación.");
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export async function api<T = any>(
  path: string,
  opts: { method?: string; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: opts.method ?? "GET",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  return parse<T>(res);
}

export async function subirFoto(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API}/uploads/foto`, {
    method: "POST",
    headers: await authHeader(),
    body: form,
  });
  const { url } = await parse<{ url: string }>(res);
  return url;
}
