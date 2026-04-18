import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const artistId = req.nextUrl.searchParams.get("artistId");
  try {
    const reviews = await sql`SELECT * FROM reviews WHERE artist_id = ${artistId} ORDER BY created_at DESC`;
    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const { artistId, customerName, customerEmail, bookingId, rating, comment } = await req.json();
    await sql`INSERT INTO reviews (artist_id, customer_name, customer_email, booking_id, rating, comment) VALUES (${artistId}, ${customerName}, ${customerEmail}, ${bookingId}, ${rating}, ${comment})`;
    const avg = await sql`SELECT AVG(rating) as avg, COUNT(*) as total FROM reviews WHERE artist_id = ${artistId}`;
    await sql`UPDATE artists SET rating = ${avg[0].avg}, total_reviews = ${avg[0].total} WHERE id = ${artistId}`;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
