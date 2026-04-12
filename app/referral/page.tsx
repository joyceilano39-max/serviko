"use client";
import { useState } from "react";

const referralHistory = [
  { name: "Maria Santos", date: "April 10, 2026", status: "Completed", reward: 100 },
  { name: "Ana Reyes", date: "April 8, 2026", status: "Completed", reward: 100 },
  { name: "Liza Cruz", date: "April 5, 2026", status: "Pending", reward: 0 },
  { name: "Joy Dela Cruz", date: "April 3, 2026", status: "Completed", reward: 100 },
];

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "JOYCE-SRV-2026";
  const referralLink = `https://serviko.dev/register?ref=${referralCode}`;
  const totalEarned = referralHistory.filter(r => r.status === "Completed").reduce((sum, r) => sum + r.reward, 0);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #E61D72 0%, #7C3AED 100%)", padding: "48px 32px", color: "#fff", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎁</div>
        <h1 style={{ fontSize: "36px", fontWeight: 900, margin: "0 0 8px" }}>Refer & Earn</h1>
        <p style={{ opacity: 0.8, margin: "0 0 24px", fontSize: "16px" }}>Invite friends to Serviko and earn ₱100 for every successful referral!</p>
        <div style={{ display: "flex", gap: "32px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            ["4", "Friends Referred"],
            ["₱300", "Total Earned"],
            ["1", "Pending"],
          ].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "36px", fontWeight: 900, margin: 0 }}>{val}</p>
              <p style={{ opacity: 0.8, fontSize: "13px", margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "32px" }}>

        {/* Referral Code */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", marginBottom: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <h2 style={{ fontWeight: 900, margin: "0 0 8px" }}>Your Referral Code</h2>
          <p style={{ color: "#888", margin: "0 0 24px", fontSize: "14px" }}>Share this code with friends to earn rewards</p>
          
          <div style={{ background: "#FFF0F6", borderRadius: "16px", padding: "20px", marginBottom: "16px", border: "2px dashed #E61D72" }}>
            <p style={{ fontSize: "32px", fontWeight: 900, color: "#E61D72", margin: 0, letterSpacing: "4px" }}>{referralCode}</p>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button onClick={copyCode}
              style={{ background: "#E61D72", color: "#fff", padding: "12px 24px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
              {copied ? "✅ Copied!" : "📋 Copy Code"}
            </button>
            <button onClick={copyLink}
              style={{ background: "#fff", color: "#E61D72", padding: "12px 24px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
              🔗 Copy Link
            </button>
          </div>

          {/* Share Buttons */}
          <div style={{ marginTop: "20px" }}>
            <p style={{ color: "#888", fontSize: "13px", marginBottom: "12px" }}>Share via:</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              {[
                { label: "📱 Messenger", color: "#0084FF" },
                { label: "💬 Viber", color: "#7360F2" },
                { label: "📧 Email", color: "#E61D72" },
              ].map((btn) => (
                <button key={btn.label}
                  style={{ padding: "10px 20px", borderRadius: "20px", border: "none", background: btn.color, color: "#fff", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 20px" }}>How It Works</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { step: "1", icon: "🔗", title: "Share Your Code", desc: "Share your unique referral code or link with friends and family" },
              { step: "2", icon: "📝", title: "Friend Signs Up", desc: "Your friend registers on Serviko using your referral code" },
              { step: "3", icon: "📅", title: "Friend Books", desc: "Your friend completes their first booking on Serviko" },
              { step: "4", icon: "💰", title: "You Both Earn", desc: "You get ₱100 credit, your friend gets ₱50 off their first booking!" },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, flexShrink: 0 }}>{item.step}</div>
                <div>
                  <p style={{ fontWeight: 700, margin: "0 0 4px" }}>{item.icon} {item.title}</p>
                  <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontWeight: 700, margin: 0 }}>My Rewards</h3>
            <div style={{ background: "#FFF0F6", borderRadius: "12px", padding: "8px 16px" }}>
              <span style={{ color: "#E61D72", fontWeight: 900, fontSize: "18px" }}>₱{totalEarned}</span>
              <span style={{ color: "#888", fontSize: "13px" }}> earned</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {referralHistory.map((ref, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < referralHistory.length - 1 ? "1px solid #FFE4F0" : "none" }}>
                <div>
                  <p style={{ fontWeight: 600, margin: "0 0 2px" }}>{ref.name}</p>
                  <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{ref.date}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ background: ref.status === "Completed" ? "#F0FDF4" : "#FFF9E6", color: ref.status === "Completed" ? "#22c55e" : "#D97706", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>{ref.status}</span>
                  {ref.reward > 0 && <p style={{ color: "#E61D72", fontWeight: 700, margin: "4px 0 0", fontSize: "14px" }}>+₱{ref.reward}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* First Booking Voucher */}
        <div style={{ background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 16px rgba(255,165,0,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontWeight: 900, fontSize: "18px", margin: "0 0 4px", color: "#1a1a1a" }}>🎉 First Booking Voucher</p>
              <p style={{ color: "#333", fontSize: "13px", margin: "0 0 8px" }}>For your referred friends</p>
              <div style={{ background: "#fff", borderRadius: "8px", padding: "8px 16px", display: "inline-block" }}>
                <span style={{ fontWeight: 900, color: "#E61D72", fontSize: "20px" }}>₱50 OFF</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontWeight: 900, fontSize: "48px", margin: 0 }}>🎫</p>
            </div>
          </div>
          <p style={{ color: "#333", fontSize: "12px", margin: "12px 0 0" }}>* Valid for first booking only. Minimum booking of ₱300.</p>
        </div>

      </div>
    </div>
  );
}
