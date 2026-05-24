import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const { bookingId, status } = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    
    // Validate status
    const validStatuses = ["pending", "confirmed", "in_progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return Response.json({ success: false, error: "Invalid status" }, { status: 400 });
    }
    
    // Update booking status
    await sql`
      UPDATE bookings 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${bookingId}
    `;
    
    return Response.json({ success: true, message: "Status updated successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}