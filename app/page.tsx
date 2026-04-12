import Link from "next/link";

const services = [
  { emoji: "✂️", name: "Haircut & Styling", price: 500, category: "Salon" },
  { emoji: "💆", name: "Full Body Massage", price: 800, category: "Massage" },
  { emoji: "🧖", name: "Facial Treatment", price: 650, category: "Skin Care" },
  { emoji: "💅", name: "Manicure & Pedicure", price: 450, category: "Nail Care" },
  { emoji: "🎨", name: "Hair Coloring", price: 1200, category: "Salon" },
  { emoji: "🪨", name: "Hot Stone Massage", price: 1000, category: "Massage" },
];

export default function HomePage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#fff" }}>

      {/* Navbar */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid #FFD6E7", position: "sticky", top: 0, background: "#fff", zIndex: 50 }}>
        <Link href="/" style={{ color: "#E61D72", fontWeight: 900, fontSize: "22px", textDecoration: "none" }}>🌸 Serviko</Link>
        <div style={{ display: "flex", gap: "24px", fontSize: "14px" }}>
          <Link href="/services" style={{ color: "#555", textDecoration: "none" }}>Services</Link>
          <Link href="/pricing" style={{ color: "#555", textDecoration: "none" }}>Pricing</Link>
          <Link href="/laborers" style={{ color: "#555", textDecoration: "none" }}>Our Team</Link>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/sign-in" style={{ color: "#E61D72", border: "1px solid #E61D72", padding: "8px 20px", borderRadius: "20px", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>Sign In</Link>
          <Link href="/register" style={{ background: "#E61D72", color: "#fff", padding: "8px 20px", borderRadius: "20px", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>Register</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #FFF0F6 0%, #FFE4F0 100%)", padding: "80px 32px", textAlign: "center" }}>
        <div style={{ fontSize: "14px", background: "#E61D72", color: "#fff", display: "inline-block", padding: "4px 16px", borderRadius: "20px", marginBottom: "16px" }}>🌸 Para sa Pilipino</div>
        <h1 style={{ fontSize: "48px", fontWeight: 900, color: "#1a1a1a", margin: "0 0 16px", lineHeight: 1.2 }}>
          Book Beauty & Wellness<br />Services Near You
        </h1>
        <p style={{ color: "#666", fontSize: "18px", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Trusted laborers. Affordable prices. Book in minutes.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/services" style={{ background: "#E61D72", color: "#fff", padding: "14px 32px", borderRadius: "30px", textDecoration: "none", fontSize: "16px", fontWeight: 700 }}>
            Browse Services
          </Link>
          <Link href="/register" style={{ background: "#fff", color: "#E61D72", padding: "14px 32px", borderRadius: "30px", textDecoration: "none", fontSize: "16px", fontWeight: 700, border: "2px solid #E61D72" }}>
            Get Started
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "32px", justifyContent: "center", marginTop: "48px", flexWrap: "wrap" }}>
          {[["500+", "Laborers"], ["10,000+", "Bookings"], ["4.9⭐", "Rating"], ["24/7", "Support"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "24px", fontWeight: 900, color: "#E61D72", margin: 0 }}>{num}</p>
              <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div style={{ padding: "64px 32px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "32px", fontWeight: 900, textAlign: "center", marginBottom: "8px" }}>Our Services</h2>
        <p style={{ color: "#888", textAlign: "center", marginBottom: "40px" }}>No sign in required to browse!</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {services.map((s) => (
            <div key={s.name} style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid #FFE4F0" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>{s.emoji}</div>
              <span style={{ background: "#FFF0F6", color: "#E61D72", fontSize: "12px", padding: "4px 10px", borderRadius: "20px" }}>{s.category}</span>
              <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "12px 0 8px" }}>{s.name}</h3>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                <span style={{ fontWeight: 900, color: "#E61D72", fontSize: "18px" }}>₱{s.price}</span>
                <Link href="/booking" style={{ background: "#E61D72", color: "#fff", padding: "8px 20px", borderRadius: "20px", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: "#FFF0F6", padding: "64px 32px", textAlign: "center" }}>
        <h2 style={{ fontSize: "32px", fontWeight: 900, marginBottom: "40px" }}>How It Works</h2>
        <div style={{ display: "flex", gap: "32px", justifyContent: "center", flexWrap: "wrap", maxWidth: "900px", margin: "0 auto" }}>
          {[
            { step: "1", icon: "🔍", title: "Browse Services", desc: "No sign in needed to explore" },
            { step: "2", icon: "📅", title: "Book Appointment", desc: "Pick your date, time and staff" },
            { step: "3", icon: "✅", title: "Get Confirmed", desc: "Sign in to confirm your booking" },
            { step: "4", icon: "🌸", title: "Enjoy Service", desc: "Sit back and relax!" },
          ].map((item) => (
            <div key={item.step} style={{ background: "#fff", borderRadius: "20px", padding: "32px 24px", width: "180px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>{item.icon}</div>
              <h3 style={{ fontWeight: 700, margin: "0 0 8px", fontSize: "15px" }}>{item.title}</h3>
              <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#1a1a1a", color: "#fff", padding: "32px", textAlign: "center" }}>
        <p style={{ color: "#E61D72", fontWeight: 900, fontSize: "20px", margin: "0 0 8px" }}>🌸 Serviko</p>
        <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>© 2026 Serviko. Para sa Pilipino. All rights reserved.</p>
      </div>

    </div>
  );
}