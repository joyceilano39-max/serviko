import Anthropic from "@anthropic-ai/sdk";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { type, message, artistId, customerLocation } = await req.json();

  try {
    if (type === "recommend") {
      const artists = await sql`
        SELECT u.name, a.location, a.services, a.rating, a.id
        FROM artists a JOIN users u ON a.user_id = u.id
        WHERE a.is_available = true
        LIMIT 20
      `;
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are a helpful assistant for Serviko, a beauty and home services app in the Philippines.
          
Available artists: ${JSON.stringify(artists)}
Customer request: "${message}"
Customer location: ${customerLocation || "Metro Manila"}

Recommend the best 3 artists for this customer. Reply in JSON only:
{"recommendations": [{"id": 1, "name": "Artist Name", "reason": "Why they are perfect", "services": ["service1"]}]}`
        }]
      });
      const text = response.content[0].type === "text" ? response.content[0].text : "";
      const clean = text.replace(/```json|```/g, "").trim();
      return NextResponse.json(JSON.parse(clean));
    }

    if (type === "chat") {
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are Servi, the helpful AI assistant for Serviko - a beauty, wellness and home services booking app in the Philippines. You help customers book services, answer questions, and provide information. Be friendly, helpful and concise. Always respond in Filipino or English based on what the user uses. Key info: booking at serviko.dev, artists keep 90%, pay via GCash/Maya/Card, services include hair, nails, massage, facial, makeup, cleaning, repairs.`,
        messages: [{ role: "user", content: message }]
      });
      const text = response.content[0].type === "text" ? response.content[0].text : "";
      return NextResponse.json({ reply: text });
    }

    if (type === "price_suggest") {
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: `You are a pricing expert for beauty and home services in the Philippines.
Service: ${message}
Location: ${customerLocation || "Metro Manila"}

Suggest a competitive price range for this service. Reply in JSON only:
{"min": 150, "max": 500, "suggested": 300, "reason": "Based on Manila market rates"}`
        }]
      });
      const text = response.content[0].type === "text" ? response.content[0].text : "";
      const clean = text.replace(/```json|```/g, "").trim();
      return NextResponse.json(JSON.parse(clean));
    }

    if (type === "review_summary") {
      const reviews = await sql`
        SELECT rating, comment FROM reviews WHERE artist = ${artistId} LIMIT 20
      `;
      if (reviews.length === 0) return NextResponse.json({ summary: "No reviews yet." });
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{
          role: "user",
          content: `Summarize these customer reviews for a service artist in 2-3 sentences. Be positive and highlight key strengths.
Reviews: ${JSON.stringify(reviews)}
Reply with just the summary text, no JSON.`
        }]
      });
      const text = response.content[0].type === "text" ? response.content[0].text : "";
      return NextResponse.json({ summary: text });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
