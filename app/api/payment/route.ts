import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = neon(process.env.DATABASE_URL!);

    const today = new Date();
    const dateStr = today.toISOString().slice(0,10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const bookingReference = `SERV-${dateStr}-${randomNum}`;

    const booking = await sql`
      INSERT INTO bookings (
        booking_reference, artist_id, artist_name, service, price,
        date, time, location_lat, location_lng, location_address, landmark,
        contact_name, contact_phone, voucher_code, discount,
        transport_fee, total, notes, status, payment_status, customer_email
      ) VALUES (
        ${bookingReference},
        ${body.artistId},
        ${body.artistName},
        ${body.service},
        ${body.price},
        ${body.date},
        ${body.time},
        ${body.location?.lat || 0},
        ${body.location?.lng || 0},
        ${body.location?.address || body.address || ""},
        ${body.location?.landmark || ""},
        ${body.contactName},
        ${body.contactPhone},
        ${body.voucherCode || ""},
        ${body.discount || 0},
        ${body.transportFee || 0},
        ${body.total},
        ${body.notes || ""},
        'pending',
        'pending',
        ${body.contactEmail || ""}
      )
      RETURNING id, booking_reference
    `;

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
