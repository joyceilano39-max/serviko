import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const bookings = await sql`SELECT * FROM bookings ORDER BY created_at DESC LIMIT 100`;
    return NextResponse.json({ bookings });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, bookings: [] }, { status: 200 });
  }
}