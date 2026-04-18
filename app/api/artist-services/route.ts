import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const artistId = req.nextUrl.searchParams.get("artistId");
  try {
    const services = await sql`SELECT * FROM artist_services WHERE artist_id = ${artistId} ORDER BY price ASC`;
    return NextResponse.json({ services });
  } catch {
    return NextResponse.json({ services: [] });
  }
}

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const { artistId, serviceName, price, duration, description } = await req.json();
    await sql`INSERT INTO artist_services (artist_id, service_name, price, duration, description) VALUES (${artistId}, ${serviceName}, ${price}, ${duration}, ${description})`;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const { id } = await req.json();
    await sql`DELETE FROM artist_services WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
