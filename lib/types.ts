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
  province_id: number;
  province_name?: string;
  district_id: number;
  district_name?: string;
  ds_en: string;
  ds_si: string;
  ds_ta: string;
};

export type GramaNiladhariDivision = {
  id: number;
  province_id?: number;
  province_name?: string;
  district_id?: number;
  district_name?: string;
  divisional_secretariat_id: number;
  divisional_secretariat_name?: string;
  gnd_en: string | null;
  gnd_si: string | null;
  gnd_ta: string | null;
};

export type Village = {
  id: number;
  province_id?: number;
  province_name?: string;
  district_id?: number;
  district_name?: string;
  divisional_secretariat_id?: number;
  divisional_secretariat_name?: string;
  gnd_id: number;
  gnd_name?: string;
  village_en: string | null;
  village_si: string | null;
  village_ta: string | null;
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
  grama_niladhari_divisions: GramaNiladhariDivision[];
  villages: Village[];
  cities: City[];
};
