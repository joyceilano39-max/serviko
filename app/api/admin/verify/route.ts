import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { artistId, status, reason } = await req.json();

  try {
    await sql`ALTER TABLE artists ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending'`;
    await sql`ALTER TABLE artists ADD COLUMN IF NOT EXISTS rejection_reason TEXT`;

    await sql`
      UPDATE artists 
      SET verification_status = ${status},
          rejection_reason = ${reason || null},
          is_available = ${status === "approved" ? true : false}
      WHERE id = ${artistId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
