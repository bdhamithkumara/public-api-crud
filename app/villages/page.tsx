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
  {
    name: "gnd_id",
    label: "Grama Niladhari Division",
    type: "select",
    required: true,
    options: [],
    dependency: {
      source: "gramaNiladhariDivisions",
      valueKey: "id",
      labelKey: "gnd_en",
      filterBy: { field: "divisional_secretariat_id", key: "divisional_secretariat_id" },
    },
  },
  { name: "village_en", label: "Village Name EN", required: true },
  { name: "village_si", label: "Village Name SI", required: true },
  { name: "village_ta", label: "Village Name TA", required: true },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "province_name", label: "Province" },
  { key: "district_name", label: "District" },
  { key: "divisional_secretariat_name", label: "Divisional Secretariat" },
  { key: "gnd_name", label: "GND" },
  { key: "village_en", label: "Village Name EN" },
  { key: "village_si", label: "Village Name SI" },
  { key: "village_ta", label: "Village Name TA" },
];

export default function VillagesPage() {
  return (
    <ResourcePage
      title="Villages"
      description="Manage village records under the correct Grama Niladhari division."
      endpoint="/api/villages"
      fields={fields}
      columns={columns}
      initialValues={{
        province_id: "",
        district_id: "",
        divisional_secretariat_id: "",
        gnd_id: "",
        village_en: "",
        village_si: "",
        village_ta: "",
      }}
      dependencyEndpoints={{
        provinces: "/api/provinces",
        districts: "/api/districts",
        divisionalSecretariats: "/api/divisional-secretariats",
        gramaNiladhariDivisions: "/api/grama-niladhari-divisions",
      }}
    />
  );
}
