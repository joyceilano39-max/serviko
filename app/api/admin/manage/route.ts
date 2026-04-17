import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { action, artistId, customerId, value, services } = await req.json();
  try {
    if (action === "toggle_availability") {
      await sql`UPDATE artists SET is_available = ${value} WHERE id = ${artistId}`;
      return NextResponse.json({ success: true });
    }
    if (action === "update_services") {
      await sql`UPDATE artists SET services = ${services} WHERE id = ${artistId}`;
      return NextResponse.json({ success: true });
    }
    if (action === "ban_customer") {
      await sql`UPDATE users SET role = 'banned' WHERE id = ${customerId}`;
      return NextResponse.json({ success: true });
    }
    if (action === "remove_artist") {
      try {
        await sql`DELETE FROM artist_services WHERE artist_id = ${artistId}`;
      } catch {}
      await sql`UPDATE artists SET verification_status = 'removed', is_available = false WHERE id = ${artistId}`;
      await sql`UPDATE users SET role = 'removed' WHERE id IN (SELECT user_id FROM artists WHERE id = ${artistId})`;
      return NextResponse.json({ success: true });
    }
    if (action === "unban_customer") {
      await sql`UPDATE users SET role = 'customer' WHERE id = ${customerId}`;
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
