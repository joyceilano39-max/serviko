"use client";
import { useState } from "react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyRevenue = [45000, 52000, 48000, 61000, 55000, 70000, 65000, 72000, 68000, 80000, 75000, 90000];
const monthlyCommission = monthlyRevenue.map(r => Math.round(r * 0.1));

const transactions = [
  { id: "TXN001", type: "Commission", from: "Joyce Ilano - Full Body Massage", amount: 80, date: "Apr 15, 2026", status: "Received" },
  { id: "TXN002", type: "Payout", to: "Maria Santos", amount: 720, date: "Apr 15, 2026", status: "Completed" },
  { id: "TXN003", type: "Commission", from: "Dela Cruz Family - Haircut x3", amount: 150, date: "Apr 14, 2026", status: "Received" },
  { id: "TXN004", type: "Payout", to: "Ana Reyes", amount: 1350, date: "Apr 14, 2026", status: "Completed" },
  { id: "TXN005", type: "Incentive", to: "Maria Santos", amount: 500, date: "Apr 13, 2026", status: "Paid" },
  { id: "TXN006", type: "Commission", from: "Liza Cruz - Manicure x2", amount: 90, date: "Apr 13, 2026", status: "Received" },
  { id: "TXN007", type: "Subscription", from: "Joyce Ilano - Popular Plan", amount: 999, date: "Apr 12, 2026", status: "Received" },
  { id: "TXN008", type: "Payout", to: "Joy Dela Cruz", amount: 810, date: "Apr 12, 2026", status: "Pending" },
];

const payouts = [
  { laborer: "Maria Santos", bookings: 128, gross: 45200, commission: 4520, incentive: 500, net: 41180, status: "Paid" },
  { laborer: "Ana Reyes", bookings: 95, gross: 38100, commission: 3810, incentive: 300, net: 34590, status: "Paid" },
  { laborer: "Joy Dela Cruz", bookings: 82, gross: 29800, commission: 2980, incentive: 100, net: 26920, status: "Pending" },
  { laborer: "Liza Cruz", bookings: 61, gross: 22400, commission: 2240, incentive: 100, net: 20260, status: "Pending" },
];

const typeColor: Record<string, { bg: string; color: string }> = {
  Commission: { bg: "#F0FDF4", color: "#22c55e" },
  Payout: { bg: "#FEF2F2", color: "#f87171" },
  Incentive: { bg: "#FFF9E6", color: "#D97706" },
  Subscription: { bg: "#EFF6FF", color: "#3b82f6" },
};

const statusColor: Record<string, { bg: string; color: string }> = {
  Received: { bg: "#F0FDF4", color: "#22c55e" },
  Completed: { bg: "#EFF6FF", color: "#3b82f6" },
  Paid: { bg: "#F0FDF4", color: "#22c55e" },
  Pending: { bg: "#FFF9E6", color: "#D97706" },
};

const totalRevenue = monthlyRevenue.reduce((a, b) => a + b, 0);
const totalCommission = monthlyCommission.reduce((a, b) => a + b, 0);
const totalPayouts = payouts.reduce((sum, p) => sum + p.net, 0);
const totalIncentives = payouts.reduce((sum, p) => sum + p.incentive, 0);
const netProfit = totalCommission - totalIncentives;
const maxRevenue = Math.max(...monthlyRevenue);

