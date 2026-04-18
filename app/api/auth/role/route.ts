import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const email = req.nextUrl.searchParams.get("email");
  try {
    const user = await sql`
      SELECT u.role, u.name as user_name, a.id as artist_id, a.full_name as artist_name
      FROM users u 
      LEFT JOIN artists a ON a.user_id = u.id 
      WHERE u.email = ${email} 
      LIMIT 1
    `;
    if (user.length === 0) return NextResponse.json({ role: "customer", name: null });
    const name = user[0].artist_name || user[0].user_name;
    return NextResponse.json({ role: user[0].role, name: name, artistId: user[0].artist_id });
  } catch (error) {
    return NextResponse.json({ role: "customer", name: null });
  }
}
