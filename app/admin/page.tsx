"use client";
import { useState } from "react";

const stats = [
  { label: "Total Revenue", value: "₱124,500", change: "+12%", icon: "💰", color: "#E61D72" },
  { label: "Total Bookings", value: "248", change: "+8%", icon: "📅", color: "#3b82f6" },
  { label: "Active Laborers", value: "32", change: "+3", icon: "👷", color: "#22c55e" },
  { label: "Customers", value: "1,204", change: "+45", icon: "👥", color: "#7C3AED" },
  { label: "Commission Earned", value: "₱12,450", change: "+12%", icon: "📊", color: "#F59E0B" },
  { label: "Pending Approvals", value: "7", change: "laborers", icon: "⏳", color: "#f87171" },
];

const bookings = [
  { id: "BK001", customer: "Joyce Ilano", laborer: "Maria Santos", service: "Full Body Massage", date: "Apr 15, 2026", amount: 800, status: "Upcoming", commission: 80 },
  { id: "BK002", customer: "Dela Cruz Family", laborer: "Ana Reyes", service: "Haircut x3", date: "Apr 14, 2026", amount: 1500, status: "Completed", commission: 150 },
  { id: "BK003", customer: "Liza Cruz", laborer: "Joy Santos", service: "Manicure x2", date: "Apr 13, 2026", amount: 900, status: "Completed", commission: 90 },
  { id: "BK004", customer: "Maria Reyes", laborer: "Ana Reyes", service: "Facial Treatment", date: "Apr 12, 2026", amount: 650, status: "Cancelled", commission: 0 },
  { id: "BK005", customer: "Santos Family", laborer: "Maria Santos", service: "Hot Stone Massage", date: "Apr 11, 2026", amount: 1000, status: "Completed", commission: 100 },
];

const laborers = [
  { name: "Maria Santos", service: "Massage", rating: 4.9, bookings: 128, status: "Active", earnings: "₱45,200", superHost: true },
  { name: "Ana Reyes", service: "Hair", rating: 4.8, bookings: 95, status: "Active", earnings: "₱38,100", superHost: true },
  { name: "Joy Dela Cruz", service: "Nails", rating: 4.7, bookings: 82, status: "Active", earnings: "₱29,800", superHost: false },
  { name: "Liza Cruz", service: "Skin Care", rating: 4.6, bookings: 61, status: "Pending", earnings: "₱0", superHost: false },
  { name: "Rose Santos", service: "Hair", rating: 0, bookings: 0, status: "Pending", earnings: "₱0", superHost: false },
];

const customers = [
  { name: "Joyce Ilano", email: "joyce@email.com", bookings: 12, spent: "₱8,400", joined: "Mar 20, 2026", status: "Active" },
  { name: "Maria Reyes", email: "maria@email.com", bookings: 8, spent: "₱5,200", joined: "Mar 22, 2026", status: "Active" },
  { name: "Liza Santos", email: "liza@email.com", bookings: 5, spent: "₱3,100", joined: "Apr 1, 2026", status: "Active" },
  { name: "Ana Cruz", email: "ana@email.com", bookings: 2, spent: "₱1,300", joined: "Apr 5, 2026", status: "Inactive" },
];

