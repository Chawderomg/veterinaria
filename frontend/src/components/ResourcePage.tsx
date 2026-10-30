"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api, subirFoto } from "@/lib/api";

export type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "textarea" | "select" | "image";
  required?: boolean;
  step?: string;
  /** Para selects: carga opciones desde un endpoint */
  optionsFrom?: { path: string; label: string };
};

export type Column = { key: string; label: string; render?: (row: any) => React.ReactNode };

type Props = {
  title: string;
  subtitle: string;
  singular: string; // "cliente"
  path: string; // "/clientes"
  fields: Field[];
  columns: Column[];
  searchKeys: string[];
};

type Option = { value: string; label: string };

export default function ResourcePage({ title, subtitle, singular, path, fields, columns, searchKeys }: Props) {
  const [rows, setRows] = useState<any[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<any | "new" | null>(null);
  const [options, setOptions] = useState<Record<string, Option[]>>({});

  const load = useCallback(() => {
    api<any[]>(path).then(setRows).catch((e) => setError(e.message));
  }, [path]);

  useEffect(() => {
    load();
    fields.filter((f) => f.optionsFrom).forEach((f) => {
      api<any[]>(f.optionsFrom!.path).then((list) =>
        setOptions((o) => ({
          ...o,
          [f.name]: list.map((r) => ({ value: r.id, label: r[f.optionsFrom!.label] })),
        }))
      );
    });
  }, [load, fields]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q)));
  }, [rows, query, searchKeys]);

  async function eliminar(row: any) {
    if (!confirm(`¿Eliminar ${singular} "${row.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await api(`${path}/${row.id}`, { method: "DELETE" });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <button className="btn" onClick={() => setEditing("new")}>Agregar {singular}</button>
      </div>

      <div className="toolbar">
        <input type="search" placeholder={`Buscar ${singular}…`} value={query} onChange={(e) => setQuery(e.target.value)} aria-label={`Buscar ${singular}`} />
      </div>

      {error && <p className="error" role="alert" style={{ marginBottom: 16 }}>{error}</p>}

      <div className="table-wrap">
        {rows === null ? (
          <p className="empty-state">Cargando…</p>
        ) : filtered.length === 0 ? (
          <p className="empty-state">
            {rows.length === 0 ? `Aún no hay registros. Agrega tu primer ${singular}.` : "Nada coincide con tu búsqueda."}
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  {columns.map((c) => <td key={c.key}>{c.render ? c.render(r) : (r[c.key] ?? "—")}</td>)}
                  <td className="actions">
                    <button className="btn ghost small" onClick={() => setEditing(r)}>Editar</button>{" "}
                    <button className="btn danger small" onClick={() => eliminar(r)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <FormModal
          singular={singular}
          fields={fields}
          options={options}
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={async (payload) => {
            if (editing === "new") await api(path, { method: "POST", body: payload });
            else await api(`${path}/${editing.id}`, { method: "PUT", body: payload });
            setEditing(null);
            load();
          }}
        />
      )}
    </>
  );
}

function FormModal({ singular, fields, options, initial, onClose, onSave }: {
  singular: string;
  fields: Field[];
  options: Record<string, Option[]>;
  initial: any | null;
  onClose: () => void;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [values, setValues] = useState<Record<string, any>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, initial?.[f.name] ?? ""]))
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      for (const f of fields) {
        let v = values[f.name];
        if (f.type === "image" && file) v = await subirFoto(file);
        if (v === "" || v === undefined) v = null;
        if (f.type === "number" && v !== null) v = Number(v);
        payload[f.name] = v;
      }
      await onSave(payload);
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" role="dialog" aria-modal="true" aria-label={initial ? `Editar ${singular}` : `Nuevo ${singular}`} onSubmit={submit}>
        <h2>{initial ? `Editar ${singular}` : `Nuevo ${singular}`}</h2>

        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea id={f.name} required={f.required} value={values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
            ) : f.type === "select" ? (
              <select id={f.name} required={f.required} value={values[f.name] ?? ""} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}>
                <option value="">Sin asignar</option>
                {(options[f.name] ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.type === "image" ? (
              <>
                {(preview || values[f.name]) && <img className="preview" src={preview ?? values[f.name]} alt="Vista previa" />}
                <input id={f.name} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => {
                  const picked = e.target.files?.[0] ?? null;
                  setFile(picked);
                  setPreview(picked ? URL.createObjectURL(picked) : null);
                }} />
              </>
            ) : (
              <input id={f.name} type={f.type} required={f.required} step={f.step} min={f.type === "number" ? 0 : undefined} value={values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
            )}
          </div>
        ))}

        {error && <p className="error" role="alert">{error}</p>}
        <div className="row">
          <button type="button" className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</button>
        </div>
      </form>
    </div>
  );
}
