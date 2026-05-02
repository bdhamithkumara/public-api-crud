import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { jsonError, requiredNumber, requiredString } from "@/lib/api";

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT
        divisional_secretariats.*,
        districts.province_id,
        provinces.name_en AS province_name,
        districts.name_en AS district_name
      FROM divisional_secretariats
      JOIN districts ON districts.id = divisional_secretariats.district_id
      JOIN provinces ON provinces.id = districts.province_id
      ORDER BY divisional_secretariats.id ASC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load divisional secretariats", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const provinceId = requiredNumber(body.province_id, "Province");
    const districtId = requiredNumber(body.district_id, "District");
    const district = await pool.query("SELECT id FROM districts WHERE id = $1 AND province_id = $2", [districtId, provinceId]);
    if (!district.rowCount) return jsonError("District does not belong to the selected province", 400);

    const values = [
      districtId,
      requiredString(body.ds_en, "English DS name"),
      requiredString(body.ds_si, "Sinhala DS name"),
      requiredString(body.ds_ta, "Tamil DS name"),
    ];

    const { rows } = await pool.query(
      "INSERT INTO divisional_secretariats (district_id, ds_en, ds_si, ds_ta) VALUES ($1, $2, $3, $4) RETURNING *",
      values,
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create divisional secretariat";
    return jsonError(message, 400);
  }
}
