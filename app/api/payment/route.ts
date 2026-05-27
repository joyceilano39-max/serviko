import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    
    // Generate booking reference (e.g., SERV-20260524-001)
    const today = new Date();
    const dateStr = today.toISOString().slice(0,10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const bookingReference = `SERV-${dateStr}-${randomNum}`;
    
    // Create booking record
    const booking = await sql`
      INSERT INTO bookings (
        booking_reference, artist_id, artist_name, service, price,
        date, time, location_lat, location_lng, location_address, landmark,
        contact_name, contact_phone, voucher_code, discount,
        transport_fee, total, notes, status, payment_status, customer_email
      ) VALUES (
        ${bookingReference}, ${body.artistId}, ${body.artistName}, ${body.service}, ${body.price},
        ${body.date}, ${body.time}, ${body.location.lat}, ${body.location.lng}, 
        ${body.location.address}, ${body.location.landmark || ''},
        ${body.contactName}, ${body.contactPhone}, ${body.voucherCode || ''}, ${body.discount || 0},
        ${body.transportFee}, ${body.total}, ${body.notes || ''}, 'pending', 'pending', \
      )
      RETURNING id, booking_reference
    `;
    
    // TODO: Create PayMongo checkout session
    // For now, return a mock checkout URL with the booking ID
    const checkoutUrl = `/payment-success?bookingId=${booking[0].id}&reference=${booking[0].booking_reference}`;
    
    return Response.json({
      success: true,
      checkout_url: checkoutUrl,
      booking_id: booking[0].id,
      booking_reference: booking[0].booking_reference
    });
  } catch (error: any) {
    console.error('Payment API Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
