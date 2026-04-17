import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const type = req.nextUrl.searchParams.get("type");
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS featured_artists (
        id SERIAL PRIMARY KEY,
        artist_id INTEGER,
        plan VARCHAR(50) DEFAULT 'featured',
        amount INTEGER,
        start_date TIMESTAMP DEFAULT NOW(),
        end_date TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS banner_ads (
        id SERIAL PRIMARY KEY,
        business_name VARCHAR(255),
        image_url TEXT,
        link_url TEXT,
        position VARCHAR(50) DEFAULT 'homepage',
        amount INTEGER,
        start_date TIMESTAMP DEFAULT NOW(),
        end_date TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS artist_subscriptions (
        id SERIAL PRIMARY KEY,
        artist_id INTEGER UNIQUE,
        plan VARCHAR(50) DEFAULT 'free',
        amount INTEGER DEFAULT 0,
        start_date TIMESTAMP DEFAULT NOW(),
        end_date TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    if (type === "featured") {
      const featured = await sql`
        SELECT fa.*, u.name as artist_name, a.profile_photo
        FROM featured_artists fa
        JOIN artists a ON fa.artist_id = a.id
        JOIN users u ON a.user_id = u.id
        WHERE fa.is_active = true AND fa.end_date > NOW()
        ORDER BY fa.created_at DESC
      `;
      return NextResponse.json({ featured });
    }

    if (type === "banners") {
      const banners = await sql`
        SELECT * FROM banner_ads
        WHERE is_active = true AND end_date > NOW()
        ORDER BY created_at DESC
      `;
      return NextResponse.json({ banners });
    }

    if (type === "subscription") {
      const artistId = req.nextUrl.searchParams.get("artistId");
      const sub = await sql`
        SELECT * FROM artist_subscriptions
        WHERE artist_id = ${artistId} AND is_active = true
        LIMIT 1
      `;
      return NextResponse.json({ subscription: sub[0] || { plan: "free" } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { type, artist_id, plan, amount, business_name, image_url, link_url, months } = await req.json();

  try {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (months || 1));

    if (type === "featured") {
      await sql`
        INSERT INTO featured_artists (artist_id, plan, amount, end_date)
        VALUES (${artist_id}, ${plan}, ${amount}, ${endDate.toISOString()})
      `;
      return NextResponse.json({ success: true });
    }

    if (type === "banner") {
      await sql`
        INSERT INTO banner_ads (business_name, image_url, link_url, amount, end_date)
        VALUES (${business_name}, ${image_url}, ${link_url}, ${amount}, ${endDate.toISOString()})
      `;
      return NextResponse.json({ success: true });
    }

    if (type === "subscription") {
      await sql`
        INSERT INTO artist_subscriptions (artist_id, plan, amount, end_date)
        VALUES (${artist_id}, ${plan}, ${amount}, ${endDate.toISOString()})
        ON CONFLICT (artist_id) DO UPDATE SET
          plan = ${plan}, amount = ${amount},
          end_date = ${endDate.toISOString()}, is_active = true
      `;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