export default function FinanceDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [txnFilter, setTxnFilter] = useState("all");

  const filteredTxns = txnFilter === "all" ? transactions : transactions.filter(t => t.type.toLowerCase() === txnFilter);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA" }}>
      {/* Header */}
      <div style={{ background: "#1a1a1a", padding: "20px 32px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>💰</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 900, color: "#E61D72" }}>Serviko Finance</h1>
            <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Financial Dashboard</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <a href="/admin" style={{ background: "#E61D72", color: "#fff", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>Admin Dashboard</a>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 32px" }}>
        <div style={{ display: "flex", gap: "0" }}>
          {[
            { key: "overview", label: "📊 Overview" },
            { key: "transactions", label: "💳 Transactions" },
            { key: "payouts", label: "💸 Payouts" },
            { key: "reports", label: "📈 Reports" },
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
            <h2 style={{ fontWeight: 900, margin: "0 0 24px" }}>Financial Overview — 2026</h2>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
              {[
                { label: "Total Revenue", value: `₱${totalRevenue.toLocaleString()}`, color: "#E61D72", icon: "💰" },
                { label: "Commission Earned", value: `₱${totalCommission.toLocaleString()}`, color: "#22c55e", icon: "📊" },
                { label: "Total Payouts", value: `₱${totalPayouts.toLocaleString()}`, color: "#f87171", icon: "💸" },
                { label: "Incentives Paid", value: `₱${totalIncentives.toLocaleString()}`, color: "#D97706", icon: "🎁" },
                { label: "Net Profit", value: `₱${netProfit.toLocaleString()}`, color: "#3b82f6", icon: "📈" },
                { label: "Subscriptions", value: "₱24,960", color: "#7C3AED", icon: "🔄" },
              ].map((stat) => (
                <div key={stat.label} style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${stat.color}` }}>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>{stat.icon}</div>
                  <p style={{ fontSize: "22px", fontWeight: 900, color: stat.color, margin: "0 0 4px" }}>{stat.value}</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Bar Chart */}
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 24px" }}>Monthly Revenue</h3>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "160px" }}>
                {months.map((month, i) => (
                  <div key={month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <div style={{ width: "100%", background: i === 3 ? "#E61D72" : "#FFD6E7", borderRadius: "4px 4px 0 0", height: `${(monthlyRevenue[i] / maxRevenue) * 140}px`, transition: "height 0.3s" }} />
                    <span style={{ fontSize: "10px", color: "#888" }}>{month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Income Breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Income Sources</h3>
                {[
                  { label: "Service Commissions", amount: totalCommission, pct: 45 },
                  { label: "Subscriptions", amount: 24960, pct: 30 },
                  { label: "Featured Listings", amount: 12000, pct: 15 },
                  { label: "Other", amount: 8000, pct: 10 },
                ].map((item) => (
                  <div key={item.label} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{item.label}</span>
                      <span style={{ fontSize: "13px", color: "#E61D72", fontWeight: 700 }}>₱{item.amount.toLocaleString()}</span>
                    </div>
                    <div style={{ background: "#FFE4F0", borderRadius: "10px", height: "8px" }}>
                      <div style={{ background: "#E61D72", borderRadius: "10px", height: "8px", width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Expenses</h3>
                {[
                  { label: "Laborer Incentives", amount: totalIncentives, pct: 40 },
                  { label: "Platform Costs", amount: 8000, pct: 25 },
                  { label: "Marketing", amount: 5000, pct: 20 },
                  { label: "Operations", amount: 3000, pct: 15 },
                ].map((item) => (
                  <div key={item.label} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{item.label}</span>
                      <span style={{ fontSize: "13px", color: "#f87171", fontWeight: 700 }}>₱{item.amount.toLocaleString()}</span>
                    </div>
                    <div style={{ background: "#FEE2E2", borderRadius: "10px", height: "8px" }}>
                      <div style={{ background: "#f87171", borderRadius: "10px", height: "8px", width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TRANSACTIONS */}
        {activeTab === "transactions" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontWeight: 900, margin: 0 }}>Transactions</h2>
              <div style={{ display: "flex", gap: "8px" }}>
                {["all", "commission", "payout", "incentive", "subscription"].map((f) => (
                  <button key={f} onClick={() => setTxnFilter(f)}
                    style={{ padding: "6px 14px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "12px", textTransform: "capitalize",
                      background: txnFilter === f ? "#E61D72" : "#fff",
                      color: txnFilter === f ? "#fff" : "#888",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.06)" }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              {filteredTxns.map((txn, i) => (
                <div key={txn.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: i < filteredTxns.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ background: typeColor[txn.type].bg, color: typeColor[txn.type].color, padding: "8px 12px", borderRadius: "10px", fontSize: "12px", fontWeight: 700 }}>{txn.type}</div>
                    <div>
                      <p style={{ fontWeight: 600, margin: "0 0 2px", fontSize: "14px" }}>{txn.from || txn.to}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{txn.id} • {txn.date}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 900, fontSize: "16px", margin: "0 0 4px", color: txn.type === "Payout" || txn.type === "Incentive" ? "#f87171" : "#22c55e" }}>
                      {txn.type === "Payout" || txn.type === "Incentive" ? "-" : "+"}₱{txn.amount}
                    </p>
                    <span style={{ background: statusColor[txn.status].bg, color: statusColor[txn.status].color, padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 600 }}>{txn.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PAYOUTS */}
        {activeTab === "payouts" && (
          <>
            <h2 style={{ fontWeight: 900, margin: "0 0 24px" }}>Laborer Payouts</h2>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                    {["Laborer", "Bookings", "Gross", "Commission (10%)", "Incentive", "Net Payout", "Status", "Action"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: "12px", color: "#888", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.laborer} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px", fontWeight: 600 }}>{p.laborer}</td>
                      <td style={{ padding: "12px", color: "#888" }}>{p.bookings}</td>
                      <td style={{ padding: "12px" }}>₱{p.gross.toLocaleString()}</td>
                      <td style={{ padding: "12px", color: "#f87171", fontWeight: 600 }}>-₱{p.commission.toLocaleString()}</td>
                      <td style={{ padding: "12px", color: "#22c55e", fontWeight: 600 }}>+₱{p.incentive}</td>
                      <td style={{ padding: "12px", fontWeight: 900, color: "#E61D72" }}>₱{p.net.toLocaleString()}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ background: statusColor[p.status].bg, color: statusColor[p.status].color, padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>{p.status}</span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        {p.status === "Pending" && (
                          <button style={{ background: "#E61D72", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Pay Now</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* REPORTS */}
        {activeTab === "reports" && (
          <>
            <h2 style={{ fontWeight: 900, margin: "0 0 24px" }}>Monthly Reports</h2>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                    {["Month", "Revenue", "Commission", "Payouts", "Incentives", "Net Profit"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: "12px", color: "#888", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {months.map((month, i) => {
                    const rev = monthlyRevenue[i];
                    const comm = monthlyCommission[i];
                    const payout = Math.round(rev * 0.75);
                    const inc = i < 4 ? 900 : 1200;
                    const net = comm - inc;
                    return (
                      <tr key={month} style={{ borderBottom: "1px solid #f0f0f0", background: i === 3 ? "#FFF0F6" : "transparent" }}>
                        <td style={{ padding: "12px", fontWeight: i === 3 ? 700 : 400 }}>{month} 2026 {i === 3 && <span style={{ color: "#E61D72", fontSize: "11px" }}>← Current</span>}</td>
                        <td style={{ padding: "12px", fontWeight: 600 }}>₱{rev.toLocaleString()}</td>
                        <td style={{ padding: "12px", color: "#22c55e", fontWeight: 600 }}>₱{comm.toLocaleString()}</td>
                        <td style={{ padding: "12px", color: "#f87171" }}>₱{payout.toLocaleString()}</td>
                        <td style={{ padding: "12px", color: "#D97706" }}>₱{inc.toLocaleString()}</td>
                        <td style={{ padding: "12px", fontWeight: 900, color: "#E61D72" }}>₱{net.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
