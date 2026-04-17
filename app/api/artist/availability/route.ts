import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { email, isAvailable } = await req.json();
  try {
    await sql`
      UPDATE artists SET is_available = ${isAvailable}
      WHERE user_id IN (SELECT id FROM users WHERE email = ${email})
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update availability" }, { status: 500 });
  }
}
