import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { amount, description, name, email } = await req.json();

  const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          billing: {
            name: name || "Customer",
            email: email || "customer@serviko.dev",
          },
          line_items: [
            {
              amount: amount * 100,
              currency: "PHP",
              description: description,
              name: description,
              quantity: 1,
            },
          ],
          payment_method_types: ["gcash", "card", "paymaya", "qrph"],
          success_url: "https://serviko.dev/payment-success",
          cancel_url: "https://serviko.dev/checkout",
          description: description,
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
    referenceNumber: data.data.id,
  });
}