import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { jsonError, requiredNumber, requiredString } from "@/lib/api";

async function gndMatches(gndId: number, divisionalSecretariatId: number, districtId: number, provinceId: number) {
  const { rowCount } = await pool.query(
    `SELECT grama_niladhari_divisions.id
     FROM grama_niladhari_divisions
     JOIN divisional_secretariats ON divisional_secretariats.id = grama_niladhari_divisions.divisional_secretariat_id
     JOIN districts ON districts.id = divisional_secretariats.district_id
     WHERE grama_niladhari_divisions.id = $1
       AND grama_niladhari_divisions.divisional_secretariat_id = $2
       AND divisional_secretariats.district_id = $3
       AND districts.province_id = $4`,
    [gndId, divisionalSecretariatId, districtId, provinceId],
  );

  return Boolean(rowCount);
}

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT
        villages.*,
        districts.province_id,
        provinces.name_en AS province_name,
        divisional_secretariats.district_id,
        districts.name_en AS district_name,
        grama_niladhari_divisions.divisional_secretariat_id,
        divisional_secretariats.ds_en AS divisional_secretariat_name,
        grama_niladhari_divisions.gnd_en AS gnd_name
      FROM villages
      JOIN grama_niladhari_divisions ON grama_niladhari_divisions.id = villages.gnd_id
      JOIN divisional_secretariats ON divisional_secretariats.id = grama_niladhari_divisions.divisional_secretariat_id
      JOIN districts ON districts.id = divisional_secretariats.district_id
      JOIN provinces ON provinces.id = districts.province_id
      ORDER BY villages.id ASC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load villages", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const provinceId = requiredNumber(body.province_id, "Province");
    const districtId = requiredNumber(body.district_id, "District");
    const divisionalSecretariatId = requiredNumber(body.divisional_secretariat_id, "Divisional secretariat");
    const gndId = requiredNumber(body.gnd_id, "Grama Niladhari division");

    const matches = await gndMatches(gndId, divisionalSecretariatId, districtId, provinceId);
    if (!matches) return jsonError("GND does not belong to the selected divisional secretariat, district, and province", 400);

    const values = [
      gndId,
      requiredString(body.village_en, "English village name"),
      requiredString(body.village_si, "Sinhala village name"),
      requiredString(body.village_ta, "Tamil village name"),
    ];

    const { rows } = await pool.query(
      `INSERT INTO villages (gnd_id, village_en, village_si, village_ta)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      values,
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create village";
    return jsonError(message, 400);
  }
}
