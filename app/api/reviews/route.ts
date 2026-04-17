import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        customer VARCHAR(255),
        artist VARCHAR(255),
        service VARCHAR(255),
        rating INTEGER DEFAULT 5,
        comment TEXT,
        photo TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    const reviews = await sql`
      SELECT * FROM reviews ORDER BY created_at DESC LIMIT 50
    `;
    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { customer, artist, service, rating, comment, photo } = await req.json();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        customer VARCHAR(255),
        artist VARCHAR(255),
        service VARCHAR(255),
        rating INTEGER DEFAULT 5,
        comment TEXT,
        photo TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    const result = await sql`
      INSERT INTO reviews (customer, artist, service, rating, comment, photo)
      VALUES (${customer}, ${artist}, ${service}, ${rating}, ${comment}, ${photo || null})
      RETURNING *
    `;

    // Update artist rating
    await sql`
      UPDATE artists SET
        rating = (
          SELECT AVG(rating)::NUMERIC(3,2)
          FROM reviews
          WHERE artist = ${artist}
        ),
        total_reviews = (
          SELECT COUNT(*) FROM reviews WHERE artist = ${artist}
        )
      WHERE id IN (
        SELECT a.id FROM artists a
        JOIN users u ON a.user_id = u.id
        WHERE u.name = ${artist}
      )
    `;

    return NextResponse.json({ success: true, review: result[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}
