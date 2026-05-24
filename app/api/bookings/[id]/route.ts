import { neon } from "@neondatabase/serverless";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { id } = await params;
    
    const bookings = await sql`
      SELECT * FROM bookings WHERE id = ${id}
    `;
    
    if (bookings.length === 0) {
      return Response.json({ success: false, error: "Booking not found" }, { status: 404 });
    }
    
    return Response.json({ 
      success: true, 
      booking: bookings[0] 
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}