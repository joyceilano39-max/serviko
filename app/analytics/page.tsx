"use client";
import { useState } from "react";

const topServices = [
  { name: "Full Body Massage", bookings: 312, revenue: 249600, growth: "+18%", color: "#E61D72" },
  { name: "Haircut & Styling", bookings: 287, revenue: 143500, growth: "+12%", color: "#3b82f6" },
  { name: "Facial Treatment", bookings: 198, revenue: 128700, growth: "+9%", color: "#22c55e" },
  { name: "Manicure & Pedicure", bookings: 176, revenue: 79200, growth: "+7%", color: "#7C3AED" },
  { name: "Hair Coloring", bookings: 143, revenue: 171600, growth: "+15%", color: "#D97706" },
  { name: "Hot Stone Massage", bookings: 98, revenue: 98000, growth: "+5%", color: "#f87171" },
];

const topLaborers = [
  { name: "Maria Santos", service: "Massage", bookings: 128, rating: 4.9, revenue: 45200, superHost: true },
  { name: "Ana Reyes", service: "Hair", bookings: 95, rating: 4.8, revenue: 38100, superHost: true },
  { name: "Joy Dela Cruz", service: "Nails", bookings: 82, rating: 4.7, revenue: 29800, superHost: false },
  { name: "Liza Cruz", service: "Skin Care", bookings: 61, rating: 4.6, revenue: 22400, superHost: false },
  { name: "Rose Santos", service: "Hair", bookings: 45, rating: 4.5, revenue: 18000, superHost: false },
];

const weeklyBookings = [42, 38, 55, 61, 48, 72, 65];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const maxWeekly = Math.max(...weeklyBookings);

const peakHours = [
  { hour: "8AM", bookings: 12 },
  { hour: "9AM", bookings: 28 },
  { hour: "10AM", bookings: 45 },
  { hour: "11AM", bookings: 38 },
  { hour: "12PM", bookings: 22 },
  { hour: "1PM", bookings: 18 },
  { hour: "2PM", bookings: 42 },
  { hour: "3PM", bookings: 55 },
  { hour: "4PM", bookings: 48 },
  { hour: "5PM", bookings: 35 },
  { hour: "6PM", bookings: 20 },
];
const maxHour = Math.max(...peakHours.map(h => h.bookings));

const customerRetention = [
  { label: "New Customers", value: 45, color: "#E61D72" },
  { label: "Returning", value: 35, color: "#3b82f6" },
  { label: "Loyal (5+ bookings)", value: 20, color: "#22c55e" },
];

const cityData = [
  { city: "Quezon City", bookings: 312, pct: 35 },
  { city: "Makati", bookings: 248, pct: 28 },
  { city: "Pasig", bookings: 178, pct: 20 },
  { city: "Mandaluyong", bookings: 134, pct: 15 },
  { city: "Others", bookings: 18, pct: 2 },
];

