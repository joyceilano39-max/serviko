import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function POST() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    await sql`DELETE FROM artists WHERE user_id = 19`;
    await sql`DELETE FROM users WHERE id = 19`;
    
    return NextResponse.json({ success: true, message: "Deleted Lance (19)" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}