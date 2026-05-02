import { FormField } from "@/components/AdminForm";
import { ResourcePage } from "@/components/ResourcePage";

const fields: FormField[] = [
  {
    name: "province_id",
    label: "Province",
    type: "select",
    required: true,
    options: [],
    dependency: { source: "provinces", valueKey: "id", labelKey: "name_en" },
  },
  { name: "name_en", label: "Name EN", required: true },
  { name: "name_si", label: "Name SI", required: true },
  { name: "name_ta", label: "Name TA", required: true },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "province_name", label: "Province" },
  { key: "name_en", label: "Name EN" },
  { key: "name_si", label: "Name SI" },
  { key: "name_ta", label: "Name TA" },
];

export default function DistrictsPage() {
  return (
    <ResourcePage
      title="Districts"
      description="Fully working example page: select a province from the dropdown, then create, edit, or delete districts. No manual province IDs needed."
      endpoint="/api/districts"
      fields={fields}
      columns={columns}
      initialValues={{ province_id: "", name_en: "", name_si: "", name_ta: "" }}
      dependencyEndpoints={{ provinces: "/api/provinces" }}
    />
  );
}
