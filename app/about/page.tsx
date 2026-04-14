"use client";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "Arial, sans-serif" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "48px 24px", color: "#fff", textAlign: "center" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px", display: "block", marginBottom: "16px" }}>← Back to Home</a>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🌸</div>
        <h1 style={{ fontSize: "36px", fontWeight: 900, margin: "0 0 12px" }}>About Serviko</h1>
        <p style={{ opacity: 0.85, fontSize: "18px", margin: "0 0 8px" }}>Para sa Pilipino 🇵🇭</p>
        <p style={{ opacity: 0.7, fontSize: "14px", margin: 0, maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
          Connecting Filipino customers with trusted beauty, wellness, and home service artists — wherever you are.
        </p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Mission */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontWeight: 900, fontSize: "28px", margin: "0 0 16px", color: "#1a1a1a" }}>Our Mission</h2>
          <p style={{ color: "#555", fontSize: "16px", lineHeight: 1.8, maxWidth: "600px", margin: "0 auto" }}>
            To empower Filipino service artists to earn on their own terms, while giving customers convenient access to trusted, verified professionals at their doorstep.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", marginBottom: "48px" }}>
          {[
            { value: "1,200+", label: "Happy Customers", icon: "😊" },
            { value: "32+", label: "Verified Artists", icon: "🎨" },
            { value: "4.9★", label: "Average Rating", icon: "⭐" },
            { value: "10+", label: "Service Categories", icon: "🛠️" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "#FFF0F6", borderRadius: "20px", padding: "24px 16px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{stat.icon}</div>
              <p style={{ fontWeight: 900, fontSize: "24px", color: "#E61D72", margin: "0 0 4px" }}>{stat.value}</p>
              <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontWeight: 900, fontSize: "24px", margin: "0 0 16px", color: "#1a1a1a" }}>Our Story</h2>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, marginBottom: "16px" }}>
            Serviko was founded in 2026 with a simple idea: <strong>make it easy for Filipinos to book trusted home services.</strong> We saw how hard it was to find reliable beauty and home service providers — and how talented artists struggled to find consistent clients.
          </p>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, marginBottom: "16px" }}>
            We built Serviko to bridge that gap. Like GrabFood for food, but for services. Like Lazada for products, but for professionals. <strong>Para sa bawat Pilipino.</strong>
          </p>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8 }}>
            Today, Serviko serves customers across Metro Manila, connecting them with verified artists for everything from haircuts and massages to house cleaning and painting — all bookable in minutes, payable via GCash or Maya.
          </p>
        </div>

        {/* Values */}
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontWeight: 900, fontSize: "24px", margin: "0 0 24px", color: "#1a1a1a" }}>Our Values</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {[
              { icon: "🛡️", title: "Safety First", desc: "All artists are ID-verified with background checks. Digital work permits for building access." },
              { icon: "💪", title: "Empower Artists", desc: "Artists keep 90% of earnings. Set your own schedule. Work on your terms." },
              { icon: "⭐", title: "Quality Service", desc: "Only verified, rated artists on our platform. Customer reviews keep standards high." },
              { icon: "🇵🇭", title: "Made for Filipinos", desc: "GCash, Maya, QR Ph payments. Filipino service categories. Designed for PH lifestyle." },
              { icon: "🔒", title: "Privacy Protected", desc: "RA 10173 compliant. Your data is encrypted and never sold to third parties." },
              { icon: "❤️", title: "Community", desc: "Building a community of trusted artists and happy customers across the Philippines." },
            ].map(val => (
              <div key={val.title} style={{ background: "#f8f8f8", borderRadius: "16px", padding: "20px" }}>
                <div style={{ fontSize: "32px", marginBottom: "10px" }}>{val.icon}</div>
                <h3 style={{ fontWeight: 700, margin: "0 0 8px", fontSize: "15px" }}>{val.title}</h3>
                <p style={{ color: "#888", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontWeight: 900, fontSize: "24px", margin: "0 0 16px", color: "#1a1a1a" }}>What We Offer</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {[
              "💇 Hair Services", "💅 Nail Services", "💆 Massage & Wellness",
              "🧖 Skin Care", "👁️ Lash & Brow", "💄 Makeup",
              "🧹 Home Cleaning", "🌿 Gardening", "🎨 Painting", "🔧 Home Repair",
            ].map(s => (
              <span key={s} style={{ background: "#FFF0F6", color: "#E61D72", padding: "8px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontWeight: 900, fontSize: "24px", margin: "0 0 24px", color: "#1a1a1a" }}>How It Works</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { step: "1", icon: "🔍", title: "Browse Services", desc: "Browse available artists and services near you. No sign in needed!" },
              { step: "2", icon: "📅", title: "Book Instantly", desc: "Choose your artist, service, date, and time. Add family members too!" },
              { step: "3", icon: "💳", title: "Pay Securely", desc: "Pay via GCash, Maya, QR Ph, or Cash on Arrival." },
              { step: "4", icon: "📍", title: "Track in Real-time", desc: "Track your artist live — just like Grab!" },
              { step: "5", icon: "🌸", title: "Enjoy & Review", desc: "Enjoy your service and leave a review to help others." },
            ].map(item => (
              <div key={item.step} style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px", background: "#f8f8f8", borderRadius: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, flexShrink: 0 }}>{item.step}</div>
                <div>
                  <p style={{ fontWeight: 700, margin: "0 0 4px" }}>{item.icon} {item.title}</p>
                  <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", borderRadius: "20px", padding: "32px", color: "#fff", textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontWeight: 900, fontSize: "24px", margin: "0 0 8px" }}>Get in Touch</h2>
          <p style={{ opacity: 0.8, margin: "0 0 20px", fontSize: "14px" }}>Questions? We'd love to hear from you!</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", fontSize: "14px" }}>
            {[
              { icon: "📧", text: "hello@serviko.dev" },
              { icon: "📱", text: "+63 XXX XXX XXXX" },
              { icon: "📘", text: "facebook.com/serviko" },
              { icon: "📍", text: "Quezon City, Philippines" },
            ].map(c => (
              <div key={c.text} style={{ background: "rgba(255,255,255,0.15)", padding: "8px 16px", borderRadius: "20px" }}>
                {c.icon} {c.text}
              </div>
            ))}
          </div>
        </div>

        {/* Legal Links */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/privacy" style={{ color: "#E61D72", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>🔒 Privacy Policy</a>
          <a href="/terms" style={{ color: "#E61D72", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>📋 Terms & Conditions</a>
          <a href="/services" style={{ color: "#E61D72", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>🛠️ Our Services</a>
          <a href="/pricing" style={{ color: "#E61D72", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>💰 Pricing</a>
        </div>
      </div>
    </div>
  );
}