export default function AnalyticsDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("monthly");

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA" }}>
      {/* Header */}
      <div style={{ background: "#1a1a1a", padding: "20px 32px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>📊</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 900, color: "#E61D72" }}>Serviko Analytics</h1>
            <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Business Intelligence Dashboard</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["daily", "weekly", "monthly", "yearly"].map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              style={{ padding: "6px 14px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "12px", textTransform: "capitalize",
                background: period === p ? "#E61D72" : "#333",
                color: period === p ? "#fff" : "#888" }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 32px" }}>
        <div style={{ display: "flex", gap: "0" }}>
          {[
            { key: "overview", label: "📊 Overview" },
            { key: "services", label: "✂️ Services" },
            { key: "laborers", label: "👷 Laborers" },
            { key: "customers", label: "👥 Customers" },
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

      <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <h2 style={{ fontWeight: 900, margin: "0 0 24px" }}>Business Overview</h2>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "32px" }}>
              {[
                { label: "Total Bookings", value: "1,214", change: "+8%", icon: "📅", color: "#E61D72" },
                { label: "Avg Booking Value", value: "₱712", change: "+5%", icon: "💰", color: "#22c55e" },
                { label: "Customer Satisfaction", value: "4.8⭐", change: "+0.1", icon: "😊", color: "#3b82f6" },
                { label: "Repeat Bookings", value: "55%", change: "+3%", icon: "🔄", color: "#7C3AED" },
                { label: "Avg Response Time", value: "12 min", change: "-2min", icon: "⚡", color: "#D97706" },
                { label: "Cancellation Rate", value: "8%", change: "-1%", icon: "❌", color: "#f87171" },
              ].map((kpi) => (
                <div key={kpi.label} style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderTop: `3px solid ${kpi.color}` }}>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>{kpi.icon}</div>
                  <p style={{ fontSize: "22px", fontWeight: 900, color: kpi.color, margin: "0 0 4px" }}>{kpi.value}</p>
                  <p style={{ color: "#888", fontSize: "11px", margin: "0 0 4px" }}>{kpi.label}</p>
                  <span style={{ color: kpi.change.startsWith("+") || kpi.change.startsWith("-1") || kpi.change.startsWith("-2") ? "#22c55e" : "#f87171", fontSize: "12px", fontWeight: 600 }}>{kpi.change}</span>
                </div>
              ))}
            </div>

            {/* Weekly Bookings Chart */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontWeight: 700, margin: "0 0 24px" }}>Weekly Bookings</h3>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px" }}>
                  {weekDays.map((day, i) => (
                    <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "11px", color: "#888" }}>{weeklyBookings[i]}</span>
                      <div style={{ width: "100%", background: i === 5 ? "#E61D72" : "#FFD6E7", borderRadius: "4px 4px 0 0", height: `${(weeklyBookings[i] / maxWeekly) * 100}px` }} />
                      <span style={{ fontSize: "10px", color: "#888" }}>{day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontWeight: 700, margin: "0 0 24px" }}>Peak Hours</h3>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "120px" }}>
                  {peakHours.map((h) => (
                    <div key={h.hour} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <div style={{ width: "100%", background: h.bookings === maxHour ? "#E61D72" : "#FFD6E7", borderRadius: "4px 4px 0 0", height: `${(h.bookings / maxHour) * 100}px` }} />
                      <span style={{ fontSize: "9px", color: "#888", transform: "rotate(-45deg)" }}>{h.hour}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Retention & City Data */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Customer Retention</h3>
                {customerRetention.map((item) => (
                  <div key={item.label} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{item.label}</span>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: item.color }}>{item.value}%</span>
                    </div>
                    <div style={{ background: "#f0f0f0", borderRadius: "10px", height: "10px" }}>
                      <div style={{ background: item.color, borderRadius: "10px", height: "10px", width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Bookings by City</h3>
                {cityData.map((city) => (
                  <div key={city.city} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{city.city}</span>
                      <span style={{ fontSize: "13px", color: "#888" }}>{city.bookings} bookings ({city.pct}%)</span>
                    </div>
                    <div style={{ background: "#FFE4F0", borderRadius: "10px", height: "8px" }}>
                      <div style={{ background: "#E61D72", borderRadius: "10px", height: "8px", width: `${city.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* SERVICES */}
        {activeTab === "services" && (
          <>
            <h2 style={{ fontWeight: 900, margin: "0 0 24px" }}>Service Analytics</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {topServices.map((s, i) => (
                <div key={s.name} style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "16px" }}>#{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <p style={{ fontWeight: 700, margin: 0 }}>{s.name}</p>
                      <span style={{ color: "#22c55e", fontWeight: 700, fontSize: "13px" }}>{s.growth}</span>
                    </div>
                    <div style={{ background: "#f0f0f0", borderRadius: "10px", height: "8px" }}>
                      <div style={{ background: s.color, borderRadius: "10px", height: "8px", width: `${(s.bookings / topServices[0].bookings) * 100}%` }} />
                    </div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: "120px" }}>
                    <p style={{ fontWeight: 900, color: s.color, margin: "0 0 2px" }}>₱{s.revenue.toLocaleString()}</p>
                    <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{s.bookings} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* LABORERS */}
        {activeTab === "laborers" && (
          <>
            <h2 style={{ fontWeight: 900, margin: "0 0 24px" }}>Top Performing Laborers</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {topLaborers.map((l, i) => (
                <div key={l.name} style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>#{i + 1}</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <p style={{ fontWeight: 700, margin: 0 }}>{l.name}</p>
                        {l.superHost && <span style={{ background: "#FFF9E6", color: "#D97706", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>⭐ Super Host</span>}
                      </div>
                      <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{l.service} • {l.bookings} bookings • {l.rating}⭐</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 900, color: "#E61D72", margin: "0 0 4px", fontSize: "18px" }}>₱{l.revenue.toLocaleString()}</p>
                    <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Total Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CUSTOMERS */}
        {activeTab === "customers" && (
          <>
            <h2 style={{ fontWeight: 900, margin: "0 0 24px" }}>Customer Analytics</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "Total Customers", value: "1,204", color: "#E61D72", icon: "👥" },
                { label: "New This Month", value: "245", color: "#3b82f6", icon: "🆕" },
                { label: "Active Customers", value: "892", color: "#22c55e", icon: "✅" },
                { label: "Avg Bookings/Customer", value: "3.2", color: "#7C3AED", icon: "📊" },
              ].map((stat) => (
                <div key={stat.label} style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
                  <p style={{ fontSize: "28px", fontWeight: 900, color: stat.color, margin: "0 0 4px" }}>{stat.value}</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{stat.label}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Customer Segments</h3>
              {[
                { label: "VIP (10+ bookings)", count: 124, pct: 10, color: "#E61D72" },
                { label: "Regular (5-9 bookings)", count: 362, pct: 30, color: "#3b82f6" },
                { label: "Occasional (2-4 bookings)", count: 482, pct: 40, color: "#22c55e" },
                { label: "New (1 booking)", count: 236, pct: 20, color: "#888" },
              ].map((seg) => (
                <div key={seg.label} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>{seg.label}</span>
                    <span style={{ fontSize: "13px", color: "#888" }}>{seg.count} customers ({seg.pct}%)</span>
                  </div>
                  <div style={{ background: "#f0f0f0", borderRadius: "10px", height: "10px" }}>
                    <div style={{ background: seg.color, borderRadius: "10px", height: "10px", width: `${seg.pct}%` }} />
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
