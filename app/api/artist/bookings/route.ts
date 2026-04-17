import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const email = req.nextUrl.searchParams.get("email");
  try {
    let bookings;
    if (email) {
      bookings = await sql`
        SELECT b.* FROM bookings b
        JOIN artists a ON b.artist_id = a.id
        JOIN users u ON a.user_id = u.id
        WHERE u.email = ${email}
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

export async function PATCH(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { bookingId, status } = await req.json();
  try {
    await sql`UPDATE bookings SET status = ${status} WHERE id = ${bookingId}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { customer_name, customer_email, customer_phone, artist_id, date, time, address, distance, transport_fee, total, payment_method, notes, members } = await req.json();
  try {
    const result = await sql`
      INSERT INTO bookings (customer_name, customer_email, customer_phone, artist_id, date, time, address, distance, transport_fee, total, payment_method, notes, members, status)
      VALUES (${customer_name}, ${customer_email}, ${customer_phone}, ${artist_id}, ${date}, ${time}, ${address}, ${distance}, ${transport_fee}, ${total}, ${payment_method}, ${notes}, ${JSON.stringify(members)}, 'pending')
      RETURNING *
    `;
    return NextResponse.json({ success: true, booking: result[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
  }
}
