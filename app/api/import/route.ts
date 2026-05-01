import { NextResponse } from "next/server";
import { importBackup } from "@/lib/backup";
import { jsonError } from "@/lib/api";
import { pool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await importBackup(pool, data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to import backup. Check JSON shape and foreign key order.", 400);
  }
}
