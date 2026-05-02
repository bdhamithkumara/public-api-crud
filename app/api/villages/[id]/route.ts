import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { jsonError, requiredNumber, requiredString } from "@/lib/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
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
      Number(id),
    ];

    const { rows } = await pool.query(
      `UPDATE villages
       SET gnd_id = $1, village_en = $2, village_si = $3, village_ta = $4
       WHERE id = $5 RETURNING *`,
      values,
    );

    if (!rows[0]) return jsonError("Village not found", 404);
    return NextResponse.json(rows[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update village";
    return jsonError(message, 400);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { rowCount } = await pool.query("DELETE FROM villages WHERE id = $1", [Number(id)]);
    if (!rowCount) return jsonError("Village not found", 404);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to delete village", 500);
  }
}
