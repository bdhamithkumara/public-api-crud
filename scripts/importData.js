const fs = require("fs/promises");
const path = require("path");
const { createPool } = require("./db");

const tableOrder = ["provinces", "districts", "divisional_secretariats", "cities"];

async function resetSequences(client) {
  for (const table of tableOrder) {
    await client.query(
      `SELECT setval(
        pg_get_serial_sequence('${table}', 'id'),
        COALESCE((SELECT MAX(id) FROM ${table}), 1),
        (SELECT MAX(id) IS NOT NULL FROM ${table})
      )`,
    );
  }
}

async function main() {
  const pool = createPool();
  const client = await pool.connect();

  try {
    const backupPath = path.join(process.cwd(), "backup.json");
    const backup = JSON.parse(await fs.readFile(backupPath, "utf8"));

    await client.query("BEGIN");

    for (const province of backup.provinces ?? []) {
      await client.query(
        `INSERT INTO provinces (id, name_en, name_si, name_ta)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [province.id, province.name_en, province.name_si, province.name_ta],
      );
    }

    for (const district of backup.districts ?? []) {
      await client.query(
        `INSERT INTO districts (id, province_id, name_en, name_si, name_ta)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [district.id, district.province_id, district.name_en, district.name_si, district.name_ta],
      );
    }

    for (const ds of backup.divisional_secretariats ?? []) {
      await client.query(
        `INSERT INTO divisional_secretariats (id, district_id, ds_en, ds_si, ds_ta)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [ds.id, ds.district_id, ds.ds_en, ds.ds_si, ds.ds_ta],
      );
    }

    for (const city of backup.cities ?? []) {
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

    await resetSequences(client);
    await client.query("COMMIT");
    console.log("Import completed successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
