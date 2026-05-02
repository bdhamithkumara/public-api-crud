import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { jsonError, requiredNumber, requiredString } from "@/lib/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function divisionalSecretariatMatches(divisionalSecretariatId: number, districtId: number, provinceId: number) {
  const { rowCount } = await pool.query(
    `SELECT divisional_secretariats.id
     FROM divisional_secretariats
     JOIN districts ON districts.id = divisional_secretariats.district_id
     WHERE divisional_secretariats.id = $1
       AND divisional_secretariats.district_id = $2
       AND districts.province_id = $3`,
    [divisionalSecretariatId, districtId, provinceId],
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

    const matches = await divisionalSecretariatMatches(divisionalSecretariatId, districtId, provinceId);
    if (!matches) return jsonError("Divisional secretariat does not belong to the selected district and province", 400);

    const values = [
      divisionalSecretariatId,
      requiredString(body.gnd_en, "English GND name"),
      requiredString(body.gnd_si, "Sinhala GND name"),
      requiredString(body.gnd_ta, "Tamil GND name"),
      Number(id),
    ];

    const { rows } = await pool.query(
      `UPDATE grama_niladhari_divisions
       SET divisional_secretariat_id = $1, gnd_en = $2, gnd_si = $3, gnd_ta = $4
       WHERE id = $5 RETURNING *`,
      values,
    );

    if (!rows[0]) return jsonError("Grama Niladhari division not found", 404);
    return NextResponse.json(rows[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update Grama Niladhari division";
    return jsonError(message, 400);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { rowCount } = await pool.query("DELETE FROM grama_niladhari_divisions WHERE id = $1", [Number(id)]);
    if (!rowCount) return jsonError("Grama Niladhari division not found", 404);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Delete failed. Remove related villages first.", 409);
  }
}
