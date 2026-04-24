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

        <div style={{ background: `"#fff`", borderRadius: `"24px`", boxShadow: `"0 4px 24px rgba(0,0,0,0.08)`", padding: `"32px`" }}>
          <h2 style={{ margin: `"0 0 8px`", fontSize: `"22px`", fontWeight: 700, textAlign: `"center`" }}>Welcome to Serviko</h2>
          <p style={{ color: `"#888`", fontSize: `"13px`", textAlign: `"center`", margin: `"0 0 28px`" }}>How would you like to continue?</p>

          <Link href=`"/customer-login`" style={{ display: `"block`", background: `"#E61D72`", color: `"#fff`", padding: `"20px`", borderRadius: `"16px`", textDecoration: `"none`", marginBottom: `"14px`", boxShadow: `"0 4px 12px rgba(230, 29, 114, 0.25)`" }}>
            <div style={{ display: `"flex`", alignItems: `"center`", gap: `"16px`" }}>
              <div style={{ fontSize: `"40px`" }}>👤</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: `"16px`", fontWeight: 700 }}>Continue as Customer</p>
                <p style={{ margin: `"4px 0 0`", fontSize: `"12px`", opacity: 0.9 }}>Book home services near you</p>
              </div>
              <div style={{ fontSize: `"24px`" }}>→</div>
            </div>
          </Link>

          <Link href=`"/artist-login`" style={{ display: `"block`", background: `"#7C3AED`", color: `"#fff`", padding: `"20px`", borderRadius: `"16px`", textDecoration: `"none`", boxShadow: `"0 4px 12px rgba(124, 58, 237, 0.25)`" }}>
            <div style={{ display: `"flex`", alignItems: `"center`", gap: `"16px`" }}>
              <div style={{ fontSize: `"40px`" }}>💼</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: `"16px`", fontWeight: 700 }}>Continue as Artist</p>
                <p style={{ margin: `"4px 0 0`", fontSize: `"12px`", opacity: 0.9 }}>Earn by offering your services</p>
              </div>
              <div style={{ fontSize: `"24px`" }}>→</div>
            </div>
          </Link>

          <div style={{ marginTop: `"28px`", paddingTop: `"20px`", borderTop: `"1px solid #f0f0f0`", textAlign: `"center`" }}>
            <p style={{ color: `"#888`", fontSize: `"13px`", margin: 0 }}>Don't have an account yet?</p>
            <div style={{ display: `"flex`", gap: `"12px`", marginTop: `"12px`", justifyContent: `"center`" }}>
              <Link href=`"/register/customer`" style={{ color: `"#E61D72`", fontSize: `"14px`", fontWeight: 700, textDecoration: `"none`" }}>Sign up as Customer</Link>
              <span style={{ color: `"#ccc`" }}>|</span>
              <Link href=`"/register/artist`" style={{ color: `"#7C3AED`", fontSize: `"14px`", fontWeight: 700, textDecoration: `"none`" }}>Sign up as Artist</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"@

[System.IO.File]::WriteAllText($loginPage, $newLogin, [System.Text.UTF8Encoding]::new($false))
Write-Host "Login page created!"