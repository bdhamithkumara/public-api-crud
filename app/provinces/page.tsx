import { ResourcePage } from "@/components/ResourcePage";

const fields = [
  { name: "name_en", label: "Name EN", required: true },
  { name: "name_si", label: "Name SI", required: true },
  { name: "name_ta", label: "Name TA", required: true },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "name_en", label: "Name EN" },
  { key: "name_si", label: "Name SI" },
  { key: "name_ta", label: "Name TA" },
];

export default function ProvincesPage() {
  return (
    <ResourcePage
      title="Provinces"
      description="Manage province names in English, Sinhala, and Tamil. These records are used by districts."
      endpoint="/api/provinces"
      fields={fields}
      columns={columns}
      initialValues={{ name_en: "", name_si: "", name_ta: "" }}
    />
  );
}
