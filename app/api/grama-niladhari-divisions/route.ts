import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { jsonError, requiredNumber, requiredString } from "@/lib/api";

async function divisionalSecretariatMatches(divisionalSecretariatId: number, districtId: number, provinceId: number) {
  const { rowCount } = await pool.query(
    `SELECT divisional_secretariats.id
     FROM divisional_secretariats
     JOIN districts ON districts.id = divisional_secretariats.district_id
     WHERE divisional_secretariats.id = $1
       AND divisional_secretariats.district_id = $2
       AND divisional_secretariats.province_id = $3
       AND districts.province_id = $3`,
    [divisionalSecretariatId, districtId, provinceId],
  );

  return Boolean(rowCount);
}

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT
        grama_niladhari_divisions.*,
        divisional_secretariats.province_id,
        provinces.name_en AS province_name,
        divisional_secretariats.district_id,
        districts.name_en AS district_name,
        divisional_secretariats.ds_en AS divisional_secretariat_name
      FROM grama_niladhari_divisions
      JOIN divisional_secretariats ON divisional_secretariats.id = grama_niladhari_divisions.divisional_secretariat_id
      JOIN districts ON districts.id = divisional_secretariats.district_id
      JOIN provinces ON provinces.id = divisional_secretariats.province_id
      ORDER BY grama_niladhari_divisions.id ASC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load Grama Niladhari divisions", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const provinceId = requiredNumber(body.province_id, "Province");
    const districtId = requiredNumber(body.district_id, "District");
    const divisionalSecretariatId = requiredNumber(body.divisional_secretariat_id, "Divisional secretariat");

    const matches = await divisionalSecretariatMatches(divisionalSecretariatId, districtId, provinceId);
    if (!matches) return jsonError("Divisional secretariat does not belong to the selected district and province", 400);

    const values = [
      divisionalSecretariatId,
      requiredString(body.gnd_en, "English GND name"),
      requiredString(body.gnd_si, "Sinhala GND name"),
      requiredString(body.gnd_ta, "Tamil GND name"),
    ];

    const { rows } = await pool.query(
      `INSERT INTO grama_niladhari_divisions (divisional_secretariat_id, gnd_en, gnd_si, gnd_ta)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      values,
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create Grama Niladhari division";
    return jsonError(message, 400);
  }
}
