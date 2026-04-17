import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const code = req.nextUrl.searchParams.get("code");
  try {
    await sql`CREATE TABLE IF NOT EXISTS referrals (id SERIAL PRIMARY KEY, referrer_code VARCHAR(50), referred_name VARCHAR(255), referred_email VARCHAR(255), status VARCHAR(50) DEFAULT 'pending', reward INTEGER DEFAULT 100, created_at TIMESTAMP DEFAULT NOW())`;
    const referrals = code ? await sql`SELECT * FROM referrals WHERE referrer_code = ${code} ORDER BY created_at DESC` : await sql`SELECT * FROM referrals ORDER BY created_at DESC`;
    return NextResponse.json({ referrals });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { referrer_code, referred_name, referred_email } = await req.json();
  try {
    const result = await sql`INSERT INTO referrals (referrer_code, referred_name, referred_email) VALUES (${referrer_code}, ${referred_name}, ${referred_email}) RETURNING *`;
    return NextResponse.json({ success: true, referral: result[0] });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
