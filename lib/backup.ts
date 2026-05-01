import { Pool, PoolClient } from "pg";
import { BackupData } from "@/lib/types";

const tableOrder = ["provinces", "districts", "divisional_secretariats", "cities"] as const;

type Queryable = Pool | PoolClient;

export async function exportBackup(db: Queryable): Promise<BackupData> {
  const [provinces, districts, divisionalSecretariats, cities] = await Promise.all([
    db.query("SELECT * FROM provinces ORDER BY id ASC"),
    db.query("SELECT * FROM districts ORDER BY id ASC"),
    db.query("SELECT * FROM divisional_secretariats ORDER BY id ASC"),
    db.query("SELECT * FROM cities ORDER BY id ASC"),
  ]);

  return {
    provinces: provinces.rows,
    districts: districts.rows,
    divisional_secretariats: divisionalSecretariats.rows,
    cities: cities.rows,
  };
}

export async function importBackup(db: Pool, data: BackupData) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    for (const province of data.provinces ?? []) {
      await client.query(
        `INSERT INTO provinces (id, name_en, name_si, name_ta)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [province.id, province.name_en, province.name_si, province.name_ta],
      );
    }

    for (const district of data.districts ?? []) {
      await client.query(
        `INSERT INTO districts (id, province_id, name_en, name_si, name_ta)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [district.id, district.province_id, district.name_en, district.name_si, district.name_ta],
      );
    }

    for (const ds of data.divisional_secretariats ?? []) {
      await client.query(
        `INSERT INTO divisional_secretariats (id, district_id, ds_en, ds_si, ds_ta)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [ds.id, ds.district_id, ds.ds_en, ds.ds_si, ds.ds_ta],
      );
    }

    for (const city of data.cities ?? []) {
      await client.query(
        `INSERT INTO cities (
          id, district_id, name_en, name_si, name_ta, sub_name_en, sub_name_si, sub_name_ta, postcode, latitude, longitude
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING`,
        [
          city.id,
          city.district_id,
          city.name_en,
          city.name_si,
          city.name_ta,
          city.sub_name_en,
          city.sub_name_si,
          city.sub_name_ta,
          city.postcode,
          city.latitude,
          city.longitude,
        ],
      );
    }

    for (const table of tableOrder) {
      await client.query(
        `SELECT setval(
          pg_get_serial_sequence('${table}', 'id'),
          COALESCE((SELECT MAX(id) FROM ${table}), 1),
          (SELECT MAX(id) IS NOT NULL FROM ${table})
        )`,
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
