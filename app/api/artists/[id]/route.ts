import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sql = neon(process.env.DATABASE_URL!);
  const { id } = await params;
  try {
    const result = await sql`SELECT a.*, u.name, u.email FROM artists a JOIN users u ON a.user_id = u.id WHERE a.id = ${id}`;
    if (result.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ artist: result[0] });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}