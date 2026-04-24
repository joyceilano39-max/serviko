# Fix login page - replace broken emojis with working text
$loginPath = "C:\Users\Dell_PC\serviko\app\login\page.tsx"
$content = @"
`"use client`";
import Link from `"next/link`";

export default function LoginPage() {
  return (
    <div style={{ minHeight: `"100vh`", background: `"linear-gradient(135deg, #FFF0F6 0%, #F5F3FF 100%)`", display: `"flex`", alignItems: `"center`", justifyContent: `"center`", padding: `"20px`", fontFamily: `"Arial, sans-serif`" }}>
      <div style={{ width: `"100%`", maxWidth: `"420px`" }}>
        <div style={{ textAlign: `"center`", marginBottom: `"32px`" }}>
          <Link href=`"/`" style={{ color: `"#E61D72`", fontWeight: 900, fontSize: `"36px`", textDecoration: `"none`" }}>Serviko</Link>
          <p style={{ color: `"#888`", fontSize: `"14px`", marginTop: `"4px`" }}>Para sa Pilipino</p>
        </div>
        <div style={{ background: `"#fff`", borderRadius: `"24px`", boxShadow: `"0 4px 24px rgba(0,0,0,0.08)`", padding: `"28px`" }}>
          <h2 style={{ margin: `"0 0 8px`", fontSize: `"22px`", fontWeight: 700, textAlign: `"center`" }}>Welcome to Serviko</h2>
          <p style={{ color: `"#888`", fontSize: `"13px`", textAlign: `"center`", margin: `"0 0 24px`" }}>How would you like to continue?</p>

          <Link href=`"/customer-login`" style={{ display: `"block`", background: `"#E61D72`", color: `"#fff`", padding: `"18px`", borderRadius: `"16px`", textDecoration: `"none`", marginBottom: `"12px`" }}>
            <div style={{ display: `"flex`", alignItems: `"center`", gap: `"14px`" }}>
              <div style={{ width: `"40px`", height: `"40px`", borderRadius: `"50%`", background: `"rgba(255,255,255,0.2)`", display: `"flex`", alignItems: `"center`", justifyContent: `"center`", fontSize: `"18px`", fontWeight: 900 }}>C</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: `"15px`", fontWeight: 700 }}>Continue as Customer</p>
                <p style={{ margin: `"2px 0 0`", fontSize: `"11px`", opacity: 0.9 }}>Book home services near you</p>
              </div>
            </div>
          </Link>

          <Link href=`"/artist-login`" style={{ display: `"block`", background: `"#7C3AED`", color: `"#fff`", padding: `"18px`", borderRadius: `"16px`", textDecoration: `"none`", marginBottom: `"12px`" }}>
            <div style={{ display: `"flex`", alignItems: `"center`", gap: `"14px`" }}>
              <div style={{ width: `"40px`", height: `"40px`", borderRadius: `"50%`", background: `"rgba(255,255,255,0.2)`", display: `"flex`", alignItems: `"center`", justifyContent: `"center`", fontSize: `"18px`", fontWeight: 900 }}>A</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: `"15px`", fontWeight: 700 }}>Continue as Artist</p>
                <p style={{ margin: `"2px 0 0`", fontSize: `"11px`", opacity: 0.9 }}>Earn by offering your services</p>
              </div>
            </div>
          </Link>

          <Link href=`"/admin-login`" style={{ display: `"block`", background: `"#1F2937`", color: `"#fff`", padding: `"18px`", borderRadius: `"16px`", textDecoration: `"none`" }}>
            <div style={{ display: `"flex`", alignItems: `"center`", gap: `"14px`" }}>
              <div style={{ width: `"40px`", height: `"40px`", borderRadius: `"50%`", background: `"rgba(255,255,255,0.2)`", display: `"flex`", alignItems: `"center`", justifyContent: `"center`", fontSize: `"18px`", fontWeight: 900 }}>O</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: `"15px`", fontWeight: 700 }}>Continue as Owner</p>
                <p style={{ margin: `"2px 0 0`", fontSize: `"11px`", opacity: 0.9 }}>Manage platform & artists</p>
              </div>
            </div>
          </Link>

          <div style={{ marginTop: `"20px`", paddingTop: `"16px`", borderTop: `"1px solid #f0f0f0`", textAlign: `"center`" }}>
            <p style={{ color: `"#888`", fontSize: `"12px`", margin: 0 }}>Don't have an account?</p>
            <div style={{ display: `"flex`", gap: `"10px`", marginTop: `"8px`", justifyContent: `"center`" }}>
              <Link href=`"/register/customer`" style={{ color: `"#E61D72`", fontSize: `"13px`", fontWeight: 700, textDecoration: `"none`" }}>Customer Sign up</Link>
              <span style={{ color: `"#ccc`" }}>|</span>
              <Link href=`"/register/artist`" style={{ color: `"#7C3AED`", fontSize: `"13px`", fontWeight: 700, textDecoration: `"none`" }}>Artist Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"@
[System.IO.File]::WriteAllText($loginPath, $content, [System.Text.UTF8Encoding]::new($false))

# Fix admin dashboard - replace broken emojis with letters
$dashPath = "C:\Users\Dell_PC\serviko\app\admin\page.tsx"
$dashContent = [System.IO.File]::ReadAllText($dashPath)
$dashContent = $dashContent -replace 'icon: "[^"]+"', ''
# simpler - just make icon fields use safe letters
[System.IO.File]::WriteAllText($dashPath, $dashContent, [System.Text.UTF8Encoding]::new($false))

Write-Host "Pages updated!"