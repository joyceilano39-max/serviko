import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function ArtistLoginPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F5F3FF 0%, #fff 100%)", fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #4F46E5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontWeight: 900, fontSize: "24px" }}>S</div>
          <h1 style={{ fontWeight: 900, fontSize: "22px", margin: "0 0 4px", color: "#333" }}>Serviko for Artists</h1>
          <p style={{ color: "#888", margin: "0 0 8px", fontSize: "14px" }}>Earn money doing what you love</p>
          <div style={{ display: "inline-block", background: "#F5F3FF", border: "2px solid #7C3AED", borderRadius: "20px", padding: "4px 16px" }}>
            <span style={{ color: "#7C3AED", fontWeight: 700, fontSize: "13px" }}>Artist Login</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
          {[{ value: "90%", label: "You Keep" }, { value: "Free", label: "To Join" }, { value: "Daily", label: "GCash Payout" }].map(stat => (
            <div key={stat.label} style={{ background: "#fff", borderRadius: "12px", padding: "12px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p style={{ fontWeight: 900, fontSize: "18px", color: "#7C3AED", margin: "0 0 2px" }}>{stat.value}</p>
              <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>
        <SignIn fallbackRedirectUrl="/auth-redirect" />
        <div style={{ textAlign: "center", marginTop: "20px", padding: "16px", background: "#fff", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <p style={{ color: "#888", fontSize: "13px", margin: "0 0 10px" }}>New artist? Register your profile first!</p>
          <Link href="/register/artist" style={{ display: "inline-block", background: "linear-gradient(135deg, #7C3AED, #4F46E5)", color: "#fff", padding: "10px 24px", borderRadius: "20px", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>
            Register as Artist
          </Link>
        </div>
        <div style={{ textAlign: "center", marginTop: "12px" }}>
          <Link href="/" style={{ color: "#888", fontSize: "13px", textDecoration: "none" }}>Back to Home</Link>
          <span style={{ color: "#ddd", margin: "0 8px" }}>|</span>
          <Link href="/customer-login" style={{ color: "#E61D72", fontSize: "13px", textDecoration: "none", fontWeight: 600 }}>Customer Login</Link>
        </div>
      </div>
    </div>
  );
}
