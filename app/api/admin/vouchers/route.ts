import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    await sql`CREATE TABLE IF NOT EXISTS vouchers (id SERIAL PRIMARY KEY, code VARCHAR(50) UNIQUE, discount INT, discount_type VARCHAR(10), min_order INT, valid_until DATE, usage_count INT DEFAULT 0, active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW())`;
    const vouchers = await sql`SELECT * FROM vouchers ORDER BY created_at DESC`;
    return NextResponse.json({ vouchers });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, vouchers: [] });
  }
}

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const body = await req.json();
  try {
    await sql`INSERT INTO vouchers (code, discount, discount_type, min_order, valid_until, active) VALUES (${body.code}, ${body.discount}, ${body.discount_type}, ${body.min_order}, ${body.valid_until}, true)`;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const id = req.nextUrl.searchParams.get("id");
  try {
    await sql`DELETE FROM vouchers WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}