import Link from "next/link";

export default function ArtistLoginPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F5F3FF 0%, #fff 100%)", fontFamily: "Arial, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "480px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #4F46E5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontWeight: 900, fontSize: "28px" }}>S</div>
          <h1 style={{ fontWeight: 900, fontSize: "24px", margin: "0 0 8px", color: "#333" }}>Serviko for Artists</h1>
          <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Earn money doing what you love</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
          {[{ value: "90%", label: "You Keep" }, { value: "Free", label: "To Join" }, { value: "Daily", label: "GCash Payout" }].map(stat => (
            <div key={stat.label} style={{ background: "#fff", borderRadius: "14px", padding: "14px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p style={{ fontWeight: 900, fontSize: "20px", color: "#7C3AED", margin: "0 0 2px" }}>{stat.value}</p>
              <p style={{ color: "#888", fontSize: "11px", margin: 0, fontWeight: 600 }}>{stat.label}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "28px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginBottom: "16px" }}>
          <h2 style={{ fontWeight: 900, margin: "0 0 20px", fontSize: "18px", textAlign: "center" }}>Sign In or Register</h2>
          <Link href="/sign-in" style={{ display: "block", background: "linear-gradient(135deg, #7C3AED, #4F46E5)", color: "#fff", padding: "16px", borderRadius: "14px", textDecoration: "none", fontWeight: 700, fontSize: "16px", textAlign: "center", marginBottom: "12px" }}>
            Sign In to My Dashboard
          </Link>
          <Link href="/register/artist" style={{ display: "block", background: "#F5F3FF", color: "#7C3AED", padding: "16px", borderRadius: "14px", textDecoration: "none", fontWeight: 700, fontSize: "16px", textAlign: "center", marginBottom: "20px", border: "2px solid #EDE9FE" }}>
            Register as New Artist
          </Link>
          <div style={{ background: "#F5F3FF", borderRadius: "14px", padding: "16px" }}>
            <p style={{ fontWeight: 700, color: "#7C3AED", margin: "0 0 10px", fontSize: "13px" }}>Artist Benefits</p>
            {["Keep 90% of every booking", "Set your own schedule and rates", "Free profile listing on Serviko", "Daily GCash payout", "Work permit provided", "Grow your client base"].map(b => (
              <div key={b} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                <span style={{ color: "#22c55e", fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ color: "#555", fontSize: "13px" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <Link href="/" style={{ color: "#888", fontSize: "13px", textDecoration: "none" }}>Back to Home</Link>
          <span style={{ color: "#ddd", margin: "0 8px" }}>|</span>
          <Link href="/pricing" style={{ color: "#7C3AED", fontSize: "13px", textDecoration: "none", fontWeight: 600 }}>View Pricing</Link>
        </div>
      </div>
    </div>
  );
}
