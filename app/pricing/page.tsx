"use client";
import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [servicePrice, setServicePrice] = useState(500);
  const [bookingsPerDay, setBookingsPerDay] = useState(3);
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState(5);

  const commission = 0.10;
  const artistEarnings = Math.round(servicePrice * (1 - commission));
  const servikoFee = Math.round(servicePrice * commission);
  const dailyEarnings = artistEarnings * bookingsPerDay;
  const weeklyEarnings = dailyEarnings * workDaysPerWeek;
  const monthlyEarnings = weeklyEarnings * 4;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "24px", color: "#fff", textAlign: "center" }}>
        <Link href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px", display: "block", marginBottom: "8px" }}>Back to Home</Link>
        <h1 style={{ fontSize: "26px", fontWeight: 900, margin: "0 0 8px" }}>Simple, Transparent Pricing</h1>
        <p style={{ opacity: 0.9, margin: 0, fontSize: "14px" }}>No hidden fees. No surprises. You keep 90% always.</p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 20px" }}>

        {/* EARNINGS CALCULATOR */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontWeight: 900, margin: "0 0 6px", fontSize: "20px" }}>Artist Earnings Calculator</h2>
          <p style={{ color: "#888", fontSize: "13px", margin: "0 0 24px" }}>See exactly how much you can earn on Serviko</p>

          {/* Service Price Slider */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontWeight: 600, fontSize: "14px" }}>Your Service Price</label>
              <span style={{ fontWeight: 900, fontSize: "18px", color: "#E61D72" }}>P{servicePrice}</span>
            </div>
            <input type="range" min="100" max="5000" step="50" value={servicePrice}
              onChange={e => setServicePrice(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "#E61D72", height: "6px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#888", marginTop: "4px" }}>
              <span>P100</span><span>P5,000</span>
            </div>
          </div>

          {/* Bookings per day */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontWeight: 600, fontSize: "14px" }}>Bookings per Day</label>
              <span style={{ fontWeight: 900, fontSize: "18px", color: "#7C3AED" }}>{bookingsPerDay}</span>
            </div>
            <input type="range" min="1" max="10" step="1" value={bookingsPerDay}
              onChange={e => setBookingsPerDay(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "#7C3AED", height: "6px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#888", marginTop: "4px" }}>
              <span>1</span><span>10</span>
            </div>
          </div>

          {/* Work days per week */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontWeight: 600, fontSize: "14px" }}>Work Days per Week</label>
              <span style={{ fontWeight: 900, fontSize: "18px", color: "#22c55e" }}>{workDaysPerWeek}</span>
            </div>
            <input type="range" min="1" max="7" step="1" value={workDaysPerWeek}
              onChange={e => setWorkDaysPerWeek(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "#22c55e", height: "6px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#888", marginTop: "4px" }}>
              <span>1 day</span><span>7 days</span>
            </div>
          </div>

          {/* Per Booking Breakdown */}
          <div style={{ background: "#FFF9E6", borderRadius: "14px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ fontWeight: 700, color: "#D97706", margin: "0 0 12px", fontSize: "14px" }}>Per Booking Breakdown</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #FDE68A" }}>
                <span style={{ color: "#555", fontSize: "13px" }}>Customer pays</span>
                <span style={{ fontWeight: 700, fontSize: "14px" }}>P{servicePrice}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #FDE68A" }}>
                <span style={{ color: "#555", fontSize: "13px" }}>Serviko fee (10%)</span>
                <span style={{ fontWeight: 700, fontSize: "14px", color: "#f87171" }}>-P{servikoFee}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span style={{ fontWeight: 700, fontSize: "14px" }}>You receive</span>
                <span style={{ fontWeight: 900, fontSize: "20px", color: "#22c55e" }}>P{artistEarnings}</span>
              </div>
            </div>
          </div>

          {/* Earnings Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {[
              { label: "Daily", value: `P${dailyEarnings.toLocaleString()}`, color: "#E61D72", bg: "#FFF0F6" },
              { label: "Weekly", value: `P${weeklyEarnings.toLocaleString()}`, color: "#7C3AED", bg: "#F5F3FF" },
              { label: "Monthly", value: `P${monthlyEarnings.toLocaleString()}`, color: "#22c55e", bg: "#F0FDF4" },
            ].map(item => (
              <div key={item.label} style={{ background: item.bg, borderRadius: "14px", padding: "14px", textAlign: "center" }}>
                <p style={{ fontWeight: 900, fontSize: "18px", color: item.color, margin: "0 0 4px" }}>{item.value}</p>
                <p style={{ color: "#555", fontSize: "12px", margin: 0, fontWeight: 600 }}>{item.label}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "#F0FDF4", borderRadius: "12px", padding: "12px 16px", marginTop: "16px", textAlign: "center" }}>
            <p style={{ color: "#22c55e", fontWeight: 700, fontSize: "14px", margin: 0 }}>
              Earn up to P{monthlyEarnings.toLocaleString()} per month working {workDaysPerWeek} days a week!
            </p>
          </div>

          <Link href="/register/artist" style={{ display: "block", background: "linear-gradient(135deg, #E61D72, #7C3AED)", color: "#fff", padding: "16px", borderRadius: "14px", textDecoration: "none", fontWeight: 700, fontSize: "16px", textAlign: "center", marginTop: "16px" }}>
            Start Earning Now - Join Free!
          </Link>
        </div>

        {/* For Customers */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontWeight: 900, margin: "0 0 16px", fontSize: "20px" }}>For Customers</h2>
          <div style={{ background: "#FFF0F6", borderRadius: "14px", padding: "20px", marginBottom: "16px", textAlign: "center" }}>
            <p style={{ fontWeight: 900, fontSize: "40px", color: "#E61D72", margin: "0 0 4px" }}>FREE</p>
            <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>No booking fees. No subscription. Ever.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            {[
              { title: "No Booking Fee", desc: "Pay only for the service" },
              { title: "Transparent Prices", desc: "See rates before booking" },
              { title: "Vouchers & Promos", desc: "Save with promo codes" },
              { title: "GCash / Maya / Card", desc: "Multiple payment options" },
              { title: "Verified Artists", desc: "ID-checked and background-verified" },
              { title: "Book at Home", desc: "Artist comes to you" },
            ].map(item => (
              <div key={item.title} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#22c55e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "10px", flexShrink: 0, marginTop: "2px" }}>✓</div>
                <div>
                  <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "13px" }}>{item.title}</p>
                  <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/booking" style={{ display: "block", background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, fontSize: "15px", textAlign: "center" }}>
            Book a Service - Free!
          </Link>
        </div>

        {/* Artist Plans */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontWeight: 900, margin: "0 0 6px", fontSize: "20px" }}>Artist Plans</h2>
          <p style={{ color: "#888", fontSize: "13px", margin: "0 0 20px" }}>Start free. Upgrade when you're ready.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            {[
              { name: "Free", price: "FREE", period: "forever", color: "#888", bg: "#f8f8f8", features: ["List your profile", "Accept bookings", "Up to 5 services", "Keep 90% earnings", "GCash payout"] },
              { name: "Pro", price: "P199", period: "/month", color: "#7C3AED", bg: "#F5F3FF", popular: true, features: ["Everything in Free", "Featured badge", "Priority placement", "Up to 20 services", "Verified Pro badge"] },
              { name: "Premium", price: "P399", period: "/month", color: "#E61D72", bg: "#FFF0F6", features: ["Everything in Pro", "TOP of homepage", "Unlimited services", "Custom banner", "Priority support"] },
            ].map((plan: any) => (
              <div key={plan.name} style={{ background: plan.bg, borderRadius: "16px", padding: "20px", border: plan.popular ? `2px solid ${plan.color}` : "2px solid transparent", position: "relative" }}>
                {plan.popular && <div style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: "#7C3AED", color: "#fff", padding: "3px 12px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, whiteSpace: "nowrap" }}>POPULAR</div>}
                <p style={{ fontWeight: 900, color: plan.color, margin: "0 0 4px", fontSize: "16px" }}>{plan.name}</p>
                <p style={{ fontWeight: 900, fontSize: "26px", color: "#333", margin: "0 0 2px" }}>{plan.price}</p>
                <p style={{ color: "#888", fontSize: "11px", margin: "0 0 14px" }}>{plan.period}</p>
                {plan.features.map((f: string) => (
                  <div key={f} style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                    <span style={{ color: plan.color, fontWeight: 700, fontSize: "11px", flexShrink: 0 }}>✓</span>
                    <span style={{ color: "#555", fontSize: "12px" }}>{f}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Why Serviko vs Competitors */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontWeight: 900, margin: "0 0 20px", fontSize: "20px", textAlign: "center" }}>Why Serviko?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
            {[
              { title: "vs MyKuya", desc: "We specialize in beauty and wellness with verified professional artists", color: "#E61D72" },
              { title: "vs Zennya", desc: "ALL services in one app — nails, hair, massage, cleaning, and repairs", color: "#7C3AED" },
              { title: "vs Parlon", desc: "We come to YOUR home. No need to travel to a salon", color: "#22c55e" },
              { title: "vs Serbilis", desc: "Beauty + wellness + home repairs all in one place", color: "#F59E0B" },
            ].map(item => (
              <div key={item.title} style={{ background: "#f8f8f8", borderRadius: "14px", padding: "16px", borderLeft: `4px solid ${item.color}` }}>
                <p style={{ fontWeight: 700, color: item.color, margin: "0 0 6px", fontSize: "14px" }}>{item.title}</p>
                <p style={{ color: "#555", fontSize: "12px", margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontWeight: 900, margin: "0 0 20px", fontSize: "20px" }}>FAQ</h2>
          {[
            { q: "Is it really free for customers?", a: "Yes! You only pay the artist's service rate. Serviko never charges customers a booking fee." },
            { q: "How do artists get paid?", a: "Artists receive 90% of every booking directly to their GCash account daily after completing the service." },
            { q: "Can I set my own prices?", a: "Yes! Artists set their own rates. You decide what you charge for each service." },
            { q: "How are artists verified?", a: "All artists submit a valid government ID and selfie. Our team reviews each application within 24 hours." },
            { q: "Can I cancel a booking?", a: "Yes, customers can cancel before the artist accepts. Once accepted, please contact the artist directly." },
            { q: "What areas does Serviko cover?", a: "We currently serve Metro Manila and nearby areas. Expanding soon nationwide!" },
          ].map((item, i) => (
            <div key={i} style={{ padding: "14px 0", borderBottom: i < 5 ? "1px solid #f0f0f0" : "none" }}>
              <p style={{ fontWeight: 700, margin: "0 0 6px", fontSize: "14px", color: "#333" }}>{item.q}</p>
              <p style={{ color: "#666", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>{item.a}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
