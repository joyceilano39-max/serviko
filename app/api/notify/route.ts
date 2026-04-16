import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { type, customerEmail, customerName, artistEmail, artistName, service, date, time, address, total, bookingId } = await req.json();

  try {
    if (type === "booking_confirmed") {
      // Email to Customer
      await resend.emails.send({
        from: "Serviko <noreply@serviko.dev>",
        to: customerEmail,
        subject: "✅ Booking Confirmed! - Serviko",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #E61D72, #7C3AED); padding: 32px; text-align: center; border-radius: 16px 16px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🌸 Serviko</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Your booking is confirmed!</p>
            </div>
            <div style="background: #fff; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #f0f0f0;">
              <h2 style="color: #22c55e;">✅ Booking Confirmed!</h2>
              <p>Hi <strong>${customerName}</strong>! Your booking has been confirmed.</p>
              <div style="background: #FFF0F6; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 8px;"><strong>🎨 Artist:</strong> ${artistName}</p>
                <p style="margin: 0 0 8px;"><strong>💆 Service:</strong> ${service}</p>
                <p style="margin: 0 0 8px;"><strong>📅 Date:</strong> ${date}</p>
                <p style="margin: 0 0 8px;"><strong>🕐 Time:</strong> ${time}</p>
                <p style="margin: 0 0 8px;"><strong>📍 Address:</strong> ${address}</p>
                <p style="margin: 0;"><strong>💰 Total:</strong> ₱${total}</p>
              </div>
              <a href="https://serviko.dev/tracking" style="display: block; background: #E61D72; color: white; padding: 14px; border-radius: 12px; text-decoration: none; text-align: center; font-weight: bold; font-size: 16px;">
                📍 Track Your Booking
              </a>
              <p style="color: #888; font-size: 12px; margin-top: 20px; text-align: center;">
                Booking ID: ${bookingId} • serviko.dev
              </p>
            </div>
          </div>
        `,
      });

      // Email to Artist
      await resend.emails.send({
        from: "Serviko <noreply@serviko.dev>",
        to: artistEmail,
        subject: "🔔 New Booking! - Serviko",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #7C3AED, #4F46E5); padding: 32px; text-align: center; border-radius: 16px 16px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎨 Serviko Artist</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">You have a new booking!</p>
            </div>
            <div style="background: #fff; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #f0f0f0;">
              <h2 style="color: #7C3AED;">🔔 New Booking!</h2>
              <p>Hi <strong>${artistName}</strong>! You have a new booking request.</p>
              <div style="background: #F5F3FF; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 8px;"><strong>👤 Customer:</strong> ${customerName}</p>
                <p style="margin: 0 0 8px;"><strong>💆 Service:</strong> ${service}</p>
                <p style="margin: 0 0 8px;"><strong>📅 Date:</strong> ${date}</p>
                <p style="margin: 0 0 8px;"><strong>🕐 Time:</strong> ${time}</p>
                <p style="margin: 0 0 8px;"><strong>📍 Address:</strong> ${address}</p>
                <p style="margin: 0;"><strong>💰 Your Earnings:</strong> ₱${Math.round(total * 0.9)}</p>
              </div>
              <a href="https://serviko.dev/artist-dashboard" style="display: block; background: #7C3AED; color: white; padding: 14px; border-radius: 12px; text-decoration: none; text-align: center; font-weight: bold; font-size: 16px;">
                ✅ Accept / Decline Booking
              </a>
              <p style="color: #888; font-size: 12px; margin-top: 20px; text-align: center;">
                Booking ID: ${bookingId} • serviko.dev
              </p>
            </div>
          </div>
        `,
      });
    }

    if (type === "booking_accepted") {
      await resend.emails.send({
        from: "Serviko <noreply@serviko.dev>",
        to: customerEmail,
        subject: "🎉 Artist is on the way! - Serviko",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #22c55e, #15803d); padding: 32px; text-align: center; border-radius: 16px 16px 0 0;">
              <h1 style="color: white; margin: 0;">🌸 Serviko</h1>
            </div>
            <div style="background: #fff; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #f0f0f0;">
              <h2 style="color: #22c55e;">🎉 ${artistName} accepted your booking!</h2>
              <p>Hi <strong>${customerName}</strong>! Your artist is confirmed.</p>
              <div style="background: #F0FDF4; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 8px;"><strong>📅 Date:</strong> ${date} at ${time}</p>
                <p style="margin: 0;"><strong>📍 Address:</strong> ${address}</p>
              </div>
              <a href="https://serviko.dev/tracking" style="display: block; background: #E61D72; color: white; padding: 14px; border-radius: 12px; text-decoration: none; text-align: center; font-weight: bold;">
                📍 Track Your Artist
              </a>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}