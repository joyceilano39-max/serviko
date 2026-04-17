import Link from "next/link";

const plans = [
  {
    name: "Basic",
    price: 499,
    color: "#888",
    popular: false,
    features: ["3 bookings per month", "Access to all services", "Email support", "Cash payment only"],
    cta: "Get Started",
  },
  {
    name: "Popular",
    price: 999,
    color: "#E61D72",
    popular: true,
    features: ["10 bookings per month", "Access to all services", "Priority support", "Cash & Card payment", "Book in advance", "Cancel anytime"],
    cta: "Get Popular",
  },
  {
    name: "Premium",
    price: 1999,
    color: "#7C3AED",
    popular: false,
    features: ["Unlimited bookings", "Access to all services", "24/7 VIP support", "Cash & Card payment", "Book in advance", "Cancel anytime", "Dedicated laborer", "Home service priority"],
    cta: "Go Premium",
  },
];

const services = [
  { name: "Haircut & Styling", price: 500, duration: "1 hour", category: "Salon" },
  { name: "Full Body Massage", price: 800, duration: "1.5 hours", category: "Massage" },
  { name: "Facial Treatment", price: 650, duration: "1 hour", category: "Skin Care" },
  { name: "Manicure & Pedicure", price: 450, duration: "1 hour", category: "Nail Care" },
  { name: "Hair Coloring", price: 1200, duration: "2 hours", category: "Salon" },
  { name: "Hot Stone Massage", price: 1000, duration: "1.5 hours", category: "Massage" },
];

const payments = [
  { icon: "💵", name: "Cash", desc: "Pay on service" },
  { icon: "💳", name: "Credit Card", desc: "Visa, Mastercard" },
  { icon: "📱", name: "GCash", desc: "Mobile payment" },
  { icon: "🏦", name: "Bank Transfer", desc: "Online banking" },
];

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <div style={{ background: "linear-gradient(135deg, #FFF0F6 0%, #FFE4F0 100%)", padding: "64px 32px", textAlign: "center" }}>
        <h1 style={{ fontSize: "40px", fontWeight: 900, margin: "0 0 16px" }}>Simple, Transparent Pricing</h1>
        <p style={{ color: "#666", fontSize: "18px", margin: 0 }}>Choose the plan that works best for you</p>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{ borderRadius: "24px", padding: "32px", border: `2px solid ${plan.popular ? "#E61D72" : "#FFE4F0"}`, background: plan.popular ? "#FFF0F6" : "#fff", position: "relative", boxShadow: plan.popular ? "0 8px 32px rgba(230,29,114,0.15)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
              {plan.popular && (
                <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "#E61D72", color: "#fff", padding: "4px 20px", borderRadius: "20px", fontSize: "13px", fontWeight: 700 }}>
                  Most Popular
                </div>
              )}
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: plan.color, margin: "0 0 8px" }}>{plan.name}</h2>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "24px" }}>
                <span style={{ fontSize: "40px", fontWeight: 900, color: "#1a1a1a" }}>P{plan.price}</span>
                <span style={{ color: "#888", fontSize: "14px" }}>/month</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                    <span style={{ color: "#E61D72", fontWeight: 700 }}>checkmark</span>
                    <span style={{ color: "#555" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/register" style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: "12px", textDecoration: "none", background: plan.popular ? "#E61D72" : "#fff", color: plan.popular ? "#fff" : "#E61D72", border: "2px solid #E61D72", fontWeight: 700, fontSize: "15px" }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#FFF0F6", padding: "64px 32px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 900, textAlign: "center", marginBottom: "8px" }}>Service Pricing</h2>
          <p style={{ color: "#888", textAlign: "center", marginBottom: "40px" }}>Pay per service — no subscription needed</p>
          <div style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
            {services.map((s, i) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: i < services.length - 1 ? "1px solid #FFE4F0" : "none" }}>
                <div>
                  <p style={{ fontWeight: 600, margin: "0 0 4px" }}>{s.name}</p>
                  <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{s.category} - {s.duration}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontWeight: 900, color: "#E61D72", fontSize: "18px" }}>P{s.price}</span>
                  <Link href="/booking" style={{ background: "#E61D72", color: "#fff", padding: "8px 20px", borderRadius: "20px", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>Book</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "64px 32px", textAlign: "center" }}>
        <h2 style={{ fontSize: "32px", fontWeight: 900, marginBottom: "8px" }}>Payment Methods</h2>
        <p style={{ color: "#888", marginBottom: "40px" }}>We accept multiple payment options</p>
        <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
          {payments.map((p) => (
            <div key={p.name} style={{ background: "#FFF0F6", borderRadius: "16px", padding: "24px 32px", textAlign: "center", border: "1px solid #FFD6E7" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>{p.icon}</div>
              <p style={{ fontWeight: 700, margin: "0 0 4px" }}>{p.name}</p>
              <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
