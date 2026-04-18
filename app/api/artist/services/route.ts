import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const artistId = req.nextUrl.searchParams.get("artistId");
  try {
    await sql`CREATE TABLE IF NOT EXISTS artist_services (id SERIAL PRIMARY KEY, artist_id INTEGER, name VARCHAR(255), description TEXT, price INTEGER DEFAULT 0, duration VARCHAR(50), photo_url TEXT DEFAULT '', is_active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW())`;
    try { await sql`ALTER TABLE artist_services ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT ''`; } catch {}
    const services = artistId
      ? await sql`SELECT * FROM artist_services WHERE artist_id = ${artistId} AND is_active = true ORDER BY created_at DESC`
      : await sql`SELECT * FROM artist_services WHERE is_active = true ORDER BY created_at DESC`;
    return NextResponse.json({ services });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { artist_id, name, description, price, duration, photo_url } = await req.json();
  try {
    const result = await sql`INSERT INTO artist_services (artist_id, name, description, price, duration, photo_url) VALUES (${artist_id}, ${name}, ${description || ""}, ${price}, ${duration || ""}, ${photo_url || ""}) RETURNING *`;
    return NextResponse.json({ success: true, service: result[0] });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { id, name, description, price, duration, photo_url, is_active } = await req.json();
  try {
    await sql`UPDATE artist_services SET name = COALESCE(${name}, name), description = COALESCE(${description}, description), price = COALESCE(${price}, price), duration = COALESCE(${duration}, duration), photo_url = COALESCE(${photo_url}, photo_url), is_active = COALESCE(${is_active}, is_active) WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { id } = await req.json();
  try {
    await sql`UPDATE artist_services SET is_active = false WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
