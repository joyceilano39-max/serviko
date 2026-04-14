import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { amount, description, name } = await req.json();

  const response = await fetch("https://api.paymongo.com/v1/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount: amount * 100,
          description,
          remarks: `Booking for ${name}`,
          redirect: {
            success: "https://serviko.dev/payment-success",
            failed: "https://serviko.dev/checkout",
          },
        },
      },
    }),
  });

  const data = await response.json();

  if (data.errors) {
    return NextResponse.json({ error: data.errors[0].detail }, { status: 400 });
  }

  return NextResponse.json({
    checkoutUrl: data.data.attributes.checkout_url,
    referenceNumber: data.data.attributes.reference_number,
  });
}