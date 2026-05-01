"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminForm, FormField } from "@/components/AdminForm";
import { DataTable, TableColumn } from "@/components/DataTable";

type ResourcePageProps = {
  title: string;
  description: string;
  endpoint: string;
  fields: FormField[];
  columns: TableColumn[];
  initialValues: Record<string, string>;
  dependencyEndpoints?: Record<string, string>;
  mapDependencies?: (fields: FormField[], dependencies: Record<string, Record<string, unknown>[]>) => FormField[];
};

function readError(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "error" in payload) {
    return String((payload as { error: unknown }).error);
  }

  return fallback;
}

export function ResourcePage({
  title,
  description,
  endpoint,
  fields,
  columns,
  initialValues,
  dependencyEndpoints = {},
  mapDependencies,
}: ResourcePageProps) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [dependencies, setDependencies] = useState<Record<string, Record<string, unknown>[]>>({});

  const resolvedFields = useMemo(() => {
    return mapDependencies ? mapDependencies(fields, dependencies) : fields;
  }, [dependencies, fields, mapDependencies]);

  async function loadRows() {
    setLoading(true);
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(readError(payload, "Failed to load records"));
      setRows(payload);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load records");
    } finally {
      setLoading(false);
    }
  }

  async function loadDependencies() {
    const entries = Object.entries(dependencyEndpoints);
    if (entries.length === 0) return;

    try {
      const loaded = await Promise.all(
        entries.map(async ([key, url]) => {
          const response = await fetch(url, { cache: "no-store" });
          const payload = await response.json();
          if (!response.ok) throw new Error(readError(payload, `Failed to load ${key}`));
          return [key, payload] as const;
        }),
      );

      setDependencies(Object.fromEntries(loaded));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load dropdown data");
    }
  }

  useEffect(() => {
    loadRows();
    loadDependencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  function resetForm() {
    setValues(initialValues);
    setEditingId(null);
  }

  function handleEdit(row: Record<string, unknown>) {
    const nextValues = { ...initialValues };
    Object.keys(initialValues).forEach((key) => {
      nextValues[key] = row[key] === null || row[key] === undefined ? "" : String(row[key]);
    });

    setValues(nextValues);
    setEditingId(Number(row.id));
    setMessage("");
  }

  async function handleSubmit() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(editingId ? `${endpoint}/${editingId}` : endpoint, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json();

      if (!response.ok) throw new Error(readError(payload, "Save failed"));

      setMessage(editingId ? "Record updated." : "Record created.");
      resetForm();
      await loadRows();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row: Record<string, unknown>) {
    const confirmed = window.confirm(`Delete record #${row.id}?`);
    if (!confirmed) return;

    setMessage("");
    try {
      const response = await fetch(`${endpoint}/${row.id}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) throw new Error(readError(payload, "Delete failed"));
      setMessage("Record deleted.");
      await loadRows();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed");
    }
  }

  return (
    <section className="grid gap-6">
      <div className="rounded-[2rem] bg-ink p-7 text-sand shadow-soft">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-clay">CRUD Manager</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">{title}</h1>
        <p className="mt-3 max-w-3xl text-sand/80">{description}</p>
      </div>

      {message && (
        <div className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm font-bold text-ink shadow-soft">
          {message}
        </div>
      )}

      <AdminForm
        fields={resolvedFields}
        values={values}
        editing={editingId !== null}
        loading={saving}
        onChange={(name, value) => setValues((current) => ({ ...current, [name]: value }))}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />

      <DataTable columns={columns} rows={rows} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
    </section>
  );
}
