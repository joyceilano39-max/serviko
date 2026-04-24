$apiBase = "C:\Users\Dell_PC\serviko\app\api\admin"

# Finance API - detailed breakdown
$financeDir = "$apiBase\finance"
if (!(Test-Path $financeDir)) { New-Item -ItemType Directory -Path $financeDir -Force | Out-Null }
$financeContent = @"
import { neon } from `"@neondatabase/serverless`";
import { NextResponse } from `"next/server`";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const revenue = await sql``SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE status = 'completed'``;
    const monthly = await sql``SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE status = 'completed' AND created_at >= date_trunc('month', CURRENT_DATE)``;
    const lastMonth = await sql``SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE status = 'completed' AND created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') AND created_at < date_trunc('month', CURRENT_DATE)``;
    const yearly = await sql``SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE status = 'completed' AND created_at >= date_trunc('year', CURRENT_DATE)``;

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
"@
[System.IO.File]::WriteAllText("$financeDir\route.ts", $financeContent, [System.Text.UTF8Encoding]::new($false))

# Vouchers API
$vouchersDir = "$apiBase\vouchers"
if (!(Test-Path $vouchersDir)) { New-Item -ItemType Directory -Path $vouchersDir -Force | Out-Null }
$vouchersContent = @"
import { neon } from `"@neondatabase/serverless`";
import { NextRequest, NextResponse } from `"next/server`";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    await sql``CREATE TABLE IF NOT EXISTS vouchers (id SERIAL PRIMARY KEY, code VARCHAR(50) UNIQUE, discount INT, discount_type VARCHAR(10), min_order INT, valid_until DATE, usage_count INT DEFAULT 0, active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW())``;
    const vouchers = await sql``SELECT * FROM vouchers ORDER BY created_at DESC``;
    return NextResponse.json({ vouchers });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, vouchers: [] });
  }
}

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const body = await req.json();
  try {
    await sql``INSERT INTO vouchers (code, discount, discount_type, min_order, valid_until, active) VALUES (`${body.code}, `${body.discount}, `${body.discount_type}, `${body.min_order}, `${body.valid_until}, true)``;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const id = req.nextUrl.searchParams.get(`"id`");
  try {
    await sql``DELETE FROM vouchers WHERE id = `${id}``;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
"@
[System.IO.File]::WriteAllText("$vouchersDir\route.ts", $vouchersContent, [System.Text.UTF8Encoding]::new($false))

# Expenses API
$expensesDir = "$apiBase\expenses"
if (!(Test-Path $expensesDir)) { New-Item -ItemType Directory -Path $expensesDir -Force | Out-Null }
$expensesContent = @"
import { neon } from `"@neondatabase/serverless`";
import { NextRequest, NextResponse } from `"next/server`";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    await sql``CREATE TABLE IF NOT EXISTS expenses (id SERIAL PRIMARY KEY, category VARCHAR(50), description TEXT, amount DECIMAL(10,2), expense_date DATE, created_at TIMESTAMP DEFAULT NOW())``;
    const expenses = await sql``SELECT * FROM expenses ORDER BY expense_date DESC``;
    const total = await sql``SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE expense_date >= date_trunc('month', CURRENT_DATE)``;
    return NextResponse.json({ expenses, monthlyTotal: parseFloat(total[0].total) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, expenses: [] });
  }
}

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const body = await req.json();
  try {
    await sql``INSERT INTO expenses (category, description, amount, expense_date) VALUES (`${body.category}, `${body.description}, `${body.amount}, `${body.expense_date})``;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const id = req.nextUrl.searchParams.get(`"id`");
  try {
    await sql``DELETE FROM expenses WHERE id = `${id}``;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
"@
[System.IO.File]::WriteAllText("$expensesDir\route.ts", $expensesContent, [System.Text.UTF8Encoding]::new($false))

Write-Host "Finance, vouchers, expenses APIs created!"