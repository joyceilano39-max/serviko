import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS vouchers (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE,
        description TEXT,
        discount_type VARCHAR(20) DEFAULT 'fixed',
        discount_value INTEGER DEFAULT 0,
        min_order INTEGER DEFAULT 0,
        expiry_date VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    const existing = await sql`SELECT COUNT(*) as count FROM vouchers`;
    if (parseInt(existing[0].count) === 0) {
      await sql`
        INSERT INTO vouchers (code, description, discount_type, discount_value, min_order, expiry_date)
        VALUES
          ('FIRST50', 'P50 off your first booking', 'fixed', 50, 0, 'No expiry'),
          ('SUMMER20', '20% off massage services', 'percent', 20, 200, 'June 30, 2026'),
          ('REFER100', 'P100 referral reward', 'fixed', 100, 500, 'No expiry'),
          ('WELCOME50', 'Welcome gift - P50 off', 'fixed', 50, 0, 'No expiry'),
          ('LOYAL200', 'Loyalty reward - P200 off', 'fixed', 200, 1000, 'No expiry')
      `;
    }
    const vouchers = await sql`SELECT * FROM vouchers WHERE is_active = true ORDER BY created_at DESC`;
    return NextResponse.json({ vouchers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch vouchers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { code, description, discount_type, discount_value, min_order, expiry_date } = await req.json();
  try {
    const result = await sql`
      INSERT INTO vouchers (code, description, discount_type, discount_value, min_order, expiry_date)
      VALUES (${code}, ${description}, ${discount_type}, ${discount_value}, ${min_order}, ${expiry_date})
      RETURNING *
    `;
    return NextResponse.json({ success: true, voucher: result[0] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create voucher" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { id, is_active } = await req.json();
  try {
    await sql`UPDATE vouchers SET is_active = ${is_active} WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update voucher" }, { status: 500 });
  }
}