const statusColor: Record<string, { bg: string; color: string }> = {
  Upcoming: { bg: "#EFF6FF", color: "#3b82f6" },
  Completed: { bg: "#F0FDF4", color: "#22c55e" },
  Cancelled: { bg: "#FEF2F2", color: "#f87171" },
  Active: { bg: "#F0FDF4", color: "#22c55e" },
  Pending: { bg: "#FFF9E6", color: "#D97706" },
  Inactive: { bg: "#F3F4F6", color: "#888" },
};

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [laborerFilter, setLaborerFilter] = useState("all");

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA" }}>

      {/* Header */}
      <div style={{ background: "#1a1a1a", padding: "20px 32px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>🌸</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 900, color: "#E61D72" }}>Serviko Admin</h1>
            <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Management Dashboard</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ background: "#f87171", color: "#fff", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>7</span>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#E61D72", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>A</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 32px" }}>
        <div style={{ display: "flex", gap: "0", overflowX: "auto" }}>
          {[
            { key: "overview", label: "📊 Overview" },
            { key: "bookings", label: "📅 Bookings" },
            { key: "laborers", label: "👷 Laborers" },
            { key: "customers", label: "👥 Customers" },
            { key: "finance", label: "💰 Finance" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveSection(tab.key)}
              style={{ padding: "16px 24px", border: "none", background: "transparent", cursor: "pointer", fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap",
                borderBottom: activeSection === tab.key ? "3px solid #E61D72" : "3px solid transparent",
                color: activeSection === tab.key ? "#E61D72" : "#888" }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* OVERVIEW */}
        {activeSection === "overview" && (
          <>
            <h2 style={{ fontWeight: 900, margin: "0 0 24px" }}>Dashboard Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "32px" }}>
              {stats.map((stat) => (
                <div key={stat.label} style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${stat.color}` }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
                  <p style={{ fontSize: "22px", fontWeight: 900, color: stat.color, margin: "0 0 4px" }}>{stat.value}</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: "0 0 4px" }}>{stat.label}</p>
                  <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: 600 }}>{stat.change}</span>
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Recent Bookings</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                    {["ID", "Customer", "Laborer", "Service", "Date", "Amount", "Commission", "Status"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: "12px", color: "#888", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px", fontSize: "13px", fontWeight: 600, color: "#E61D72" }}>{b.id}</td>
                      <td style={{ padding: "12px", fontSize: "13px" }}>{b.customer}</td>
                      <td style={{ padding: "12px", fontSize: "13px" }}>{b.laborer}</td>
                      <td style={{ padding: "12px", fontSize: "13px" }}>{b.service}</td>
                      <td style={{ padding: "12px", fontSize: "13px", color: "#888" }}>{b.date}</td>
                      <td style={{ padding: "12px", fontSize: "13px", fontWeight: 700 }}>₱{b.amount}</td>
                      <td style={{ padding: "12px", fontSize: "13px", color: "#22c55e", fontWeight: 700 }}>₱{b.commission}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ background: statusColor[b.status].bg, color: statusColor[b.status].color, padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* BOOKINGS */}
        {activeSection === "bookings" && (
          <>
            <h2 style={{ fontWeight: 900, margin: "0 0 24px" }}>All Bookings</h2>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                    {["ID", "Customer", "Laborer", "Service", "Date", "Amount", "Commission", "Status", "Action"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: "12px", color: "#888", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px", fontSize: "13px", fontWeight: 600, color: "#E61D72" }}>{b.id}</td>
                      <td style={{ padding: "12px", fontSize: "13px" }}>{b.customer}</td>
                      <td style={{ padding: "12px", fontSize: "13px" }}>{b.laborer}</td>
                      <td style={{ padding: "12px", fontSize: "13px" }}>{b.service}</td>
                      <td style={{ padding: "12px", fontSize: "13px", color: "#888" }}>{b.date}</td>
                      <td style={{ padding: "12px", fontSize: "13px", fontWeight: 700 }}>₱{b.amount}</td>
                      <td style={{ padding: "12px", fontSize: "13px", color: "#22c55e", fontWeight: 700 }}>₱{b.commission}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ background: statusColor[b.status].bg, color: statusColor[b.status].color, padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>{b.status}</span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <button style={{ background: "#FFF0F6", color: "#E61D72", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* LABORERS */}
        {activeSection === "laborers" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontWeight: 900, margin: 0 }}>Laborers</h2>
              <div style={{ display: "flex", gap: "8px" }}>
                {["all", "active", "pending"].map((f) => (
                  <button key={f} onClick={() => setLaborerFilter(f)}
                    style={{ padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "13px", textTransform: "capitalize",
                      background: laborerFilter === f ? "#E61D72" : "#fff",
                      color: laborerFilter === f ? "#fff" : "#888" }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {laborers.filter(l => laborerFilter === "all" || l.status.toLowerCase() === laborerFilter).map((l) => (
                <div key={l.name} style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>👷</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <p style={{ fontWeight: 700, margin: 0 }}>{l.name}</p>
                        {l.superHost && <span style={{ background: "#FFF9E6", color: "#D97706", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>⭐ Super Host</span>}
                      </div>
                      <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{l.service} • {l.bookings} bookings • {l.rating > 0 ? `${l.rating}⭐` : "No rating yet"}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 700, color: "#E61D72", margin: 0 }}>{l.earnings}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Total Earnings</p>
                    </div>
                    <span style={{ background: statusColor[l.status].bg, color: statusColor[l.status].color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>{l.status}</span>
                    {l.status === "Pending" && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button style={{ background: "#22c55e", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Approve</button>
                        <button style={{ background: "#f87171", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CUSTOMERS */}
        {activeSection === "customers" && (
          <>
            <h2 style={{ fontWeight: 900, margin: "0 0 24px" }}>All Customers</h2>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                    {["Name", "Email", "Bookings", "Total Spent", "Joined", "Status"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: "12px", color: "#888", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.name} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px", fontSize: "13px", fontWeight: 600 }}>{c.name}</td>
                      <td style={{ padding: "12px", fontSize: "13px", color: "#888" }}>{c.email}</td>
                      <td style={{ padding: "12px", fontSize: "13px" }}>{c.bookings}</td>
                      <td style={{ padding: "12px", fontSize: "13px", fontWeight: 700, color: "#E61D72" }}>{c.spent}</td>
                      <td style={{ padding: "12px", fontSize: "13px", color: "#888" }}>{c.joined}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ background: statusColor[c.status].bg, color: statusColor[c.status].color, padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* FINANCE */}
        {activeSection === "finance" && (
          <>
            <h2 style={{ fontWeight: 900, margin: "0 0 24px" }}>Finance Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
              {[
                { label: "Total Revenue", value: "₱124,500", color: "#E61D72", icon: "💰" },
                { label: "Commission Collected", value: "₱12,450", color: "#22c55e", icon: "📊" },
                { label: "Incentives Paid", value: "₱3,200", color: "#f87171", icon: "🎁" },
                { label: "Net Profit", value: "₱9,250", color: "#3b82f6", icon: "📈" },
                { label: "Pending Payouts", value: "₱28,400", color: "#D97706", icon: "⏳" },
                { label: "Completed Payouts", value: "₱96,100", color: "#7C3AED", icon: "✅" },
              ].map((item) => (
                <div key={item.label} style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>{item.icon}</div>
                  <p style={{ fontSize: "28px", fontWeight: 900, color: item.color, margin: "0 0 4px" }}>{item.value}</p>
                  <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{item.label}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Commission Breakdown</h3>
              {bookings.filter(b => b.status === "Completed").map((b) => (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div>
                    <p style={{ fontWeight: 600, margin: 0 }}>{b.customer} - {b.service}</p>
                    <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{b.date} • {b.laborer}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 700, margin: 0 }}>₱{b.amount}</p>
                    <p style={{ color: "#22c55e", fontSize: "13px", fontWeight: 600, margin: 0 }}>+₱{b.commission} commission</p>
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
