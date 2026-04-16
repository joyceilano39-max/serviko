import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const artists = await sql`
      SELECT 
        a.id,
        u.name,
        u.email,
        u.phone,
        a.bio,
        a.experience,
        a.services,
        a.gcash_number,
        a.location,
        a.is_available,
        a.rating,
        a.total_reviews,
        a.created_at
      FROM artists a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.rating DESC
    `;
    return NextResponse.json({ artists });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 });
  }
}