import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function CustomerLoginPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #FFF0F6 0%, #fff 100%)", fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #E61D72, #F472B6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontWeight: 900, fontSize: "24px" }}>S</div>
          <h1 style={{ fontWeight: 900, fontSize: "22px", margin: "0 0 4px", color: "#333" }}>Welcome back</h1>
          <p style={{ color: "#888", margin: "0 0 8px", fontSize: "14px" }}>Book home services para sa pamilya</p>
          <div style={{ display: "inline-block", background: "#FFF0F6", border: "2px solid #E61D72", borderRadius: "20px", padding: "4px 16px" }}>
            <span style={{ color: "#E61D72", fontWeight: 700, fontSize: "13px" }}>Customer Login</span>
          </div>
        </div>
        <SignIn fallbackRedirectUrl="/auth-redirect" />
        <div style={{ textAlign: "center", marginTop: "20px", padding: "16px", background: "#fff", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <p style={{ color: "#888", fontSize: "13px", margin: "0 0 10px" }}>New to Serviko?</p>
          <Link href="/register/customer" style={{ display: "inline-block", background: "linear-gradient(135deg, #E61D72, #F472B6)", color: "#fff", padding: "10px 24px", borderRadius: "20px", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>
            Sign up as Customer
          </Link>
        </div>
        <div style={{ textAlign: "center", marginTop: "12px" }}>
          <Link href="/" style={{ color: "#888", fontSize: "13px", textDecoration: "none" }}>Back to Home</Link>
          <span style={{ color: "#ddd", margin: "0 8px" }}>|</span>
          <Link href="/artist-login" style={{ color: "#7C3AED", fontSize: "13px", textDecoration: "none", fontWeight: 600 }}>Artist Login</Link>
        </div>
      </div>
    </div>
  );
}