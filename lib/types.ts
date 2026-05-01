export type Province = {
  id: number;
  name_en: string;
  name_si: string;
  name_ta: string;
};

export type District = {
  id: number;
  province_id: number;
  province_name?: string;
  name_en: string;
  name_si: string;
  name_ta: string;
};

export type DivisionalSecretariat = {
  id: number;
  district_id: number;
  district_name?: string;
  ds_en: string;
  ds_si: string;
  ds_ta: string;
};

export type City = {
  id: number;
  district_id: number;
  district_name?: string;
  name_en: string;
  name_si: string;
  name_ta: string;
  sub_name_en: string | null;
  sub_name_si: string | null;
  sub_name_ta: string | null;
  postcode: string | null;
  latitude: string | null;
  longitude: string | null;
};

export type BackupData = {
  provinces: Province[];
  districts: District[];
  divisional_secretariats: DivisionalSecretariat[];
  cities: City[];
};
