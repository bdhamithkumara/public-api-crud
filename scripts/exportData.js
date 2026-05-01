const fs = require("fs/promises");
const path = require("path");
const { createPool } = require("./db");

async function main() {
  const pool = createPool();

  try {
    const [provinces, districts, divisionalSecretariats, cities] = await Promise.all([
      pool.query("SELECT * FROM provinces ORDER BY id ASC"),
      pool.query("SELECT * FROM districts ORDER BY id ASC"),
      pool.query("SELECT * FROM divisional_secretariats ORDER BY id ASC"),
      pool.query("SELECT * FROM cities ORDER BY id ASC"),
    ]);

    const backup = {
      provinces: provinces.rows,
      districts: districts.rows,
      divisional_secretariats: divisionalSecretariats.rows,
      cities: cities.rows,
    };

    const outputPath = path.join(process.cwd(), "backup.json");
    await fs.writeFile(outputPath, JSON.stringify(backup, null, 2));
    console.log(`Exported backup to ${outputPath}`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
