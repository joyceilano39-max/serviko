import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

async function geocodeAddress(address: string) {
  try {
    const encoded = encodeURIComponent(address + ", Philippines");
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`, {
      headers: { "User-Agent": "Serviko App" }
    });
    const data = await res.json();
    if (data && data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {}
  return null;
}

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const customerLat = parseFloat(req.nextUrl.searchParams.get("lat") || "0");
  const customerLng = parseFloat(req.nextUrl.searchParams.get("lng") || "0");

  try {
    const artists = await sql`
      SELECT a.id, u.name, u.email, u.phone,
        a.bio, a.experience, a.services, a.gcash_number,
        a.location, a.is_available, a.rating, a.total_reviews
      FROM artists a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.rating DESC
    `;

    if (customerLat && customerLng) {
      const artistsWithDistance = await Promise.all(
        artists.map(async (artist: any) => {
          const coords = await geocodeAddress(artist.location);
          if (coords) {
            const distance = getDistance(customerLat, customerLng, coords.lat, coords.lng);
            return {
              ...artist,
              distance_km: Math.round(distance * 10) / 10,
              distance_text: distance < 1 ? `${Math.round(distance * 1000)}m away` : `${Math.round(distance * 10) / 10} km away`,
              transport_fee: distance <= 3 ? 50 : distance <= 7 ? 100 : distance <= 15 ? 150 : 200,
            };
          }
          return { ...artist, distance_km: 999, distance_text: "Distance unknown", transport_fee: 100 };
        })
      );
      artistsWithDistance.sort((a: any, b: any) => a.distance_km - b.distance_km);
      return NextResponse.json({ artists: artistsWithDistance });
    }

    return NextResponse.json({ artists });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 });
  }
}

