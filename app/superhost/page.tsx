"use client";
import { useState } from "react";

const requirements = [
  { label: "Minimum Rating", required: "4.8+", current: "4.9", met: true, icon: "⭐" },
  { label: "Completed Bookings", required: "50+", current: "128", met: true, icon: "📅" },
  { label: "Response Rate", required: "90%+", current: "98%", met: true, icon: "💬" },
  { label: "Cancellation Rate", required: "Less than 5%", current: "2%", met: true, icon: "❌" },
  { label: "On-time Arrival", required: "95%+", current: "97%", met: true, icon: "⏰" },
];

const benefits = [
  { icon: "🏅", title: "Super Host Badge", desc: "Your profile shows a gold Super Host badge visible to all customers" },
  { icon: "🔝", title: "Priority Listing", desc: "Appear at the top of search results and service pages" },
  { icon: "💰", title: "Bonus Incentive", desc: "Earn ₱500 bonus every month you maintain Super Host status" },
  { icon: "📊", title: "Exclusive Dashboard", desc: "Access to advanced analytics and earnings reports" },
  { icon: "🎯", title: "Featured Profile", desc: "Get featured on the Serviko homepage and promotions" },
  { icon: "💳", title: "Faster Payouts", desc: "Receive payouts within 24 hours instead of 3-5 days" },
];

const superHosts = [
  { name: "Maria Santos", service: "Massage Therapist", rating: 4.9, bookings: 128, badge: "Gold", since: "Jan 2026" },
  { name: "Ana Reyes", service: "Hair Specialist", rating: 4.8, bookings: 95, badge: "Gold", since: "Feb 2026" },
  { name: "Joy Dela Cruz", service: "Nail Technician", rating: 4.7, bookings: 82, badge: "Silver", since: "Mar 2026" },
];

const tiers = [
  { name: "Bronze Host", min: 0, max: 49, rating: "4.5+", color: "#CD7F32", bonus: "₱100/month", perks: ["Basic badge", "Standard listing"] },
  { name: "Silver Host", min: 50, max: 99, rating: "4.7+", color: "#888", bonus: "₱300/month", perks: ["Silver badge", "Priority listing", "Faster payouts"] },
  { name: "Gold Super Host", min: 100, max: 999, rating: "4.8+", color: "#FFD700", bonus: "₱500/month", perks: ["Gold badge", "Top listing", "Featured profile", "24hr payouts", "Exclusive dashboard"] },
];

