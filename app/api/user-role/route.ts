import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ role: null });
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`SELECT role FROM users WHERE email = ${email}`;
    return NextResponse.json({ role: result[0]?.role || null });
  } catch {
    return NextResponse.json({ role: null });
  }
}