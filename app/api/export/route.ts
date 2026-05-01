import { NextResponse } from "next/server";
import { exportBackup } from "@/lib/backup";
import { jsonError } from "@/lib/api";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const backup = await exportBackup(pool);
    return NextResponse.json(backup, {
      headers: {
        "Content-Disposition": 'attachment; filename="backup.json"',
      },
    });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to export backup", 500);
  }
}