export default function SuperHostPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d1a2e 100%)", padding: "64px 32px", textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>⭐</div>
        <h1 style={{ fontSize: "40px", fontWeight: 900, margin: "0 0 16px", color: "#FFD700" }}>Super Host Program</h1>
        <p style={{ color: "#ccc", fontSize: "18px", margin: "0 0 32px" }}>Recognize and reward Serviko's best laborers</p>
        <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
          {[["32", "Super Hosts"], ["4.9⭐", "Avg Rating"], ["₱500", "Monthly Bonus"], ["24hr", "Fast Payouts"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "24px", fontWeight: 900, color: "#FFD700", margin: 0 }}>{val}</p>
              <p style={{ color: "#ccc", fontSize: "13px", margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #FFD6E7", padding: "0 32px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex" }}>
          {[
            { key: "overview", label: "Overview" },
            { key: "requirements", label: "Requirements" },
            { key: "tiers", label: "Tiers & Benefits" },
            { key: "hosts", label: "Super Hosts" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ padding: "16px 24px", border: "none", background: "transparent", cursor: "pointer", fontWeight: 600, fontSize: "14px",
                borderBottom: activeTab === tab.key ? "3px solid #E61D72" : "3px solid transparent",
                color: activeTab === tab.key ? "#E61D72" : "#888" }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px" }}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <h2 style={{ fontWeight: 900, margin: "0 0 24px" }}>My Super Host Status</h2>
            <div style={{ background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)", borderRadius: "24px", padding: "32px", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "48px" }}>🏅</span>
                  <div>
                    <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 900, color: "#1a1a1a" }}>Gold Super Host</h2>
                    <p style={{ margin: 0, color: "#333", fontSize: "14px" }}>Member since January 2026</p>
                  </div>
                </div>
                <p style={{ color: "#333", margin: 0, fontSize: "14px" }}>You are in the top 5% of all Serviko laborers!</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "36px", fontWeight: 900, color: "#1a1a1a", margin: 0 }}>₱500</p>
                <p style={{ color: "#333", fontSize: "13px", margin: 0 }}>Monthly bonus earned</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {benefits.map((b) => (
                <div key={b.title} style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>{b.icon}</div>
                  <h3 style={{ fontWeight: 700, margin: "0 0 8px", fontSize: "15px" }}>{b.title}</h3>
                  <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* REQUIREMENTS */}
        {activeTab === "requirements" && (
          <>
            <h2 style={{ fontWeight: 900, margin: "0 0 8px" }}>Super Host Requirements</h2>
            <p style={{ color: "#888", marginBottom: "24px" }}>Meet all requirements to earn and maintain Super Host status</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {requirements.map((req) => (
                <div key={req.label} style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontSize: "28px" }}>{req.icon}</span>
                    <div>
                      <p style={{ fontWeight: 600, margin: "0 0 4px" }}>{req.label}</p>
                      <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Required: {req.required}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 700, color: "#E61D72", margin: 0 }}>{req.current}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Your score</p>
                    </div>
                    <span style={{ fontSize: "24px" }}>{req.met ? "✅" : "❌"}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "#F0FDF4", borderRadius: "16px", padding: "20px", marginTop: "24px", border: "1px solid #86EFAC" }}>
              <p style={{ fontWeight: 700, color: "#22c55e", margin: "0 0 4px" }}>🎉 Congratulations! You meet all requirements!</p>
              <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>You are currently a Gold Super Host. Keep up the great work!</p>
            </div>
          </>
        )}

        {/* TIERS */}
        {activeTab === "tiers" && (
          <>
            <h2 style={{ fontWeight: 900, margin: "0 0 8px" }}>Host Tiers & Benefits</h2>
            <p style={{ color: "#888", marginBottom: "24px" }}>The more you work, the more you earn!</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              {tiers.map((tier) => (
                <div key={tier.name} style={{ background: "#fff", borderRadius: "24px", padding: "32px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", border: `2px solid ${tier.color}` }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏅</div>
                  <h2 style={{ fontSize: "20px", fontWeight: 900, color: tier.color, margin: "0 0 8px" }}>{tier.name}</h2>
                  <p style={{ color: "#888", fontSize: "13px", margin: "0 0 16px" }}>{tier.min}+ bookings • {tier.rating} rating</p>
                  <div style={{ background: "#FFF0F6", borderRadius: "12px", padding: "12px", marginBottom: "16px", textAlign: "center" }}>
                    <p style={{ fontWeight: 900, color: "#E61D72", fontSize: "20px", margin: 0 }}>{tier.bonus}</p>
                    <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Monthly Bonus</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {tier.perks.map((perk) => (
                      <div key={perk} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                        <span style={{ color: tier.color, fontWeight: 700 }}>✓</span>
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* HOSTS */}
        {activeTab === "hosts" && (
          <>
            <h2 style={{ fontWeight: 900, margin: "0 0 24px" }}>Our Super Hosts</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {superHosts.map((host, i) => (
                <div key={host.name} style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : "#CD7F32", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: "18px" }}>#{i + 1}</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <p style={{ fontWeight: 700, margin: 0 }}>{host.name}</p>
                        <span style={{ background: "#FFF9E6", color: "#D97706", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>⭐ {host.badge} Super Host</span>
                      </div>
                      <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{host.service} • Super Host since {host.since}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "24px", textAlign: "center" }}>
                    <div>
                      <p style={{ fontWeight: 900, color: "#E61D72", margin: 0 }}>{host.rating}⭐</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Rating</p>
                    </div>
                    <div>
                      <p style={{ fontWeight: 900, color: "#3b82f6", margin: 0 }}>{host.bookings}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Bookings</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
