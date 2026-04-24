# 1. Update admin layout
$layoutPath = "C:\Users\Dell_PC\serviko\app\admin\layout.tsx"
$layoutContent = @"
`"use client`";
import { useUser, UserButton } from `"@clerk/nextjs`";
import { useEffect, useState } from `"react`";
import Link from `"next/link`";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [status, setStatus] = useState(`"loading`");

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      if (typeof window !== `"undefined`") window.location.href = `"/admin-login`";
      return;
    }
    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) { setStatus(`"denied`"); return; }
    fetch(`"/api/user-role?email=`" + encodeURIComponent(email))
      .then(r => r.json())
      .then(data => {
        if (data.role === `"admin`") setStatus(`"allowed`");
        else setStatus(`"denied`");
      })
      .catch(() => setStatus(`"denied`"));
  }, [user, isLoaded]);

  if (status === `"loading`") {
    return (<div style={{ minHeight: `"100vh`", display: `"flex`", alignItems: `"center`", justifyContent: `"center`", fontFamily: `"Arial, sans-serif`", background: `"#F9FAFB`" }}><p style={{ color: `"#888`" }}>Loading admin...</p></div>);
  }

  if (status === `"denied`") {
    return (<div style={{ minHeight: `"100vh`", display: `"flex`", flexDirection: `"column`", alignItems: `"center`", justifyContent: `"center`", fontFamily: `"Arial, sans-serif`", background: `"#FEF2F2`", gap: `"20px`", padding: `"20px`" }}><div style={{ fontSize: `"64px`" }}>🚫</div><h1 style={{ color: `"#991B1B`", margin: 0 }}>Access Denied</h1><p style={{ color: `"#7F1D1D`", textAlign: `"center`" }}>This area is restricted to administrators only.</p><Link href=`"/`" style={{ background: `"#DC2626`", color: `"#fff`", padding: `"12px 24px`", borderRadius: `"8px`", textDecoration: `"none`", fontWeight: 700 }}>Back to Home</Link></div>);
  }

  return (<div style={{ minHeight: `"100vh`", background: `"#F9FAFB`", fontFamily: `"Arial, sans-serif`" }}><nav style={{ background: `"#1F2937`", color: `"#fff`", padding: `"12px 24px`", display: `"flex`", alignItems: `"center`", justifyContent: `"space-between`", position: `"sticky`", top: 0, zIndex: 100 }}><div style={{ display: `"flex`", alignItems: `"center`", gap: `"24px`" }}><Link href=`"/admin`" style={{ color: `"#fff`", fontWeight: 900, fontSize: `"18px`", textDecoration: `"none`" }}>Serviko Admin</Link></div><div style={{ display: `"flex`", alignItems: `"center`", gap: `"12px`" }}><span style={{ fontSize: `"13px`", opacity: 0.8 }}>{user?.primaryEmailAddress?.emailAddress}</span><UserButton afterSignOutUrl=`"/`" /></div></nav>{children}</div>);
}
"@
[System.IO.File]::WriteAllText($layoutPath, $layoutContent, [System.Text.UTF8Encoding]::new($false))
Write-Host "Admin layout updated"

$apiDir = "C:\Users\Dell_PC\serviko\app\api\user-role"
if (!(Test-Path $apiDir)) { New-Item -ItemType Directory -Path $apiDir -Force | Out-Null }
$apiContent = @"
import { neon } from `"@neondatabase/serverless`";
import { NextRequest, NextResponse } from `"next/server`";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get(`"email`");
  if (!email) return NextResponse.json({ role: null });
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql``SELECT role FROM users WHERE email = `${email}``;
    return NextResponse.json({ role: result[0]?.role || null });
  } catch {
    return NextResponse.json({ role: null });
  }
}
"@
$apiPath = Join-Path $apiDir "route.ts"
[System.IO.File]::WriteAllText($apiPath, $apiContent, [System.Text.UTF8Encoding]::new($false))
Write-Host "User role API created"
Write-Host "DONE - Phase 1 complete!"