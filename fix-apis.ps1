$apiBase = "C:\Users\Dell_PC\serviko\app\api\admin"

# Fix stats
$statsPath = "$apiBase\stats\route.ts"
$statsContent = @"
import { neon } from `"@neondatabase/serverless`";
import { NextResponse } from `"next/server`";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const customers = await sql``SELECT COUNT(*) as count FROM users WHERE role = 'customer'``;
    const artists = await sql``SELECT COUNT(*) as count FROM users WHERE role = 'artist'``;
    const totalBookings = await sql``SELECT COUNT(*) as count FROM bookings``;
    const completedBookings = await sql``SELECT COUNT(*) as count FROM bookings WHERE status = 'completed'``;
    const pendingBookings = await sql``SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'``;
    const totalRevenue = await sql``SELECT COALESCE(SUM(total), 0) as total FROM bookings WHERE status = 'completed'``;
    const commission = await sql``SELECT COALESCE(SUM(total * 0.10), 0) as total FROM bookings WHERE status = 'completed'``;
    const recentBookings = await sql``SELECT COUNT(*) as count FROM bookings WHERE created_at > NOW() - INTERVAL '7 days'``;
    return NextResponse.json({
      customers: parseInt(customers[0].count),
      artists: parseInt(artists[0].count),
      totalBookings: parseInt(totalBookings[0].count),
      completedBookings: parseInt(completedBookings[0].count),
      pendingBookings: parseInt(pendingBookings[0].count),
      totalRevenue: parseFloat(totalRevenue[0].total),
      commission: parseFloat(commission[0].total),
      recentBookings: parseInt(recentBookings[0].count)
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
"@
[System.IO.File]::WriteAllText($statsPath, $statsContent, [System.Text.UTF8Encoding]::new($false))

# Fix finance
$financePath = "$apiBase\finance\route.ts"
$financeContent = @"
import { neon } from `"@neondatabase/serverless`";
import { NextResponse } from `"next/server`";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const revenue = await sql``SELECT COALESCE(SUM(total), 0) as total FROM bookings WHERE status = 'completed'``;
    const monthly = await sql``SELECT COALESCE(SUM(total), 0) as total FROM bookings WHERE status = 'completed' AND created_at >= date_trunc('month', CURRENT_DATE)``;
    const lastMonth = await sql``SELECT COALESCE(SUM(total), 0) as total FROM bookings WHERE status = 'completed' AND created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') AND created_at < date_trunc('month', CURRENT_DATE)``;
    const yearly = await sql``SELECT COALESCE(SUM(total), 0) as total FROM bookings WHERE status = 'completed' AND created_at >= date_trunc('year', CURRENT_DATE)``;
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
      commission, artistPayouts, vat, incomeTax, withholdingTax, netProfit,
      commissionRate: 10, vatRate: 12, incomeTaxRate: 8, withholdingTaxRate: 2
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
"@
[System.IO.File]::WriteAllText($financePath, $financeContent, [System.Text.UTF8Encoding]::new($false))

# Fix dashboard page - replace P with peso
$dashPath = "C:\Users\Dell_PC\serviko\app\admin\page.tsx"
$dashContent = [System.IO.File]::ReadAllText($dashPath)
$peso = [char]0x20B1
$dashContent = $dashContent.Replace('`"P`" + Math.round', '`"' + $peso + '`" + Math.round')
$dashContent = $dashContent.Replace('"P" + Math.round', '"' + $peso + '" + Math.round')
[System.IO.File]::WriteAllText($dashPath, $dashContent, [System.Text.UTF8Encoding]::new($false))

Write-Host "All APIs fixed with correct column name!"