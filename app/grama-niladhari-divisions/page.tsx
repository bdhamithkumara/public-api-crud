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
  {
    name: "divisional_secretariat_id",
    label: "Divisional Secretariat",
    type: "select",
    required: true,
    options: [],
    dependency: {
      source: "divisionalSecretariats",
      valueKey: "id",
      labelKey: "ds_en",
      filterBy: { field: "district_id", key: "district_id" },
    },
  },
  { name: "gnd_en", label: "GND Name EN", required: true },
  { name: "gnd_si", label: "GND Name SI", required: true },
  { name: "gnd_ta", label: "GND Name TA", required: true },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "province_name", label: "Province" },
  { key: "district_name", label: "District" },
  { key: "divisional_secretariat_name", label: "Divisional Secretariat" },
  { key: "gnd_en", label: "GND Name EN" },
  { key: "gnd_si", label: "GND Name SI" },
  { key: "gnd_ta", label: "GND Name TA" },
];

export default function GramaNiladhariDivisionsPage() {
  return (
    <ResourcePage
      title="Grama Niladhari Divisions"
      description="Manage GND records under the correct province, district, and divisional secretariat."
      endpoint="/api/grama-niladhari-divisions"
      fields={fields}
      columns={columns}
      initialValues={{
        province_id: "",
        district_id: "",
        divisional_secretariat_id: "",
        gnd_en: "",
        gnd_si: "",
        gnd_ta: "",
      }}
      dependencyEndpoints={{
        provinces: "/api/provinces",
        districts: "/api/districts",
        divisionalSecretariats: "/api/divisional-secretariats",
      }}
    />
  );
}
