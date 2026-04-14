"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/tracking");
    }, 3000);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", background: "#fff", borderRadius: "24px", padding: "48px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", maxWidth: "400px" }}>
        <div style={{ fontSize: "72px", marginBottom: "16px" }}>✅</div>
        <h1 style={{ fontWeight: 900, color: "#22c55e", margin: "0 0 8px" }}>Payment Successful!</h1>
        <p style={{ color: "#888", margin: "0 0 24px" }}>Redirecting to tracking page...</p>
        <a href="/tracking" style={{ background: "#E61D72", color: "#fff", padding: "12px 32px", borderRadius: "20px", textDecoration: "none", fontWeight: 700 }}>
          Track My Booking →
        </a>
      </div>
    </div>
  );
}