$apiBase = "C:\Users\Dell_PC\serviko\app\api\admin"
if (!(Test-Path $apiBase)) { New-Item -ItemType Directory -Path $apiBase -Force | Out-Null }

$statsDir = "$apiBase\stats"
if (!(Test-Path $statsDir)) { New-Item -ItemType Directory -Path $statsDir -Force | Out-Null }
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
    const totalRevenue = await sql``SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE status = 'completed'``;
    const commission = await sql``SELECT COALESCE(SUM(total_amount * 0.10), 0) as total FROM bookings WHERE status = 'completed'``;
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
[System.IO.File]::WriteAllText("$statsDir\route.ts", $statsContent, [System.Text.UTF8Encoding]::new($false))

$usersDir = "$apiBase\users"
if (!(Test-Path $usersDir)) { New-Item -ItemType Directory -Path $usersDir -Force | Out-Null }
$usersContent = @"
import { neon } from `"@neondatabase/serverless`";
import { NextRequest, NextResponse } from `"next/server`";

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const role = req.nextUrl.searchParams.get(`"role`");
  try {
    const users = role 
      ? await sql``SELECT id, name, email, phone, role, created_at FROM users WHERE role = `${role} ORDER BY created_at DESC``
      : await sql``SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC``;
    return NextResponse.json({ users });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const id = req.nextUrl.searchParams.get(`"id`");
  if (!id) return NextResponse.json({ error: `"id required`" }, { status: 400 });
  try {
    await sql``DELETE FROM users WHERE id = `${id}``;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
"@
[System.IO.File]::WriteAllText("$usersDir\route.ts", $usersContent, [System.Text.UTF8Encoding]::new($false))

$bookingsDir = "$apiBase\bookings"
if (!(Test-Path $bookingsDir)) { New-Item -ItemType Directory -Path $bookingsDir -Force | Out-Null }
$bookingsContent = @"
import { neon } from `"@neondatabase/serverless`";
import { NextResponse } from `"next/server`";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const bookings = await sql``SELECT * FROM bookings ORDER BY created_at DESC LIMIT 100``;
    return NextResponse.json({ bookings });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, bookings: [] }, { status: 200 });
  }
}
"@
[System.IO.File]::WriteAllText("$bookingsDir\route.ts", $bookingsContent, [System.Text.UTF8Encoding]::new($false))

Write-Host "All admin APIs created!"