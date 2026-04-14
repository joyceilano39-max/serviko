"use client";
import { useState } from "react";

const bookings = [
  { id: "SRV-001", customer: "Joyce Ilano", artist: "Maria Santos", service: "Full Body Massage", date: "April 15, 2026", total: 1900, status: "pending", payment: "GCash" },
  { id: "SRV-002", customer: "Maria Reyes", artist: "Ana Reyes", service: "Haircut & Styling", date: "April 15, 2026", total: 550, status: "completed", payment: "Maya" },
  { id: "SRV-003", customer: "Ana Cruz", artist: "Joy Dela Cruz", service: "Manicure & Pedicure", date: "April 16, 2026", total: 500, status: "accepted", payment: "Credit Card" },
  { id: "SRV-004", customer: "Liza Santos", artist: "Grace Tan", service: "Facial Treatment", date: "April 17, 2026", total: 700, status: "pending", payment: "Cash" },
];

const artists = [
  { name: "Maria Santos", role: "Massage Therapist", location: "Quezon City", rating: 4.9, bookings: 128, earnings: 48200, status: "active" },
  { name: "Ana Reyes", role: "Hair Specialist", location: "Makati", rating: 4.8, bookings: 95, earnings: 32000, status: "active" },
  { name: "Joy Dela Cruz", role: "Nail Technician", location: "Pasig", rating: 4.7, bookings: 82, earnings: 28500, status: "active" },
  { name: "Grace Tan", role: "Skin Care Expert", location: "Taguig", rating: 4.8, bookings: 73, earnings: 31000, status: "pending" },
];

const customers = [
  { name: "Joyce Ilano", email: "joyce@gmail.com", bookings: 12, spent: 8400, joined: "Jan 2026", status: "active" },
  { name: "Maria Reyes", email: "maria@gmail.com", bookings: 8, spent: 5200, joined: "Feb 2026", status: "active" },
  { name: "Ana Cruz", email: "ana@gmail.com", bookings: 5, spent: 3100, joined: "Mar 2026", status: "active" },
  { name: "Liza Santos", email: "liza@gmail.com", bookings: 3, spent: 1800, joined: "Apr 2026", status: "active" },
];

type TabType = "overview" | "bookings" | "artists" | "customers" | "finance";

