import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const revenue = await sql`SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE status = 'completed'`;
    const monthly = await sql`SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE status = 'completed' AND created_at >= date_trunc('month', CURRENT_DATE)`;
    const lastMonth = await sql`SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE status = 'completed' AND created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') AND created_at < date_trunc('month', CURRENT_DATE)`;
    const yearly = await sql`SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE status = 'completed' AND created_at >= date_trunc('year', CURRENT_DATE)`;

    const gross = parseFloat(revenue[0].total);
    const commission = gross * 0.10;
    const artistPayouts = gross * 0.90;
    const vat = commission * 0.12;
    const incomeTax = commission * 0.08;
    const withholdingTax = artistPayouts * 0.02;
    const netProfit = commission - vat - incomeTax;

    return NextResponse.json({
      gross,
      monthly: parseFloat(monthly[0].total),
      lastMonth: parseFloat(lastMonth[0].total),
      yearly: parseFloat(yearly[0].total),
      commission,
      artistPayouts,
      vat,
      incomeTax,
      withholdingTax,
      netProfit,
      commissionRate: 10,
      vatRate: 12,
      incomeTaxRate: 8,
      withholdingTaxRate: 2
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}