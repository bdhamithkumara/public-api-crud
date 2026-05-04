import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { jsonError, requiredNumber, requiredString } from "@/lib/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const provinceId = requiredNumber(body.province_id, "Province");
    const districtId = requiredNumber(body.district_id, "District");
    const district = await pool.query("SELECT id FROM districts WHERE id = $1 AND province_id = $2", [districtId, provinceId]);
    if (!district.rowCount) return jsonError("District does not belong to the selected province", 400);

    const values = [
      provinceId,
      districtId,
      requiredString(body.ds_en, "English DS name"),
      requiredString(body.ds_si, "Sinhala DS name"),
      requiredString(body.ds_ta, "Tamil DS name"),
      Number(id),
    ];

    const { rows } = await pool.query(
      "UPDATE divisional_secretariats SET province_id = $1, district_id = $2, ds_en = $3, ds_si = $4, ds_ta = $5 WHERE id = $6 RETURNING *",
      values,
    );

    if (!rows[0]) return jsonError("Divisional secretariat not found", 404);
    return NextResponse.json(rows[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update divisional secretariat";
    return jsonError(message, 400);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { rowCount } = await pool.query("DELETE FROM divisional_secretariats WHERE id = $1", [Number(id)]);
    if (!rowCount) return jsonError("Divisional secretariat not found", 404);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to delete divisional secretariat", 500);
  }
}
