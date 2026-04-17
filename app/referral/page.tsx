"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

type Referral = {
  id: number;
  referred_name: string;
  status: string;
  reward: number;
  created_at: string;
};

export default function ReferralPage() {
  const { user } = useUser();
  const [history, setHistory] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const firstName = user?.firstName || "User";
  const userId = user?.id?.slice(-4).toUpperCase() || "0000";
  const referralCode = `SRV-${firstName.toUpperCase().slice(0, 4)}-${userId}`;
  const referralLink = `https://serviko.dev/register?ref=${referralCode}`;

  useEffect(() => {
    if (!user) return;
    fetch(`/api/referral?code=${referralCode}`)
      .then(r => r.json())
      .then(d => { setHistory(d.referrals || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  const totalEarned = history.filter(r => r.status === "completed").reduce((sum, r) => sum + r.reward, 0);
  const pending = history.filter(r => r.status === "pending").length;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, "_blank");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>Back to Home</a>
        <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 4px" }}>Refer & Earn</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "13px" }}>Earn P100 for every friend who books!</p>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "16px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ fontWeight: 900, fontSize: "28px", color: "#22c55e", margin: "0 0 4px" }}>P{totalEarned}</p>
            <p style={{ color: "#555", fontSize: "12px", margin: 0, fontWeight: 600 }}>Total Earned</p>
          </div>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "16px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ fontWeight: 900, fontSize: "28px", color: "#F59E0B", margin: "0 0 4px" }}>{pending}</p>
            <p style={{ color: "#555", fontSize: "12px", margin: 0, fontWeight: 600 }}>Pending Friends</p>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 16px" }}>How it Works</h3>
          {[
            { step: "1", text: "Share your referral link with friends", color: "#E61D72" },
            { step: "2", text: "Friend registers using your link", color: "#7C3AED" },
            { step: "3", text: "Friend completes their first booking", color: "#22c55e" },
            { step: "4", text: "You earn P100 reward automatically!", color: "#F59E0B" },
          ].map(item => (
            <div key={item.step} style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: item.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, flexShrink: 0 }}>
                {item.step}
              </div>
              <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 8px" }}>Your Referral Link</h3>
          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 12px" }}>Your code: <strong style={{ color: "#E61D72" }}>{referralCode}</strong></p>
          <div style={{ background: "#FFF0F6", borderRadius: "12px", padding: "12px 16px", marginBottom: "12px", wordBreak: "break-all", fontSize: "13px", color: "#555" }}>
            {referralLink}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={copyLink} style={{ flex: 1, background: copied ? "#22c55e" : "#E61D72", color: "#fff", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <button onClick={shareOnFacebook} style={{ flex: 1, background: "#1877F2", color: "#fff", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
              Share on Facebook
            </button>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 16px" }}>Referral History</h3>
          {loading ? (
            <p style={{ color: "#888", textAlign: "center" }}>Loading...</p>
          ) : history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <p style={{ fontWeight: 700, margin: "0 0 8px" }}>No referrals yet</p>
              <p style={{ color: "#888", fontSize: "13px" }}>Share your link to start earning!</p>
            </div>
          ) : (
            history.map(ref => (
              <div key={ref.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                <div>
                  <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{ref.referred_name}</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{new Date(ref.created_at).toLocaleDateString("en-PH")}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ background: ref.status === "completed" ? "#F0FDF4" : "#FFF9E6", color: ref.status === "completed" ? "#22c55e" : "#D97706", padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, display: "block", marginBottom: "2px" }}>
                    {ref.status}
                  </span>
                  <p style={{ fontWeight: 700, color: "#22c55e", margin: 0 }}>+P{ref.reward}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
