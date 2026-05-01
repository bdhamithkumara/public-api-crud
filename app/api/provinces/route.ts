import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { jsonError, requiredString } from "@/lib/api";

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM provinces ORDER BY id ASC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load provinces", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const values = [
      requiredString(body.name_en, "English name"),
      requiredString(body.name_si, "Sinhala name"),
      requiredString(body.name_ta, "Tamil name"),
    ];

    const { rows } = await pool.query(
      "INSERT INTO provinces (name_en, name_si, name_ta) VALUES ($1, $2, $3) RETURNING *",
      values,
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create province";
    return jsonError(message, 400);
  }
}
