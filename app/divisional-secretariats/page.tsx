import { FormField } from "@/components/AdminForm";
import { ResourcePage } from "@/components/ResourcePage";

const fields: FormField[] = [
  { name: "district_id", label: "District", type: "select", required: true, options: [] },
  { name: "ds_en", label: "DS Name EN", required: true },
  { name: "ds_si", label: "DS Name SI", required: true },
  { name: "ds_ta", label: "DS Name TA", required: true },
];

const columns = [
  { key: "id", label: "ID" },
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
      initialValues={{ district_id: "", ds_en: "", ds_si: "", ds_ta: "" }}
      dependencyEndpoints={{ districts: "/api/districts" }}
      mapDependencies={(baseFields, dependencies) =>
        baseFields.map((field) =>
          field.name === "district_id"
            ? {
                ...field,
                options: (dependencies.districts ?? []).map((district) => ({
                  value: Number(district.id),
                  label: String(district.name_en),
                })),
              }
            : field,
        )
      }
    />
  );
}
