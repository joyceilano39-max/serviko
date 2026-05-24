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