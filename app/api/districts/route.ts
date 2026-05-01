import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { jsonError, requiredNumber, requiredString } from "@/lib/api";

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT districts.*, provinces.name_en AS province_name
      FROM districts
      JOIN provinces ON provinces.id = districts.province_id
      ORDER BY districts.id ASC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load districts", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const values = [
      requiredNumber(body.province_id, "Province"),
      requiredString(body.name_en, "English name"),
      requiredString(body.name_si, "Sinhala name"),
      requiredString(body.name_ta, "Tamil name"),
    ];

    const { rows } = await pool.query(
      "INSERT INTO districts (province_id, name_en, name_si, name_ta) VALUES ($1, $2, $3, $4) RETURNING *",
      values,
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create district";
    return jsonError(message, 400);
  }
}
