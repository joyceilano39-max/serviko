import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No API key" }, { status: 500 });
  }

  const body = await req.json();
  const { type, customerEmail, customerName, artistEmail, artistName, service, date, time, address, total, bookingId } = body;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    if (type === "booking_confirmed") {
      await resend.emails.send({
        from: "Serviko <noreply@serviko.dev>",
        to: customerEmail,
        subject: "Booking Confirmed - Serviko",
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <h1 style="color:#E61D72">Booking Confirmed!</h1>
          <p>Hi ${customerName}! Your booking is confirmed.</p>
          <div style="background:#FFF0F6;padding:16px;border-radius:12px;margin:16px 0">
            <p><strong>Artist:</strong> ${artistName}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Date:</strong> ${date} at ${time}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Total:</strong> P${total}</p>
          </div>
          <a href="https://serviko.dev/tracking" style="background:#E61D72;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:bold">Track Booking</a>
          <p style="color:#888;font-size:12px;margin-top:20px">Booking ID: ${bookingId}</p>
        </div>`,
      });

      await resend.emails.send({
        from: "Serviko <noreply@serviko.dev>",
        to: artistEmail,
        subject: "New Booking - Serviko",
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <h1 style="color:#7C3AED">New Booking!</h1>
          <p>Hi ${artistName}! You have a new booking.</p>
          <div style="background:#F5F3FF;padding:16px;border-radius:12px;margin:16px 0">
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Date:</strong> ${date} at ${time}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Your Earnings:</strong> P${Math.round(total * 0.9)}</p>
          </div>
          <a href="https://serviko.dev/artist-dashboard" style="background:#7C3AED;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:bold">Accept Booking</a>
        </div>`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
