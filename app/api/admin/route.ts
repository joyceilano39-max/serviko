import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);

  try {
    const customers = await sql`
      SELECT * FROM users 
      WHERE role = 'customer' 
      ORDER BY created_at DESC
    `;

    const artists = await sql`
      SELECT u.name, u.email, u.phone, a.* 
      FROM artists a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `;

    const bookings = await sql`
      SELECT * FROM bookings 
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ customers, artists, bookings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}