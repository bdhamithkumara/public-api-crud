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
  {
    name: "district_id",
    label: "District",
    type: "select",
    required: true,
    options: [],
    dependency: {
      source: "districts",
      valueKey: "id",
      labelKey: "name_en",
      filterBy: { field: "province_id", key: "province_id" },
    },
  },
  { name: "ds_en", label: "DS Name EN", required: true },
  { name: "ds_si", label: "DS Name SI", required: true },
  { name: "ds_ta", label: "DS Name TA", required: true },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "province_name", label: "Province" },
  { key: "district_name", label: "District" },
  { key: "ds_en", label: "DS Name EN" },
  { key: "ds_si", label: "DS Name SI" },
  { key: "ds_ta", label: "DS Name TA" },
];

export default function DivisionalSecretariatsPage() {
  return (
    <ResourcePage
      title="Divisional Secretariats"
      description="Manage DS divisions and attach each one to a district using a dropdown."
      endpoint="/api/divisional-secretariats"
      fields={fields}
      columns={columns}
      initialValues={{ province_id: "", district_id: "", ds_en: "", ds_si: "", ds_ta: "" }}
      dependencyEndpoints={{ provinces: "/api/provinces", districts: "/api/districts" }}
      persistedFields={{
        storageKey: "divisional-secretariats-selection",
        fields: ["province_id", "district_id"],
      }}
    />
  );
}
