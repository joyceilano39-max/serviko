export default function AnalyticsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <a href="/admin" style={{ color: "#888", fontSize: "13px", textDecoration: "none" }}>Back to Admin</a>
        <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", marginTop: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h1 style={{ fontWeight: 900, color: "#7C3AED", margin: "0 0 8px" }}>Analytics</h1>
          <p style={{ color: "#888", margin: "0 0 20px", fontSize: "14px" }}>View all analytics and reports in the Admin Dashboard.</p>
          <a href="/admin" style={{ display: "block", background: "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, textAlign: "center" }}>
            Go to Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
