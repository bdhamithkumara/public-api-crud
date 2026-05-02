"use client";

type FieldType = "text" | "number" | "select";

export type SelectOption = {
  value: number | string;
  label: string;
};

export type FormField = {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  dependency?: {
    source: string;
    valueKey: string;
    labelKey: string;
    filterBy?: {
      field: string;
      key: string;
    };
  };
};

type AdminFormProps = {
  fields: FormField[];
  values: Record<string, unknown>;
  editing: boolean;
  loading?: boolean;
  onChange: (name: string, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function AdminForm({ fields, values, editing, loading, onChange, onSubmit, onCancel }: AdminFormProps) {
  return (
    <form
      className="rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-soft backdrop-blur"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-clay">{editing ? "Edit record" : "Create record"}</p>
          <h2 className="mt-1 text-2xl font-black text-ink">{editing ? "Update selected item" : "Add a new item"}</h2>
        </div>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-ink/15 px-4 py-2 text-sm font-bold text-ink hover:bg-sand"
          >
            Cancel edit
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => (
          <label key={field.name} className="grid gap-2 text-sm font-bold text-ink/75">
            {field.label}
            {field.type === "select" ? (
              <select
                value={String(values[field.name] ?? "")}
                onChange={(event) => onChange(field.name, event.target.value)}
                required={field.required}
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-ink outline-none ring-lagoon/20 transition focus:ring-4"
              >
                <option value="">Select {field.label}</option>
                {(field.options ?? []).map((option) => (
                  <option key={String(option.value)} value={String(option.value)}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type ?? "text"}
                value={String(values[field.name] ?? "")}
                onChange={(event) => onChange(field.name, event.target.value)}
                required={field.required}
                placeholder={field.placeholder}
                step={field.type === "number" ? "any" : undefined}
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-ink outline-none ring-lagoon/20 transition placeholder:text-ink/35 focus:ring-4"
              />
            )}
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-sand shadow-soft transition hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving..." : editing ? "Update" : "Create"}
      </button>
    </form>
  );
}
