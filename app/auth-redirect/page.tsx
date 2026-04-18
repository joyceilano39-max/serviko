"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirectPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) { router.push("/sign-in"); return; }
    const email = user.emailAddresses[0]?.emailAddress;
    fetch(`/api/auth/role?email=${email}`)
      .then(r => r.json())
      .then(data => {
        if (data.role === "artist") router.push("/artist-dashboard");
        else router.push("/dashboard");
      })
      .catch(() => router.push("/dashboard"));
  }, [isLoaded, user]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif", background: "#FFF0F6" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(135deg, #E61D72, #7C3AED)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: "24px" }}>S</div>
        <p style={{ color: "#888", fontSize: "14px" }}>Signing you in...</p>
      </div>
    </div>
  );
}
