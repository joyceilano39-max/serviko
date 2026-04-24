"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Tab = "overview" | "finance" | "tax" | "users" | "bookings" | "vouchers" | "expenses" | "analytics";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<any>(null);
  const [finance, setFinance] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [s, f, u, b, v, e] = await Promise.all([
        fetch("/api/admin/stats").then(r => r.json()),
        fetch("/api/admin/finance").then(r => r.json()),
        fetch("/api/admin/users").then(r => r.json()),
        fetch("/api/admin/bookings").then(r => r.json()),
        fetch("/api/admin/vouchers").then(r => r.json()),
        fetch("/api/admin/expenses").then(r => r.json())
      ]);
      setStats(s); setFinance(f);
      setUsers(u.users || []); setBookings(b.bookings || []);
      setVouchers(v.vouchers || []); setExpenses(e.expenses || []);
    } catch {}
    setLoading(false);
  }

  const peso = (n: number) => "P" + Math.round(n || 0).toLocaleString();
  const card = { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" };
  const label = { color: "#6B7280", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", margin: "0 0 8px" };
  const value = { fontSize: "28px", fontWeight: 900, color: "#111827", margin: 0 };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "ðŸ“Š" },
    { id: "finance", label: "Finance", icon: "ðŸ’°" },
    { id: "tax", label: "Taxes (BIR)", icon: "ðŸ“‹" },
    { id: "users", label: "Users", icon: "ðŸ‘¥" },
    { id: "bookings", label: "Bookings", icon: "ðŸ“…" },
    { id: "vouchers", label: "Vouchers", icon: "ðŸŽŸï¸" },
    { id: "expenses", label: "Expenses", icon: "ðŸ’³" },
    { id: "analytics", label: "Analytics", icon: "ðŸ“ˆ" }
  ];

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>Loading dashboard...</div>;

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
      {/* Sidebar */}
      <aside style={{ width: "220px", background: "#fff", borderRight: "1px solid #E5E7EB", padding: "20px 12px" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "10px 12px", border: "none", background: tab === t.id ? "#F3F4F6" : "transparent", color: tab === t.id ? "#111827" : "#6B7280", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: tab === t.id ? 700 : 500, textAlign: "left", marginBottom: "2px" }}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {tab === "overview" && stats && (
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 24px" }}>Dashboard Overview</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <div style={card}><p style={label}>Customers</p><p style={value}>{stats.customers}</p></div>
              <div style={card}><p style={label}>Artists</p><p style={value}>{stats.artists}</p></div>
              <div style={card}><p style={label}>Bookings</p><p style={value}>{stats.totalBookings}</p></div>
              <div style={card}><p style={label}>Pending</p><p style={value}>{stats.pendingBookings}</p></div>
              <div style={card}><p style={label}>Completed</p><p style={value}>{stats.completedBookings}</p></div>
              <div style={card}><p style={label}>This Week</p><p style={value}>{stats.recentBookings}</p></div>
              <div style={{ ...card, background: "#FDF2F8" }}><p style={label}>Gross Revenue</p><p style={{ ...value, color: "#E61D72" }}>{peso(stats.totalRevenue)}</p></div>
              <div style={{ ...card, background: "#F5F3FF" }}><p style={label}>Your Commission (10%)</p><p style={{ ...value, color: "#7C3AED" }}>{peso(stats.commission)}</p></div>
            </div>
          </div>
        )}

        {tab === "finance" && finance && (
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 24px" }}>Finance & Accounting</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <div style={card}><p style={label}>This Month</p><p style={value}>{peso(finance.monthly)}</p></div>
              <div style={card}><p style={label}>Last Month</p><p style={{ ...value, fontSize: "24px", color: "#6B7280" }}>{peso(finance.lastMonth)}</p></div>
              <div style={card}><p style={label}>This Year</p><p style={value}>{peso(finance.yearly)}</p></div>
              <div style={card}><p style={label}>All-Time Gross</p><p style={value}>{peso(finance.gross)}</p></div>
            </div>
            <div style={{ ...card, marginBottom: "16px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 16px" }}>Revenue Breakdown</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div><p style={label}>Gross Revenue</p><p style={{ fontSize: "22px", fontWeight: 700 }}>{peso(finance.gross)}</p></div>
                <div><p style={label}>Commission (10%)</p><p style={{ fontSize: "22px", fontWeight: 700, color: "#059669" }}>{peso(finance.commission)}</p></div>
                <div><p style={label}>Artist Payouts (90%)</p><p style={{ fontSize: "22px", fontWeight: 700, color: "#DC2626" }}>-{peso(finance.artistPayouts)}</p></div>
                <div><p style={label}>Net Profit (after tax)</p><p style={{ fontSize: "22px", fontWeight: 700, color: "#059669" }}>{peso(finance.netProfit)}</p></div>
              </div>
            </div>
          </div>
        )}

        {tab === "tax" && finance && (
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 8px" }}>Tax Center (BIR Philippines)</h1>
            <p style={{ color: "#6B7280", marginBottom: "24px" }}>Track your tax obligations as a business owner</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <div style={{ ...card, borderLeft: "4px solid #DC2626" }}><p style={label}>VAT Due (12%)</p><p style={value}>{peso(finance.vat)}</p><p style={{ fontSize: "11px", color: "#6B7280", marginTop: "8px" }}>BIR Form 2550M - Monthly</p></div>
              <div style={{ ...card, borderLeft: "4px solid #F59E0B" }}><p style={label}>Income Tax (8%)</p><p style={value}>{peso(finance.incomeTax)}</p><p style={{ fontSize: "11px", color: "#6B7280", marginTop: "8px" }}>BIR Form 1701Q - Quarterly</p></div>
              <div style={{ ...card, borderLeft: "4px solid #7C3AED" }}><p style={label}>Withholding Tax (2%)</p><p style={value}>{peso(finance.withholdingTax)}</p><p style={{ fontSize: "11px", color: "#6B7280", marginTop: "8px" }}>From artist payments</p></div>
            </div>
            <div style={card}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 16px" }}>Tax Summary</h2>
              <div style={{ padding: "16px", background: "#F9FAFB", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>Commission Income</span><strong>{peso(finance.commission)}</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#DC2626" }}><span>- VAT Payable</span><strong>{peso(finance.vat)}</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#DC2626" }}><span>- Income Tax</span><strong>{peso(finance.incomeTax)}</strong></div>
                <hr style={{ margin: "12px 0", border: "none", borderTop: "1px solid #E5E7EB" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: 700 }}><span>Net Profit After Tax</span><strong style={{ color: "#059669" }}>{peso(finance.netProfit)}</strong></div>
              </div>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 24px" }}>Users ({users.length})</h1>
            <div style={card}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ textAlign: "left", borderBottom: "2px solid #E5E7EB" }}><th style={{ padding: "12px" }}>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Joined</th></tr></thead>
                <tbody>
                  {users.map((u: any) => (<tr key={u.id} style={{ borderBottom: "1px solid #F3F4F6" }}><td style={{ padding: "12px" }}>{u.name}</td><td>{u.email}</td><td><span style={{ padding: "2px 8px", background: u.role === "admin" ? "#FEF3C7" : u.role === "artist" ? "#EDE9FE" : "#FCE7F3", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>{u.role}</span></td><td>{u.phone || "-"}</td><td>{new Date(u.created_at).toLocaleDateString()}</td></tr>))}
                </tbody>
              </table>
              {users.length === 0 && <p style={{ textAlign: "center", color: "#9CA3AF", padding: "40px" }}>No users yet</p>}
            </div>
          </div>
        )}

        {tab === "bookings" && (
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 24px" }}>Bookings ({bookings.length})</h1>
            <div style={card}>
              {bookings.length === 0 ? <p style={{ textAlign: "center", color: "#9CA3AF", padding: "40px" }}>No bookings yet</p> : <p>Bookings will appear here</p>}
            </div>
          </div>
        )}

        {tab === "vouchers" && (
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 24px" }}>Vouchers ({vouchers.length})</h1>
            <div style={card}>
              <p style={{ color: "#6B7280" }}>Vouchers feature coming soon - add voucher codes, track usage, set discounts</p>
            </div>
          </div>
        )}

        {tab === "expenses" && (
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 24px" }}>Expenses</h1>
            <div style={card}>
              <p style={{ color: "#6B7280" }}>Track business expenses: hosting, marketing, salaries, etc.</p>
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 24px" }}>Analytics</h1>
            <div style={card}>
              <p style={{ color: "#6B7280" }}>Charts and growth metrics coming soon</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}