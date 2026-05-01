import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { jsonError, optionalNumber, optionalString, requiredNumber, requiredString } from "@/lib/api";

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT cities.*, districts.name_en AS district_name
      FROM cities
      JOIN districts ON districts.id = cities.district_id
      ORDER BY cities.id ASC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load cities", 500);
  }
}

export async function POST(request: Request) {
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
    ];

    const { rows } = await pool.query(
      `INSERT INTO cities (
        district_id, name_en, name_si, name_ta, sub_name_en, sub_name_si, sub_name_ta, postcode, latitude, longitude
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      values,
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create city";
    return jsonError(message, 400);
  }
}
