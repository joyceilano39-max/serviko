import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { name, email, phone, address, bio, experience, services, gcash, clerkId } = await req.json();

  try {
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const userResult = await sql`
      INSERT INTO users (clerk_id, name, email, phone, role, address)
      VALUES (${clerkId}, ${name}, ${email}, ${phone}, 'artist', ${address})
      RETURNING id
    `;

    const userId = userResult[0].id;

    await sql`
      INSERT INTO artists (user_id, bio, experience, services, gcash_number, location)
      VALUES (${userId}, ${bio}, ${experience}, ${services}, ${gcash}, ${address})
    `;

    return NextResponse.json({ success: true, message: "Artist registered!" });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}