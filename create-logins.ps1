# Update main /login page to have 3 roles
$loginPage = "C:\Users\Dell_PC\serviko\app\login\page.tsx"
$newLogin = @"
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

          <Link href=`"/customer-login`" style={{ display: `"block`", background: `"#E61D72`", color: `"#fff`", padding: `"18px`", borderRadius: `"16px`", textDecoration: `"none`", marginBottom: `"12px`", boxShadow: `"0 4px 12px rgba(230, 29, 114, 0.25)`" }}>
            <div style={{ display: `"flex`", alignItems: `"center`", gap: `"14px`" }}>
              <div style={{ fontSize: `"32px`" }}>👤</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: `"15px`", fontWeight: 700 }}>Continue as Customer</p>
                <p style={{ margin: `"2px 0 0`", fontSize: `"11px`", opacity: 0.9 }}>Book home services near you</p>
              </div>
              <div style={{ fontSize: `"20px`" }}>→</div>
            </div>
          </Link>

          <Link href=`"/artist-login`" style={{ display: `"block`", background: `"#7C3AED`", color: `"#fff`", padding: `"18px`", borderRadius: `"16px`", textDecoration: `"none`", marginBottom: `"12px`", boxShadow: `"0 4px 12px rgba(124, 58, 237, 0.25)`" }}>
            <div style={{ display: `"flex`", alignItems: `"center`", gap: `"14px`" }}>
              <div style={{ fontSize: `"32px`" }}>💼</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: `"15px`", fontWeight: 700 }}>Continue as Artist</p>
                <p style={{ margin: `"2px 0 0`", fontSize: `"11px`", opacity: 0.9 }}>Earn by offering your services</p>
              </div>
              <div style={{ fontSize: `"20px`" }}>→</div>
            </div>
          </Link>

          <Link href=`"/admin-login`" style={{ display: `"block`", background: `"#1F2937`", color: `"#fff`", padding: `"18px`", borderRadius: `"16px`", textDecoration: `"none`", boxShadow: `"0 4px 12px rgba(31, 41, 55, 0.25)`" }}>
            <div style={{ display: `"flex`", alignItems: `"center`", gap: `"14px`" }}>
              <div style={{ fontSize: `"32px`" }}>🔐</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: `"15px`", fontWeight: 700 }}>Continue as Admin</p>
                <p style={{ margin: `"2px 0 0`", fontSize: `"11px`", opacity: 0.9 }}>Manage platform & artists</p>
              </div>
              <div style={{ fontSize: `"20px`" }}>→</div>
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
[System.IO.File]::WriteAllText($loginPage, $newLogin, [System.Text.UTF8Encoding]::new($false))

# Create /customer-login
$custDir = "C:\Users\Dell_PC\serviko\app\customer-login"
if (!(Test-Path $custDir)) { New-Item -ItemType Directory -Path $custDir -Force | Out-Null }
$custLogin = @"
import { SignIn } from `"@clerk/nextjs`";
import Link from `"next/link`";

export default function CustomerLoginPage() {
  return (
    <div style={{ minHeight: `"100vh`", background: `"linear-gradient(135deg, #FFF0F6 0%, #fff 100%)`", fontFamily: `"Arial, sans-serif`", display: `"flex`", flexDirection: `"column`", alignItems: `"center`", justifyContent: `"center`", padding: `"24px`" }}>
      <div style={{ width: `"100%`", maxWidth: `"480px`" }}>
        <div style={{ textAlign: `"center`", marginBottom: `"24px`" }}>
          <div style={{ width: `"64px`", height: `"64px`", borderRadius: `"50%`", background: `"linear-gradient(135deg, #E61D72, #F472B6)`", color: `"#fff`", display: `"flex`", alignItems: `"center`", justifyContent: `"center`", margin: `"0 auto 12px`", fontWeight: 900, fontSize: `"24px`" }}>S</div>
          <h1 style={{ fontWeight: 900, fontSize: `"22px`", margin: `"0 0 4px`", color: `"#333`" }}>Welcome back</h1>
          <p style={{ color: `"#888`", margin: `"0 0 8px`", fontSize: `"14px`" }}>Book home services para sa pamilya</p>
          <div style={{ display: `"inline-block`", background: `"#FFF0F6`", border: `"2px solid #E61D72`", borderRadius: `"20px`", padding: `"4px 16px`" }}>
            <span style={{ color: `"#E61D72`", fontWeight: 700, fontSize: `"13px`" }}>Customer Login</span>
          </div>
        </div>
        <SignIn fallbackRedirectUrl=`"/auth-redirect`" />
        <div style={{ textAlign: `"center`", marginTop: `"20px`", padding: `"16px`", background: `"#fff`", borderRadius: `"16px`", boxShadow: `"0 2px 8px rgba(0,0,0,0.06)`" }}>
          <p style={{ color: `"#888`", fontSize: `"13px`", margin: `"0 0 10px`" }}>New to Serviko?</p>
          <Link href=`"/register/customer`" style={{ display: `"inline-block`", background: `"linear-gradient(135deg, #E61D72, #F472B6)`", color: `"#fff`", padding: `"10px 24px`", borderRadius: `"20px`", textDecoration: `"none`", fontWeight: 700, fontSize: `"14px`" }}>
            Sign up as Customer
          </Link>
        </div>
        <div style={{ textAlign: `"center`", marginTop: `"12px`" }}>
          <Link href=`"/`" style={{ color: `"#888`", fontSize: `"13px`", textDecoration: `"none`" }}>Back to Home</Link>
          <span style={{ color: `"#ddd`", margin: `"0 8px`" }}>|</span>
          <Link href=`"/artist-login`" style={{ color: `"#7C3AED`", fontSize: `"13px`", textDecoration: `"none`", fontWeight: 600 }}>Artist Login</Link>
        </div>
      </div>
    </div>
  );
}
"@
[System.IO.File]::WriteAllText("$custDir\page.tsx", $custLogin, [System.Text.UTF8Encoding]::new($false))

# Create /admin-login
$adminDir = "C:\Users\Dell_PC\serviko\app\admin-login"
if (!(Test-Path $adminDir)) { New-Item -ItemType Directory -Path $adminDir -Force | Out-Null }
$adminLogin = @"
import { SignIn } from `"@clerk/nextjs`";
import Link from `"next/link`";

export default function AdminLoginPage() {
  return (
    <div style={{ minHeight: `"100vh`", background: `"linear-gradient(135deg, #1F2937 0%, #374151 100%)`", fontFamily: `"Arial, sans-serif`", display: `"flex`", flexDirection: `"column`", alignItems: `"center`", justifyContent: `"center`", padding: `"24px`" }}>
      <div style={{ width: `"100%`", maxWidth: `"480px`" }}>
        <div style={{ textAlign: `"center`", marginBottom: `"24px`" }}>
          <div style={{ width: `"64px`", height: `"64px`", borderRadius: `"50%`", background: `"linear-gradient(135deg, #1F2937, #111827)`", color: `"#fff`", display: `"flex`", alignItems: `"center`", justifyContent: `"center`", margin: `"0 auto 12px`", fontWeight: 900, fontSize: `"28px`" }}>🔐</div>
          <h1 style={{ fontWeight: 900, fontSize: `"22px`", margin: `"0 0 4px`", color: `"#fff`" }}>Serviko Admin</h1>
          <p style={{ color: `"#D1D5DB`", margin: `"0 0 8px`", fontSize: `"14px`" }}>Platform management portal</p>
          <div style={{ display: `"inline-block`", background: `"rgba(255,255,255,0.1)`", border: `"2px solid #fff`", borderRadius: `"20px`", padding: `"4px 16px`" }}>
            <span style={{ color: `"#fff`", fontWeight: 700, fontSize: `"13px`" }}>Admin Login</span>
          </div>
        </div>
        <SignIn fallbackRedirectUrl=`"/admin`" />
        <div style={{ textAlign: `"center`", marginTop: `"16px`" }}>
          <Link href=`"/`" style={{ color: `"#D1D5DB`", fontSize: `"13px`", textDecoration: `"none`" }}>Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
"@
[System.IO.File]::WriteAllText("$adminDir\page.tsx", $adminLogin, [System.Text.UTF8Encoding]::new($false))

Write-Host "All 3 login pages created!"