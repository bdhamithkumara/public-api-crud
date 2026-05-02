import { FormField } from "@/components/AdminForm";
import { ResourcePage } from "@/components/ResourcePage";

const fields: FormField[] = [
  {
    name: "district_id",
    label: "District",
    type: "select",
    required: true,
    options: [],
    dependency: { source: "districts", valueKey: "id", labelKey: "name_en" },
  },
  { name: "name_en", label: "Name EN", required: true },
  { name: "name_si", label: "Name SI", required: true },
  { name: "name_ta", label: "Name TA", required: true },
  { name: "sub_name_en", label: "Sub Name EN" },
  { name: "sub_name_si", label: "Sub Name SI" },
  { name: "sub_name_ta", label: "Sub Name TA" },
  { name: "postcode", label: "Postcode" },
  { name: "latitude", label: "Latitude", type: "number" },
  { name: "longitude", label: "Longitude", type: "number" },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "district_name", label: "District" },
  { key: "name_en", label: "Name EN" },
  { key: "name_si", label: "Name SI" },
  { key: "name_ta", label: "Name TA" },
  { key: "postcode", label: "Postcode" },
  { key: "latitude", label: "Latitude" },
  { key: "longitude", label: "Longitude" },
];

export default function CitiesPage() {
  return (
    <ResourcePage
      title="Cities"
      description="Manage cities with district selection, translated names, optional sub names, postcodes, and coordinates."
      endpoint="/api/cities"
      fields={fields}
      columns={columns}
      initialValues={{
        district_id: "",
        name_en: "",
        name_si: "",
        name_ta: "",
        sub_name_en: "",
        sub_name_si: "",
        sub_name_ta: "",
        postcode: "",
        latitude: "",
        longitude: "",
      }}
      dependencyEndpoints={{ districts: "/api/districts" }}
    />
  );
}
