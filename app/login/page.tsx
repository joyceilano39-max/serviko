"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [cardDetails, setCardDetails] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", phone: "" });

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ color: "#E61D72", fontWeight: 900, fontSize: "28px", textDecoration: "none" }}>🌸 Serviko</Link>
          <p style={{ color: "#888", fontSize: "14px", marginTop: "8px" }}>Para sa Pilipino</p>
        </div>

        <div style={{ background: "#fff", borderRadius: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}>

          {/* Tabs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <button onClick={() => setTab("login")} style={{ padding: "16px", border: "none", background: tab === "login" ? "#E61D72" : "#fff", color: tab === "login" ? "#fff" : "#888", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
              Sign In
            </button>
            <button onClick={() => setTab("signup")} style={{ padding: "16px", border: "none", background: tab === "signup" ? "#E61D72" : "#fff", color: tab === "signup" ? "#fff" : "#888", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
              Sign Up
            </button>
          </div>

          <div style={{ padding: "32px" }}>

            {tab === "login" ? (
              /* LOGIN FORM */
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>Welcome back! 👋</h2>
                <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Sign in to manage your bookings</p>

                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Email</label>
                  <input type="email" placeholder="joyce@email.com"
                    style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Password</label>
                  <input type="password" placeholder="••••••••"
                    style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
                </div>

                <div style={{ textAlign: "right" }}>
                  <a href="#" style={{ color: "#E61D72", fontSize: "13px", textDecoration: "none" }}>Forgot password?</a>
                </div>

                <Link href="/dashboard" style={{ background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", textDecoration: "none", fontSize: "15px", fontWeight: 700, textAlign: "center", display: "block" }}>
                  Sign In
                </Link>

                <div style={{ textAlign: "center", color: "#888", fontSize: "13px" }}>or continue with</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <button style={{ padding: "12px", borderRadius: "12px", border: "1px solid #eee", background: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <img src="https://www.google.com/favicon.ico" width="16" /> Google
                  </button>
                  <button style={{ padding: "12px", borderRadius: "12px", border: "1px solid #eee", background: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    📘 Facebook
                  </button>
                </div>
              </div>
            ) : (
              /* SIGNUP FORM */
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>Create Account 🌸</h2>
                <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Join thousands of happy customers</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>First Name</label>
                    <input type="text" placeholder="Joyce" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Last Name</label>
                    <input type="text" placeholder="Ilano" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
                  </div>
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Email</label>
                  <input type="email" placeholder="joyce@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Phone</label>
                  <input type="tel" placeholder="09XX XXX XXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Password</label>
                  <input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
                </div>

                {/* Payment Method */}
                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "10px" }}>Payment Method</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <button onClick={() => setPaymentMethod("cash")}
                      style={{ padding: "14px", borderRadius: "12px", border: `2px solid ${paymentMethod === "cash" ? "#E61D72" : "#FFD6E7"}`,
                        background: paymentMethod === "cash" ? "#FFF0F6" : "#fff", cursor: "pointer", fontWeight: 600, fontSize: "14px",
                        color: paymentMethod === "cash" ? "#E61D72" : "#888" }}>
                      💵 Cash
                    </button>
                    <button onClick={() => setPaymentMethod("card")}
                      style={{ padding: "14px", borderRadius: "12px", border: `2px solid ${paymentMethod === "card" ? "#E61D72" : "#FFD6E7"}`,
                        background: paymentMethod === "card" ? "#FFF0F6" : "#fff", cursor: "pointer", fontWeight: 600, fontSize: "14px",
                        color: paymentMethod === "card" ? "#E61D72" : "#888" }}>
                      💳 Card
                    </button>
                  </div>
                </div>

                {/* Card Details */}
                {paymentMethod === "card" && (
                  <div style={{ background: "#FFF8FC", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", border: "1px solid #FFD6E7" }}>
                    <div>
                      <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
                    </div>
                    <div>
                      <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Cardholder Name</label>
                      <input type="text" placeholder="JOYCE ILANO" value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Expiry Date</label>
                        <input type="text" placeholder="MM/YY" maxLength={5} value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
                      </div>
                      <div>
                        <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>CVV</label>
                        <input type="password" placeholder="•••" maxLength={3} value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
                      </div>
                    </div>
                  </div>
                )}

                <Link href="/dashboard" style={{ background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", textDecoration: "none", fontSize: "15px", fontWeight: 700, textAlign: "center", display: "block" }}>
                  Create Account
                </Link>

                <p style={{ textAlign: "center", color: "#888", fontSize: "12px", margin: 0 }}>
                  By signing up, you agree to our Terms & Privacy Policy
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}