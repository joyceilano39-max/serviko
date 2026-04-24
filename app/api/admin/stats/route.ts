import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const customers = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'customer'`;
    const artists = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'artist'`;
    const totalBookings = await sql`SELECT COUNT(*) as count FROM bookings`;
    const completedBookings = await sql`SELECT COUNT(*) as count FROM bookings WHERE status = 'completed'`;
    const pendingBookings = await sql`SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'`;
    const totalRevenue = await sql`SELECT COALESCE(SUM(total), 0) as total FROM bookings WHERE status = 'completed'`;
    const commission = await sql`SELECT COALESCE(SUM(total * 0.10), 0) as total FROM bookings WHERE status = 'completed'`;
    const recentBookings = await sql`SELECT COUNT(*) as count FROM bookings WHERE created_at > NOW() - INTERVAL '7 days'`;
    return NextResponse.json({
      customers: parseInt(customers[0].count),
      artists: parseInt(artists[0].count),
      totalBookings: parseInt(totalBookings[0].count),
      completedBookings: parseInt(completedBookings[0].count),
      pendingBookings: parseInt(pendingBookings[0].count),
      totalRevenue: parseFloat(totalRevenue[0].total),
      commission: parseFloat(commission[0].total),
      recentBookings: parseInt(recentBookings[0].count)
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}