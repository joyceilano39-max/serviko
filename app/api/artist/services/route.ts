import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const artistId = req.nextUrl.searchParams.get("artistId");
  try {
    await sql`CREATE TABLE IF NOT EXISTS artist_services (id SERIAL PRIMARY KEY, artist_id INTEGER, name VARCHAR(255), description TEXT, price INTEGER DEFAULT 0, duration VARCHAR(50), is_active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW())`;
    const services = artistId
      ? await sql`SELECT * FROM artist_services WHERE artist_id = ${artistId} AND is_active = true ORDER BY name ASC`
      : await sql`SELECT * FROM artist_services WHERE is_active = true ORDER BY name ASC`;
    return NextResponse.json({ services });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { artist_id, name, description, price, duration } = await req.json();
  try {
    const result = await sql`INSERT INTO artist_services (artist_id, name, description, price, duration) VALUES (${artist_id}, ${name}, ${description}, ${price}, ${duration}) RETURNING *`;
    return NextResponse.json({ success: true, service: result[0] });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { id, name, description, price, duration } = await req.json();
  try {
    await sql`UPDATE artist_services SET name = ${name}, description = ${description}, price = ${price}, duration = ${duration} WHERE id = ${id}`;
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
