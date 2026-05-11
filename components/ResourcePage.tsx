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
  persistedFields?: {
    storageKey: string;
    fields: string[];
  };
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
  persistedFields,
}: ResourcePageProps) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [dependencies, setDependencies] = useState<Record<string, Record<string, unknown>[]>>({});

  function valuesWithPersistedFields() {
    if (!persistedFields || typeof window === "undefined") return initialValues;

    try {
      const saved = JSON.parse(window.localStorage.getItem(persistedFields.storageKey) ?? "{}") as Record<string, unknown>;
      return persistedFields.fields.reduce(
        (nextValues, fieldName) => ({
          ...nextValues,
          [fieldName]: saved[fieldName] === undefined || saved[fieldName] === null ? "" : String(saved[fieldName]),
        }),
        { ...initialValues },
      );
    } catch {
      return initialValues;
    }
  }

  function savePersistedFields(nextValues: Record<string, string>) {
    if (!persistedFields || typeof window === "undefined") return;

    const saved = persistedFields.fields.reduce<Record<string, string>>((fieldsToSave, fieldName) => {
      fieldsToSave[fieldName] = nextValues[fieldName] ?? "";
      return fieldsToSave;
    }, {});

    window.localStorage.setItem(persistedFields.storageKey, JSON.stringify(saved));
  }

  const resolvedFields = useMemo(() => {
    return fields.map((field) => {
      if (!field.dependency) return field;

      let rows = dependencies[field.dependency.source] ?? [];
      if (field.dependency.filterBy) {
        const { field: filterField, key } = field.dependency.filterBy;
        rows = rows.filter((row) => String(row[key] ?? "") === String(values[filterField] ?? ""));
      }

      return {
        ...field,
        options: rows.map((row) => ({
          value: String(row[field.dependency!.valueKey] ?? ""),
          label: String(row[field.dependency!.labelKey] ?? ""),
        })),
      };
    });
  }, [dependencies, fields, values]);

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

  useEffect(() => {
    setValues(valuesWithPersistedFields());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistedFields?.storageKey]);

  function resetForm() {
    setValues(valuesWithPersistedFields());
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

  function handleChange(name: string, value: string) {
    setValues((current) => {
      const next = { ...current, [name]: value };
      const cleared = new Set([name]);
      let changed = true;

      while (changed) {
        changed = false;
        fields.forEach((field) => {
          const parentField = field.dependency?.filterBy?.field;
          if (parentField && cleared.has(parentField) && next[field.name] !== "") {
            next[field.name] = "";
            cleared.add(field.name);
            changed = true;
          }
        });
      }

      if (!editingId) savePersistedFields(next);

      return next;
    });
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
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />

      <DataTable columns={columns} rows={rows} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
    </section>
  );
}
