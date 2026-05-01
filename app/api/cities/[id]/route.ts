import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { jsonError, optionalNumber, optionalString, requiredNumber, requiredString } from "@/lib/api";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const values = [
      requiredNumber(body.district_id, "District"),
      requiredString(body.name_en, "English name"),
      requiredString(body.name_si, "Sinhala name"),
      requiredString(body.name_ta, "Tamil name"),
      optionalString(body.sub_name_en),
      optionalString(body.sub_name_si),
      optionalString(body.sub_name_ta),
      optionalString(body.postcode),
      optionalNumber(body.latitude, "Latitude"),
      optionalNumber(body.longitude, "Longitude"),
      Number(params.id),
    ];

    const { rows } = await pool.query(
      `UPDATE cities SET
        district_id = $1,
        name_en = $2,
        name_si = $3,
        name_ta = $4,
        sub_name_en = $5,
        sub_name_si = $6,
        sub_name_ta = $7,
        postcode = $8,
        latitude = $9,
        longitude = $10
      WHERE id = $11 RETURNING *`,
      values,
    );

    if (!rows[0]) return jsonError("City not found", 404);
    return NextResponse.json(rows[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update city";
    return jsonError(message, 400);
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const { rowCount } = await pool.query("DELETE FROM cities WHERE id = $1", [Number(params.id)]);
    if (!rowCount) return jsonError("City not found", 404);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to delete city", 500);
  }
}
