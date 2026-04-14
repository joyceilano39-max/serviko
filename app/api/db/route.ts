import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      clerk_id VARCHAR(255) UNIQUE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20),
      role VARCHAR(20) NOT NULL DEFAULT 'customer',
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS artists (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      bio TEXT,
      experience VARCHAR(50),
      services TEXT[],
      gcash_number VARCHAR(20),
      location VARCHAR(255),
      is_available BOOLEAN DEFAULT true,
      rating DECIMAL(3,2) DEFAULT 5.0,
      total_reviews INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER REFERENCES users(id),
      artist_id INTEGER REFERENCES artists(id),
      members JSONB,
      date VARCHAR(50),
      time VARCHAR(20),
      address TEXT,
      distance VARCHAR(20),
      transport_fee INTEGER,
      total INTEGER,
      payment_method VARCHAR(50),
      status VARCHAR(20) DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  return NextResponse.json({ message: "Tables created!" });
}