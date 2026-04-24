import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1F2937 0%, #374151 100%)", fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #1F2937, #111827)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontWeight: 900, fontSize: "28px" }}>ðŸ”</div>
          <h1 style={{ fontWeight: 900, fontSize: "22px", margin: "0 0 4px", color: "#fff" }}>Serviko Admin</h1>
          <p style={{ color: "#D1D5DB", margin: "0 0 8px", fontSize: "14px" }}>Platform management portal</p>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", border: "2px solid #fff", borderRadius: "20px", padding: "4px 16px" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>Admin Login</span>
          </div>
        </div>
        <SignIn fallbackRedirectUrl="/admin" />
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Link href="/" style={{ color: "#D1D5DB", fontSize: "13px", textDecoration: "none" }}>Back to Home</Link>
        </div>
      </div>
    </div>
  );
}