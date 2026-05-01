export type TableColumn = {
  key: string;
  label: string;
};

type DataTableProps = {
  columns: TableColumn[];
  rows: Record<string, unknown>[];
  loading?: boolean;
  onEdit: (row: Record<string, unknown>) => void;
  onDelete: (row: Record<string, unknown>) => void;
};

export function DataTable({ columns, rows, loading, onEdit, onDelete }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-soft backdrop-blur">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-ink/10 text-left text-sm">
          <thead className="bg-ink text-sand">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="whitespace-nowrap px-4 py-4 font-black">
                  {column.label}
                </th>
              ))}
              <th className="whitespace-nowrap px-4 py-4 font-black">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-ink/70" colSpan={columns.length + 1}>
                  Loading records...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-ink/70" colSpan={columns.length + 1}>
                  No records yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={String(row.id)} className="align-top transition hover:bg-sand/50">
                  {columns.map((column) => (
                    <td key={column.key} className="whitespace-nowrap px-4 py-4 text-ink/80">
                      {String(row[column.key] ?? "-")}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="rounded-full bg-lagoon px-3 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-moss"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        className="rounded-full bg-clay px-3 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
