import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { jsonError, requiredNumber, requiredString } from "@/lib/api";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const values = [
      requiredNumber(body.district_id, "District"),
      requiredString(body.ds_en, "English DS name"),
      requiredString(body.ds_si, "Sinhala DS name"),
      requiredString(body.ds_ta, "Tamil DS name"),
      Number(params.id),
    ];

    const { rows } = await pool.query(
      "UPDATE divisional_secretariats SET district_id = $1, ds_en = $2, ds_si = $3, ds_ta = $4 WHERE id = $5 RETURNING *",
      values,
    );

    if (!rows[0]) return jsonError("Divisional secretariat not found", 404);
    return NextResponse.json(rows[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update divisional secretariat";
    return jsonError(message, 400);
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const { rowCount } = await pool.query("DELETE FROM divisional_secretariats WHERE id = $1", [Number(params.id)]);
    if (!rowCount) return jsonError("Divisional secretariat not found", 404);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to delete divisional secretariat", 500);
  }
}
