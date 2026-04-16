import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { type, customerEmail, customerName, artistEmail, artistName, service, date, time, address, total, bookingId } = await req.json();

  try {
    if (type === "booking_confirmed") {
      await resend.emails.send({
        from: "Serviko <noreply@serviko.dev>",
        to: customerEmail,
        subject: "Booking Confirmed! - Serviko",
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#E61D72,#7C3AED);padding:32px;text-align:center;border-radius:16px 16px 0 0;">
            <h1 style="color:white;margin:0;">Serviko</h1>
          </div>
          <div style="background:#fff;padding:32px;border:1px solid #f0f0f0;border-radius:0 0 16px 16px;">
            <h2 style="color:#22c55e;">Booking Confirmed!</h2>
            <p>Hi <strong>${customerName}</strong>! Your booking is confirmed.</p>
            <div style="background:#FFF0F6;border-radius:12px;padding:20px;margin:20px 0;">
              <p><strong>Artist:</strong> ${artistName}</p>
              <p><strong>Service:</strong> ${service}</p>
              <p><strong>Date:</strong> ${date} at ${time}</p>
              <p><strong>Address:</strong> ${address}</p>
              <p><strong>Total:</strong> P${total}</p>
            </div>
            <a href="https://serviko.dev/tracking" style="display:block;background:#E61D72;color:white;padding:14px;border-radius:12px;text-decoration:none;text-align:center;font-weight:bold;">
              Track Your Booking
            </a>
          </div>
        </div>`,
      });

      await resend.emails.send({
        from: "Serviko <noreply@serviko.dev>",
        to: artistEmail,
        subject: "New Booking! - Serviko",
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#7C3AED,#4F46E5);padding:32px;text-align:center;border-radius:16px 16px 0 0;">
            <h1 style="color:white;margin:0;">Serviko Artist</h1>
          </div>
          <div style="background:#fff;padding:32px;border:1px solid #f0f0f0;border-radius:0 0 16px 16px;">
            <h2 style="color:#7C3AED;">New Booking!</h2>
            <p>Hi <strong>${artistName}</strong>! You have a new booking.</p>
            <div style="background:#F5F3FF;border-radius:12px;padding:20px;margin:20px 0;">
              <p><strong>Customer:</strong> ${customerName}</p>
              <p><strong>Service:</strong> ${service}</p>
              <p><strong>Date:</strong> ${date} at ${time}</p>
              <p><strong>Address:</strong> ${address}</p>
              <p><strong>Your Earnings:</strong> P${Math.round(total * 0.9)}</p>
            </div>
            <a href="https://serviko.dev/artist-dashboard" style="display:block;background:#7C3AED;color:white;padding:14px;border-radius:12px;text-decoration:none;text-align:center;font-weight:bold;">
              Accept / Decline Booking
            </a>
          </div>
        </div>`,
      });
    }

    if (type === "booking_accepted") {
      await resend.emails.send({
        from: "Serviko <noreply@serviko.dev>",
        to: customerEmail,
        subject: "Artist is on the way! - Serviko",
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#22c55e,#15803d);padding:32px;text-align:center;border-radius:16px 16px 0 0;">
            <h1 style="color:white;margin:0;">Serviko</h1>
          </div>
          <div style="background:#fff;padding:32px;border:1px solid #f0f0f0;border-radius:0 0 16px 16px;">
            <h2 style="color:#22c55e;">${artistName} accepted your booking!</h2>
            <p>Hi <strong>${customerName}</strong>! Your artist is on the way.</p>
            <div style="background:#F0FDF4;border-radius:12px;padding:20px;margin:20px 0;">
              <p><strong>Date:</strong> ${date} at ${time}</p>
              <p><strong>Address:</strong> ${address}</p>
            </div>
            <a href="https://serviko.dev/tracking" style="display:block;background:#E61D72;color:white;padding:14px;border-radius:12px;text-decoration:none;text-align:center;font-weight:bold;">
              Track Your Artist
            </a>
          </div>
        </div>`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
