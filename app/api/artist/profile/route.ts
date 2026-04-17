import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const id = req.nextUrl.searchParams.get("id");
  try {
    if (id) {
      const result = await sql`SELECT a.*, u.name, u.email, u.phone FROM artists a JOIN users u ON a.user_id = u.id WHERE a.id = ${id} LIMIT 1`;
      if (result.length === 0) return NextResponse.json({ artist: null });
      return NextResponse.json({ artist: result[0] });
    }
    return NextResponse.json({ artist: null });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
