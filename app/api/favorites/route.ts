import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const customerEmail = req.nextUrl.searchParams.get("customerEmail");
  try {
    await sql`CREATE TABLE IF NOT EXISTS favorites (id SERIAL PRIMARY KEY, customer_email VARCHAR(255), artist_id INTEGER, created_at TIMESTAMP DEFAULT NOW(), UNIQUE(customer_email, artist_id))`;
    const favorites = customerEmail ? await sql`SELECT f.*, u.name as artist_name, a.profile_photo, a.location, a.services, a.rating FROM favorites f JOIN artists a ON f.artist_id = a.id JOIN users u ON a.user_id = u.id WHERE f.customer_email = ${customerEmail} ORDER BY f.created_at DESC` : [];
    return NextResponse.json({ favorites });
  } catch (error) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { customer_email, artist_id } = await req.json();
  try {
    await sql`INSERT INTO favorites (customer_email, artist_id) VALUES (${customer_email}, ${artist_id}) ON CONFLICT (customer_email, artist_id) DO NOTHING`;
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
export async function DELETE(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { customer_email, artist_id } = await req.json();
  try {
    await sql`DELETE FROM favorites WHERE customer_email = ${customer_email} AND artist_id = ${artist_id}`;
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
