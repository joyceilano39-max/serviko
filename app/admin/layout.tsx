"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_EMAILS = [
  "penasjoyce5@gmail.com",
  "irinasamanthaipenas@gmail.com",
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.replace("/sign-in?redirect_url=/admin");
      return;
    }
    const email = user.emailAddresses[0]?.emailAddress;
    if (ADMIN_EMAILS.includes(email)) {
      setAllowed(true);
    } else {
      router.replace("/");
    }
  }, [user, isLoaded]);

  if (!isLoaded) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif" }}>
        <p style={{ color: "#888" }}>Checking access...</p>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "48px 32px", textAlign: "center", maxWidth: "400px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#FEF2F2", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#f87171", fontSize: "24px" }}>!</div>
          <h2 style={{ fontWeight: 900, margin: "0 0 8px", color: "#f87171" }}>Access Denied</h2>
          <p style={{ color: "#888", margin: "0 0 20px", fontSize: "13px" }}>You do not have permission to access this page.</p>
          <a href="/" style={{ display: "block", background: "#E61D72", color: "#fff", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: 700 }}>Back to Home</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
