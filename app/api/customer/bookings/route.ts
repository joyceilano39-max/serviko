import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const email = req.nextUrl.searchParams.get("email");
  try {
    let bookings;
    if (email) {
      bookings = await sql`
        SELECT b.*, u.name as artist_name
        FROM bookings b
        LEFT JOIN artists a ON b.artist_id = a.id
        LEFT JOIN users u ON a.user_id = u.id
        WHERE b.customer_email = ${email}
        ORDER BY b.created_at DESC
      `;
    } else {
      bookings = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
    }
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
