import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { jsonError, requiredString } from "@/lib/api";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const values = [
      requiredString(body.name_en, "English name"),
      requiredString(body.name_si, "Sinhala name"),
      requiredString(body.name_ta, "Tamil name"),
      Number(params.id),
    ];

    const { rows } = await pool.query(
      "UPDATE provinces SET name_en = $1, name_si = $2, name_ta = $3 WHERE id = $4 RETURNING *",
      values,
    );

    if (!rows[0]) return jsonError("Province not found", 404);
    return NextResponse.json(rows[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update province";
    return jsonError(message, 400);
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const { rowCount } = await pool.query("DELETE FROM provinces WHERE id = $1", [Number(params.id)]);
    if (!rowCount) return jsonError("Province not found", 404);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Delete failed. Remove related districts first.", 409);
  }
}
