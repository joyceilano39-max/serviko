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
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.replace("/sign-in?redirect_url=/admin");
      return;
    }
    const email = user.emailAddresses[0]?.emailAddress || "";
    setUserEmail(email);
    if (ADMIN_EMAILS.includes(email)) {
      setAllowed(true);
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
          <h2 style={{ fontWeight: 900, margin: "0 0 8px", color: "#f87171" }}>Access Denied</h2>
          <p style={{ color: "#888", margin: "0 0 8px", fontSize: "13px" }}>Your email: <strong>{userEmail || "not detected"}</strong></p>
          <p style={{ color: "#888", margin: "0 0 20px", fontSize: "13px" }}>Required: penasjoyce5@gmail.com</p>
          <a href="/" style={{ display: "block", background: "#E61D72", color: "#fff", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: 700 }}>Back to Home</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
