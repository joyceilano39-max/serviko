import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const bookingId = req.nextUrl.searchParams.get("bookingId");
  try {
    await sql`CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, booking_id INTEGER, sender_email VARCHAR(255), sender_name VARCHAR(255), sender_role VARCHAR(50), message TEXT, is_read BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT NOW())`;
    const messages = bookingId ? await sql`SELECT * FROM messages WHERE booking_id = ${bookingId} ORDER BY created_at ASC` : [];
    return NextResponse.json({ messages });
  } catch (error) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { booking_id, sender_email, sender_name, sender_role, message } = await req.json();
  try {
    const result = await sql`INSERT INTO messages (booking_id, sender_email, sender_name, sender_role, message) VALUES (${booking_id}, ${sender_email}, ${sender_name}, ${sender_role}, ${message}) RETURNING *`;
    return NextResponse.json({ success: true, message: result[0] });
  } catch (error) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
export async function PATCH(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { booking_id, reader_email } = await req.json();
  try {
    await sql`UPDATE messages SET is_read = true WHERE booking_id = ${booking_id} AND sender_email != ${reader_email}`;
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
