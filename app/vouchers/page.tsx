"use client";
import { useState } from "react";

const VOUCHERS = [
  { code: "FIRST50", desc: "P50 off your first booking", min: "No minimum", expiry: "No expiry", color: "#E61D72", discount: 50 },
  { code: "SUMMER20", desc: "20% off massage services", min: "Min. P200", expiry: "Until June 30, 2026", color: "#7C3AED", discount: 20 },
  { code: "REFER100", desc: "P100 referral reward", min: "Min. P500", expiry: "No expiry", color: "#22c55e", discount: 100 },
  { code: "WELCOME50", desc: "Welcome gift - P50 off", min: "No minimum", expiry: "No expiry", color: "#F59E0B", discount: 50 },
  { code: "LOYAL200", desc: "Loyalty reward - P200 off", min: "Min. P1000", expiry: "No expiry", color: "#3b82f6", discount: 200 },
];

export default function VouchersPage() {
  const [copied, setCopied] = useState("");
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(""), 2000);
  };
  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>Back to Home</a>
        <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 4px" }}>Vouchers & Promos</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "13px" }}>Save more on every booking!</p>
      </div>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        {VOUCHERS.map(v => (
          <div key={v.code} style={{ background: "#fff", borderRadius: "16px", padding: "16px", marginBottom: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${v.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 900, fontSize: "18px", color: v.color, margin: "0 0 4px" }}>{v.code}</p>
                <p style={{ color: "#555", fontSize: "13px", margin: "0 0 2px" }}>{v.desc}</p>
                <p style={{ color: "#888", fontSize: "11px", margin: "0 0 2px" }}>{v.min}</p>
                <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>Expiry: {v.expiry}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: 900, fontSize: "22px", color: v.color, margin: "0 0 8px" }}>
                  {v.discount < 100 ? `${v.discount}%` : `P${v.discount}`}
                </p>
                <button onClick={() => copyCode(v.code)}
                  style={{ background: copied === v.code ? "#22c55e" : v.color, color: "#fff", border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 700, fontSize: "12px" }}>
                  {copied === v.code ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        ))}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <p style={{ fontWeight: 700, margin: "0 0 8px" }}>Have a voucher code?</p>
          <p style={{ color: "#888", fontSize: "13px", margin: "0 0 16px" }}>Enter it during booking checkout to get your discount!</p>
          <a href="/booking" style={{ display: "inline-block", background: "#E61D72", color: "#fff", padding: "12px 24px", borderRadius: "20px", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}
