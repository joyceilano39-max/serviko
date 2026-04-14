import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { name, email, phone, address, clerkId } = await req.json();

  try {
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO users (clerk_id, name, email, phone, role, address)
      VALUES (${clerkId}, ${name}, ${email}, ${phone}, 'customer', ${address})
      RETURNING id, name, email, role
    `;

    return NextResponse.json({ success: true, user: result[0] });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}