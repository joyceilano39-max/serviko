"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [count, setCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/tracking");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: "#fff", borderRadius: "24px", padding: "48px 32px", textAlign: "center", maxWidth: "400px", width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: "72px", marginBottom: "16px" }}>✅</div>
        <h1 style={{ fontWeight: 900, color: "#22c55e", margin: "0 0 8px" }}>Payment Successful!</h1>
        <p style={{ color: "#888", margin: "0 0 8px" }}>Your booking is confirmed!</p>
        <p style={{ color: "#E61D72", fontWeight: 700, fontSize: "18px", margin: "0 0 24px" }}>Redirecting in {count}...</p>
        <div style={{ width: "100%", height: "6px", background: "#eee", borderRadius: "4px", overflow: "hidden", marginBottom: "24px" }}>
          <div style={{ height: "100%", background: "#22c55e", borderRadius: "4px", transition: "width 1s linear", width: `${((3 - count) / 3) * 100}%` }} />
        </div>
        <a href="/tracking" style={{ display: "block", background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, fontSize: "15px", marginBottom: "10px" }}>
          📍 Track My Booking Now
        </a>
        <a href="/dashboard" style={{ display: "block", background: "#f0f0f0", color: "#555", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}