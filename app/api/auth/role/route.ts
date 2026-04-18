import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const email = req.nextUrl.searchParams.get("email");
  try {
    const user = await sql`SELECT role FROM users WHERE email = ${email} LIMIT 1`;
    if (user.length === 0) return NextResponse.json({ role: "customer" });
    return NextResponse.json({ role: user[0].role });
  } catch (error) {
    return NextResponse.json({ role: "customer" });
  }
}
