import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const artistId = req.nextUrl.searchParams.get("artistId");
  try {
    const photos = await sql`SELECT * FROM portfolio WHERE artist_id = ${artistId} ORDER BY created_at DESC`;
    return NextResponse.json({ photos });
  } catch {
    return NextResponse.json({ photos: [] });
  }
}

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const { artistId, imageUrl, caption } = await req.json();
    await sql`INSERT INTO portfolio (artist_id, image_url, caption) VALUES (${artistId}, ${imageUrl}, ${caption})`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const { id } = await req.json();
    await sql`DELETE FROM portfolio WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
