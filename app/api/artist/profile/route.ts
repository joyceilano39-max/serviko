import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const { artistId, bio } = await req.json();
    await sql`UPDATE artists SET bio = ${bio} WHERE id = ${artistId}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
