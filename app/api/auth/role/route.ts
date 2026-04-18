import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const email = req.nextUrl.searchParams.get("email");
  const clerkId = req.nextUrl.searchParams.get("clerkId");
  try {
    let user: any[] = [];
    if (email) {
      user = await sql`SELECT u.id, u.role, u.name, a.id as artist_id FROM users u LEFT JOIN artists a ON a.user_id = u.id WHERE u.email = ${email} LIMIT 1`;
    }
    if (user.length === 0 && clerkId) {
      user = await sql`SELECT u.id, u.role, u.name, a.id as artist_id FROM users u LEFT JOIN artists a ON a.user_id = u.id WHERE u.clerk_id = ${clerkId} LIMIT 1`;
    }
    if (user.length === 0) return NextResponse.json({ role: "customer", name: null });
    return NextResponse.json({ role: user[0].role, name: user[0].name, artistId: user[0].artist_id });
  } catch (error) {
    return NextResponse.json({ role: "customer", name: null });
  }
}
