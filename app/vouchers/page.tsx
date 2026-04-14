"use client";
import { useState } from "react";

const vouchers = [
  { code: "FIRST50", discount: 50, type: "First Booking", minOrder: 300, expiry: "April 30, 2026", used: false, color: "#E61D72" },
  { code: "REFER100", discount: 100, type: "Referral Reward", minOrder: 500, expiry: "May 15, 2026", used: false, color: "#7C3AED" },
  { code: "SUMMER20", discount: 20, type: "Seasonal", minOrder: 200, expiry: "April 20, 2026", used: false, color: "#3b82f6", percent: true },
  { code: "LOYAL200", discount: 200, type: "Loyalty Reward", minOrder: 800, expiry: "May 31, 2026", used: false, color: "#22c55e" },
  { code: "BDAY150", discount: 150, type: "Birthday Special", minOrder: 500, expiry: "April 13, 2026", used: true, color: "#D97706" },
];

export default function VoucherPage() {
  const [activeTab, setActiveTab] = useState("available");
  const [promoCode, setPromoCode] = useState("");
  const [applyMsg, setApplyMsg] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  const available = vouchers.filter(v => !v.used);
  const used = vouchers.filter(v => v.used);

  const handleApply = () => {
    const found = vouchers.find(v => v.code === promoCode.toUpperCase());
    if (found) {
      setApplyMsg(`✅ Voucher "${found.code}" applied! You save ${found.percent ? found.discount + "%" : "₱" + found.discount}`);
    } else {
      setApplyMsg("❌ Invalid voucher code. Please try again.");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #E61D72 0%, #C01660 100%)", padding: "48px 32px", color: "#fff", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎫</div>
        <h1 style={{ fontSize: "36px", fontWeight: 900, margin: "0 0 8px" }}>My Vouchers</h1>
        <p style={{ opacity: 0.8, margin: 0 }}>Use your vouchers to save on your next booking!</p>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "32px" }}>

        {/* Enter Promo Code */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Enter Promo Code</h3>
          <div style={{ display: "flex", gap: "12px" }}>
            <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter code e.g. FIRST50"
              style={{ flex: 1, padding: "12px 16px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", fontWeight: 600, letterSpacing: "2px" }} />
            <button onClick={handleApply}
              style={{ background: "#E61D72", color: "#fff", padding: "12px 24px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer" }}>
              Apply
            </button>
          </div>
          {applyMsg && (
            <p style={{ marginTop: "12px", fontWeight: 600, color: applyMsg.startsWith("✅") ? "#22c55e" : "#f87171", fontSize: "14px" }}>{applyMsg}</p>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "24px", background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <button onClick={() => setActiveTab("available")}
            style={{ flex: 1, padding: "16px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "14px",
              background: activeTab === "available" ? "#E61D72" : "#fff",
              color: activeTab === "available" ? "#fff" : "#888" }}>
            Available ({available.length})
          </button>
          <button onClick={() => setActiveTab("used")}
            style={{ flex: 1, padding: "16px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "14px",
              background: activeTab === "used" ? "#E61D72" : "#fff",
              color: activeTab === "used" ? "#fff" : "#888" }}>
            Used ({used.length})
          </button>
        </div>

        {/* Voucher Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {(activeTab === "available" ? available : used).map((voucher) => (
            <div key={voucher.code} style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", opacity: voucher.used ? 0.6 : 1 }}>
              <div style={{ display: "flex" }}>
                {/* Left colored section */}
                <div style={{ background: voucher.color, padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: "100px" }}>
                  <span style={{ fontSize: "32px" }}>🎫</span>
                  <p style={{ color: "#fff", fontWeight: 900, fontSize: "20px", margin: "8px 0 0" }}>
                    {voucher.percent ? `-${voucher.discount}%` : `-₱${voucher.discount}`}
                  </p>
                </div>

                {/* Dashed separator */}
                <div style={{ width: "1px", background: "repeating-linear-gradient(to bottom, #FFD6E7 0px, #FFD6E7 8px, transparent 8px, transparent 16px)", margin: "16px 0" }} />

                {/* Right content */}
                <div style={{ flex: 1, padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ background: `${voucher.color}20`, color: voucher.color, padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>{voucher.type}</span>
                      <p style={{ fontWeight: 900, fontSize: "20px", margin: "8px 0 4px", color: voucher.color, letterSpacing: "2px" }}>{voucher.code}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: "0 0 4px" }}>Min. order: ₱{voucher.minOrder}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Expires: {voucher.expiry}</p>
                    </div>
                    <div>
                      {voucher.used ? (
                        <span style={{ background: "#f0f0f0", color: "#888", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>Used</span>
                      ) : (
                        <button onClick={() => copyCode(voucher.code)}
                          style={{ background: copiedCode === voucher.code ? "#22c55e" : voucher.color, color: "#fff", padding: "8px 16px", borderRadius: "20px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                          {copiedCode === voucher.code ? "✅ Copied!" : "Copy Code"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How to use */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginTop: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>How to Use Vouchers</h3>
          {[
            { step: "1", text: "Copy your voucher code" },
            { step: "2", text: "Go to the booking page and select your service" },
            { step: "3", text: "Enter the code in the promo code field" },
            { step: "4", text: "Discount will be applied automatically!" },
          ].map((item) => (
            <div key={item.step} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px", flexShrink: 0 }}>{item.step}</div>
              <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>{item.text}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
