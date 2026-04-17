"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) { 
      if (typeof window !== "undefined") window.location.href = "/sign-in";
      return; 
    }
    setStatus("allowed");
  }, [user, isLoaded]);

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif" }}>
        <p style={{ color: "#888" }}>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