export default function AdminPage() {
  const [tab, setTab] = useState<TabType>("overview");

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", padding: "20px 32px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: "#E61D72", fontWeight: 900, fontSize: "20px", margin: "0 0 2px" }}>🌸 Serviko Admin</p>
          <p style={{ opacity: 0.6, fontSize: "13px", margin: 0 }}>Owner Dashboard</p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ background: "#22c55e", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>🟢 Live</span>
          <span style={{ color: "#888", fontSize: "13px" }}>Joyce Ilano • Owner</span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: "#fff", display: "flex", overflowX: "auto", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        {([
          { id: "overview", label: "🏠 Overview" },
          { id: "bookings", label: "📅 Bookings" },
          { id: "artists", label: "🎨 Artists" },
          { id: "customers", label: "👥 Customers" },
          { id: "finance", label: "💰 Finance" },
        ] as { id: TabType; label: string }[]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "14px 24px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "13px", whiteSpace: "nowrap",
              background: tab === t.id ? "#fff" : "#f8f8f8",
              color: tab === t.id ? "#E61D72" : "#888",
              borderBottom: tab === t.id ? "3px solid #E61D72" : "3px solid transparent" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "Total Bookings", value: bookings.length, icon: "📅", color: "#3b82f6", bg: "#EFF6FF" },
                { label: "Total Artists", value: artists.length, icon: "🎨", color: "#7C3AED", bg: "#F5F3FF" },
                { label: "Total Customers", value: customers.length, icon: "👥", color: "#E61D72", bg: "#FFF0F6" },
                { label: "Total Revenue", value: "₱48,200", icon: "💰", color: "#22c55e", bg: "#F0FDF4" },
                { label: "Pending Bookings", value: bookings.filter(b => b.status === "pending").length, icon: "⏳", color: "#D97706", bg: "#FFF9E6" },
                { label: "Commission (10%)", value: "₱4,820", icon: "🏦", color: "#E61D72", bg: "#FFF0F6" },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, borderRadius: "16px", padding: "20px" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
                  <p style={{ fontWeight: 900, fontSize: "22px", color: stat.color, margin: "0 0 4px" }}>{stat.value}</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Recent Bookings</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                    {["ID", "Customer", "Artist", "Service", "Date", "Total", "Status"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: "12px", color: "#888", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} style={{ borderBottom: "1px solid #f8f8f8" }}>
                      <td style={{ padding: "12px", fontSize: "13px", color: "#888" }}>{b.id}</td>
                      <td style={{ padding: "12px", fontSize: "13px", fontWeight: 600 }}>{b.customer}</td>
                      <td style={{ padding: "12px", fontSize: "13px" }}>{b.artist}</td>
                      <td style={{ padding: "12px", fontSize: "13px" }}>{b.service}</td>
                      <td style={{ padding: "12px", fontSize: "13px", color: "#888" }}>{b.date}</td>
                      <td style={{ padding: "12px", fontSize: "13px", fontWeight: 700, color: "#E61D72" }}>₱{b.total}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ background: b.status === "completed" ? "#F0FDF4" : b.status === "accepted" ? "#EFF6FF" : "#FFF9E6",
                          color: b.status === "completed" ? "#22c55e" : b.status === "accepted" ? "#3b82f6" : "#D97706",
                          padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {tab === "bookings" && (
          <div>
            <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>All Bookings</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {bookings.map(b => (
                <div key={b.id} style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontWeight: 700 }}>{b.customer}</span>
                      <span style={{ color: "#888", fontSize: "12px" }}>→ {b.artist}</span>
                      <span style={{ color: "#888", fontSize: "12px" }}>• {b.id}</span>
                    </div>
                    <p style={{ color: "#888", fontSize: "13px", margin: "0 0 4px" }}>{b.service} • {b.date}</p>
                    <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>💳 {b.payment}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 900, color: "#E61D72", fontSize: "18px", margin: "0 0 6px" }}>₱{b.total}</p>
                    <span style={{ background: b.status === "completed" ? "#F0FDF4" : b.status === "accepted" ? "#EFF6FF" : "#FFF9E6",
                      color: b.status === "completed" ? "#22c55e" : b.status === "accepted" ? "#3b82f6" : "#D97706",
                      padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ARTISTS */}
        {tab === "artists" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontWeight: 900, margin: 0 }}>All Artists</h2>
              <a href="/register/artist" style={{ background: "#7C3AED", color: "#fff", padding: "10px 20px", borderRadius: "20px", textDecoration: "none", fontWeight: 600, fontSize: "13px" }}>+ Add Artist</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {artists.map(a => (
                <div key={a.name} style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🎨</div>
                    <div>
                      <p style={{ fontWeight: 700, margin: "0 0 2px" }}>{a.name}</p>
                      <p style={{ color: "#888", fontSize: "13px", margin: "0 0 2px" }}>{a.role} • {a.location}</p>
                      <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#888" }}>
                        <span>★ {a.rating}</span>
                        <span>📅 {a.bookings} bookings</span>
                        <span>💰 ₱{a.earnings.toLocaleString()} earned</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ background: a.status === "active" ? "#F0FDF4" : "#FFF9E6", color: a.status === "active" ? "#22c55e" : "#D97706", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                      {a.status === "active" ? "✅ Active" : "⏳ Pending"}
                    </span>
                    {a.status === "pending" && (
                      <button style={{ background: "#7C3AED", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>Approve</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOMERS */}
        {tab === "customers" && (
          <div>
            <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>All Customers</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {customers.map(c => (
                <div key={c.name} style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#E61D72", fontSize: "18px" }}>{c.name[0]}</div>
                    <div>
                      <p style={{ fontWeight: 700, margin: "0 0 2px" }}>{c.name}</p>
                      <p style={{ color: "#888", fontSize: "13px", margin: "0 0 2px" }}>{c.email}</p>
                      <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#888" }}>
                        <span>📅 {c.bookings} bookings</span>
                        <span>💰 ₱{c.spent.toLocaleString()} spent</span>
                        <span>🗓️ Joined {c.joined}</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ background: "#F0FDF4", color: "#22c55e", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>✅ Active</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FINANCE */}
        {tab === "finance" && (
          <div>
            <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>Finance Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "Total Revenue", value: "₱48,200", color: "#22c55e", bg: "#F0FDF4", icon: "💰" },
                { label: "Serviko Commission (10%)", value: "₱4,820", color: "#E61D72", bg: "#FFF0F6", icon: "🏦" },
                { label: "Artist Payouts (90%)", value: "₱43,380", color: "#7C3AED", bg: "#F5F3FF", icon: "💸" },
                { label: "Pending Payouts", value: "₱3,600", color: "#D97706", bg: "#FFF9E6", icon: "⏳" },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, borderRadius: "16px", padding: "20px" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
                  <p style={{ fontWeight: 900, fontSize: "22px", color: stat.color, margin: "0 0 4px" }}>{stat.value}</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{stat.label}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Transaction History</h3>
              {bookings.map(b => (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f8f8f8", fontSize: "14px" }}>
                  <div>
                    <p style={{ fontWeight: 600, margin: "0 0 2px" }}>{b.customer} → {b.artist}</p>
                    <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{b.service} • {b.date} • {b.payment}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 700, color: "#22c55e", margin: "0 0 2px" }}>+₱{b.total}</p>
                    <p style={{ color: "#E61D72", fontSize: "12px", margin: 0 }}>Commission: ₱{Math.round(b.total * 0.1)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
