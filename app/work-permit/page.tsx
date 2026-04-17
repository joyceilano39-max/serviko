export default function WorkPermitPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <a href="/" style={{ color: "#888", fontSize: "13px", textDecoration: "none" }}>Back to Home</a>
        <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", marginTop: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h1 style={{ fontWeight: 900, color: "#7C3AED", margin: "0 0 8px" }}>Serviko Work Permit</h1>
          <p style={{ color: "#888", margin: "0 0 20px", fontSize: "14px" }}>Official authorization for Serviko artists to operate.</p>
          <div style={{ background: "#F5F3FF", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ fontWeight: 700, margin: "0 0 8px" }}>Requirements:</p>
            <ul style={{ color: "#555", fontSize: "13px", paddingLeft: "20px", margin: 0 }}>
              <li>Valid Government ID</li>
              <li>NBI/PNP Clearance</li>
              <li>Completed Serviko Training</li>
              <li>Approved ID Verification</li>
            </ul>
          </div>
          <a href="/register/artist" style={{ display: "block", background: "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, textAlign: "center" }}>
            Apply as Artist
          </a>
        </div>
      </div>
    </div>
  );
}
