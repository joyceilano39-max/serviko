import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { code, orderTotal } = await req.json();

  try {
    if (!code) {
      return NextResponse.json({ valid: false, message: "Please enter a voucher code" }, { status: 400 });
    }

    // Find voucher
    const voucher = await sql`
      SELECT * FROM vouchers 
      WHERE UPPER(code) = UPPER(${code})
      AND is_active = true
      LIMIT 1
    `;

    if (voucher.length === 0) {
      return NextResponse.json({ valid: false, message: "Invalid voucher code" }, { status: 404 });
    }

    const v = voucher[0];

    // Check minimum order
    if (v.min_order > 0 && orderTotal < v.min_order) {
      return NextResponse.json({ 
        valid: false, 
        message: `Minimum order of ₱${v.min_order} required` 
      }, { status: 400 });
    }

    // Calculate discount
    let discount = 0;
    if (v.discount_type === "fixed") {
      discount = v.discount_value;
    } else if (v.discount_type === "percent") {
      discount = Math.round((orderTotal * v.discount_value) / 100);
    }

    return NextResponse.json({
      valid: true,
      discount,
      voucher: {
        code: v.code,
        description: v.description,
        discount_type: v.discount_type,
        discount_value: v.discount_value,
      },
      message: `₱${discount} discount applied!`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ valid: false, message: "Error validating voucher" }, { status: 500 });
  }
}
