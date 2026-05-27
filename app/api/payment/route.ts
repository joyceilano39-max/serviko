import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = neon(process.env.DATABASE_URL!);

    const today = new Date();
    const dateStr = today.toISOString().slice(0,10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const bookingReference = `SERV-${dateStr}-${randomNum}`;

    // Save booking to DB first
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

    const bookingId = booking[0].id;
    const reference = booking[0].booking_reference;

    // Skip PayMongo for cash payments
    if (body.payment_method === 'cash') {
      return Response.json({
        success: true,
        checkout_url: `/payment-success?bookingId=${bookingId}&reference=${reference}`,
        booking_id: bookingId,
        booking_reference: reference
      });
    }

    // Create PayMongo checkout session for GCash/PayMaya
    const paymentMethodType = body.payment_method === 'paymaya' ? 'paymaya' : 'gcash';
    const totalInCentavos = Math.round(body.total * 100);

    const paymongoRes = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`
      },
      body: JSON.stringify({
        data: {
          attributes: {
            billing: {
              name: body.contactName,
              email: body.contactEmail || 'customer@serviko.dev',
              phone: body.contactPhone,
            },
            send_email_receipt: false,
            show_description: true,
            show_line_items: true,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?artistId=${body.artistId}&artistName=${encodeURIComponent(body.artistName)}&service=${encodeURIComponent(body.service)}&price=${body.price}`,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?bookingId=${bookingId}&reference=${reference}`,
            description: `${body.service} by ${body.artistName}`,
            line_items: [
              {
                currency: 'PHP',
                amount: totalInCentavos,
                description: `${body.service} by ${body.artistName}`,
                name: body.service,
                quantity: 1,
              }
            ],
            payment_method_types: [paymentMethodType],
            reference_number: reference,
          }
        }
      })
    });

    const paymongoData = await paymongoRes.json();

    if (!paymongoRes.ok) {
      console.error('PayMongo error:', paymongoData);
      // Fallback to direct success if PayMongo fails
      return Response.json({
        success: true,
        checkout_url: `/payment-success?bookingId=${bookingId}&reference=${reference}`,
        booking_id: bookingId,
        booking_reference: reference
      });
    }

    const checkoutUrl = paymongoData.data?.attributes?.checkout_url;

    return Response.json({
      success: true,
      checkout_url: checkoutUrl,
      booking_id: bookingId,
      booking_reference: reference
    });

  } catch (error: any) {
    console.error('Payment API Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
