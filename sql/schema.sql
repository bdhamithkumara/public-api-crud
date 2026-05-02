CREATE TABLE IF NOT EXISTS provinces (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(150) NOT NULL,
  name_si VARCHAR(150) NOT NULL,
  name_ta VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS districts (
  id SERIAL PRIMARY KEY,
  province_id INTEGER NOT NULL REFERENCES provinces(id) ON DELETE RESTRICT,
  name_en VARCHAR(150) NOT NULL,
  name_si VARCHAR(150) NOT NULL,
  name_ta VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS divisional_secretariats (
  id SERIAL PRIMARY KEY,
  district_id INTEGER NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
  ds_en VARCHAR(150) NOT NULL,
  ds_si VARCHAR(150) NOT NULL,
  ds_ta VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS grama_niladhari_divisions (
  id SERIAL PRIMARY KEY,
  divisional_secretariat_id INTEGER NOT NULL,
  gnd_en VARCHAR(150),
  gnd_si VARCHAR(150),
  gnd_ta VARCHAR(150),

  CONSTRAINT fk_gnd_ds
    FOREIGN KEY (divisional_secretariat_id)
    REFERENCES divisional_secretariats (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS villages (
  id SERIAL PRIMARY KEY,
  gnd_id INTEGER NOT NULL,
  village_en VARCHAR(150),
  village_si VARCHAR(150),
  village_ta VARCHAR(150),

  CONSTRAINT fk_village_gnd
    FOREIGN KEY (gnd_id)
    REFERENCES grama_niladhari_divisions (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  district_id INTEGER NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
  name_en VARCHAR(150) NOT NULL,
  name_si VARCHAR(150) NOT NULL,
  name_ta VARCHAR(150) NOT NULL,
  sub_name_en VARCHAR(150),
  sub_name_si VARCHAR(150),
  sub_name_ta VARCHAR(150),
  postcode VARCHAR(20),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7)
);

CREATE INDEX IF NOT EXISTS idx_districts_province_id ON districts(province_id);
CREATE INDEX IF NOT EXISTS idx_divisional_secretariats_district_id ON divisional_secretariats(district_id);
CREATE INDEX IF NOT EXISTS idx_grama_niladhari_divisions_ds_id ON grama_niladhari_divisions(divisional_secretariat_id);
CREATE INDEX IF NOT EXISTS idx_villages_gnd_id ON villages(gnd_id);
CREATE INDEX IF NOT EXISTS idx_cities_district_id ON cities(district_id);
