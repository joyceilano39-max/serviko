import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    const users = await sql`SELECT id, name, email, role, clerk_id FROM users WHERE email LIKE '%lance%' OR email LIKE '%feliciano%'`;
    const artists = await sql`SELECT * FROM artists WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%lance%' OR email LIKE '%feliciano%')`;
    
    return NextResponse.json({ users, artists });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}