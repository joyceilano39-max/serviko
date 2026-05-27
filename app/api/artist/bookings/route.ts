import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const artistId = searchParams.get("artistId");
    
    if (!artistId) {
      return Response.json({ success: false, error: "Artist ID required" }, { status: 400 });
    }
    
    const sql = neon(process.env.DATABASE_URL!);
    
    const bookings = await sql`
      SELECT * FROM bookings 
      WHERE artist_id = ${artistId}
      ORDER BY created_at DESC
    `;
    
    return Response.json({ 
      success: true, 
      bookings: bookings 
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function PATCH(request: Request) {
  try {
    const { bookingId, status } = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    
    const validStatuses = ["confirmed", "declined", "completed", "in_progress"];
    if (!validStatuses.includes(status)) {
      return Response.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    await sql`
      UPDATE bookings 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${bookingId}
    `;

    return Response.json({ success: true, message: "Booking updated" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

