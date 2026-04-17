"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Voucher = {
  id: number; code: string; description: string;
  discount_type: string; discount_value: number;
  min_order: number; expiry_date: string; is_active: boolean;
};

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetch("/api/vouchers")
      .then(r => r.json())
      .then(d => { setVouchers(d.vouchers || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(""), 2000);
  };

  const colors = ["#E61D72", "#7C3AED", "#22c55e", "#F59E0B", "#3b82f6", "#f87171", "#06b6d4"];

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>Back to Home</a>
        <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 4px" }}>Vouchers & Promos</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "13px" }}>Save more on every booking!</p>
      </div>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px" }}>
            <p style={{ color: "#888" }}>Loading vouchers...</p>
          </div>
        ) : vouchers.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center" }}>
            <p style={{ fontWeight: 700, margin: "0 0 8px" }}>No vouchers available</p>
            <p style={{ color: "#888", fontSize: "13px" }}>Check back soon for promos!</p>
          </div>
        ) : (
          vouchers.map((v, i) => {
            const color = colors[i % colors.length];
            return (
              <div key={v.id} style={{ background: "#fff", borderRadius: "16px", padding: "16px", marginBottom: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontWeight: 900, fontSize: "18px", color: color, margin: "0 0 4px" }}>{v.code}</p>
                    <p style={{ color: "#555", fontSize: "13px", margin: "0 0 2px" }}>{v.description}</p>
                    <p style={{ color: "#888", fontSize: "11px", margin: "0 0 2px" }}>Min: P{v.min_order || 0}</p>
                    <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>Expiry: {v.expiry_date || "No expiry"}</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontWeight: 900, fontSize: "22px", color: color, margin: "0 0 8px" }}>
                      {v.discount_type === "percent" ? `${v.discount_value}%` : `P${v.discount_value}`}
                    </p>
                    <button onClick={() => copyCode(v.code)}
                      style={{ background: copied === v.code ? "#22c55e" : color, color: "#fff", border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 700, fontSize: "12px" }}>
                      {copied === v.code ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <p style={{ fontWeight: 700, margin: "0 0 8px" }}>Have a voucher code?</p>
          <p style={{ color: "#888", fontSize: "13px", margin: "0 0 16px" }}>Enter it during booking checkout to get your discount!</p>
          <Link href="/booking" style={{ display: "inline-block", background: "#E61D72", color: "#fff", padding: "12px 24px", borderRadius: "20px", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
