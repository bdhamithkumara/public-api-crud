import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { jsonError, requiredNumber, requiredString } from "@/lib/api";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const values = [
      requiredNumber(body.province_id, "Province"),
      requiredString(body.name_en, "English name"),
      requiredString(body.name_si, "Sinhala name"),
      requiredString(body.name_ta, "Tamil name"),
      Number(params.id),
    ];

    const { rows } = await pool.query(
      "UPDATE districts SET province_id = $1, name_en = $2, name_si = $3, name_ta = $4 WHERE id = $5 RETURNING *",
      values,
    );

    if (!rows[0]) return jsonError("District not found", 404);
    return NextResponse.json(rows[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update district";
    return jsonError(message, 400);
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const { rowCount } = await pool.query("DELETE FROM districts WHERE id = $1", [Number(params.id)]);
    if (!rowCount) return jsonError("District not found", 404);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Delete failed. Remove related DS divisions or cities first.", 409);
  }
}
