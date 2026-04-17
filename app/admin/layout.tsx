"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const ADMIN_EMAILS = [
  "penasjoyce5@gmail.com",
  "irinasamanthaipenas@gmail.com",
  "joycepenas39@gmail.com",
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) { setStatus("no-user"); return; }
    const email = user.emailAddresses[0]?.emailAddress?.toLowerCase().trim() || "";
    const isAdmin = ADMIN_EMAILS.map(e => e.toLowerCase().trim()).includes(email);
    setStatus(isAdmin ? "allowed" : "denied");
  }, [user, isLoaded]);

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif" }}>
        <p style={{ color: "#888" }}>Loading admin...</p>
      </div>
    );
  }

  if (status === "no-user") {
    if (typeof window !== "undefined") window.location.href = "/sign-in";
    return null;
  }

  if (status === "denied") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "48px 32px", textAlign: "center", maxWidth: "400px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontWeight: 900, margin: "0 0 8px", color: "#f87171" }}>Access Denied</h2>
          <p style={{ color: "#888", margin: "0 0 20px", fontSize: "13px" }}>You do not have permission.</p>
          <a href="/" style={{ display: "block", background: "#E61D72", color: "#fff", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: 700 }}>Back to Home</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
