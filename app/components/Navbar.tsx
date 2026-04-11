Set-Content app/dashboard/page.tsx @"
import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const bookings = [
  { id: 1, service: "Haircut & Styling", date: "April 15, 2026", time: "10:00 AM", status: "Upcoming", price: 500 },
  { id: 2, service: "Full Body Massage", date: "April 10, 2026", time: "2:00 PM", status: "Completed", price: 800 },
  { id: 3, service: "Facial Treatment", date: "March 28, 2026", time: "11:00 AM", status: "Cancelled", price: 650 },
];

const statusColor: Record<string, string> = {
  Upcoming: "color:#3b82f6;background:#eff6ff",
  Completed: "color:#22c55e;background:#f0fdf4",
  Cancelled: "color:#f87171;background:#fef2f2",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", padding: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <img src={user?.imageUrl} alt="Profile" style={{ width: "56px", height: "56px", borderRadius: "50%" }} />
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, margin: 0 }}>Welcome back, {user?.firstName}!</h2>
          <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Here are your bookings</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "16px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: "24px", fontWeight: 700, color: "#3b82f6", margin: 0 }}>1</p>
          <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Upcoming</p>
        </div>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "16px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: "24px", fontWeight: 700, color: "#22c55e", margin: 0 }}>1</p>
          <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Completed</p>
        </div>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "16px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: "24px", fontWeight: 700, color: "#f87171", margin: 0 }}>1</p>
          <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Cancelled</p>
        </div>
      </div>

      <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>My Bookings</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {bookings.map((booking) => (
          <div key={booking.id} style={{ background: "#fff", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div>
              <p style={{ fontWeight: 600, margin: 0 }}>{booking.service}</p>
              <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{booking.date} at {booking.time}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "999px", fontWeight: 500, ...Object.fromEntries(statusColor[booking.status].split(";").map(s => s.split(":"))) }}>
                {booking.status}
              </span>
              <span style={{ fontWeight: 700, color: "#E61D72" }}>P{booking.price}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "32px", textAlign: "center" }}>
        <a href="/services" style={{ background: "#E61D72", color: "#fff", padding: "12px 24px", borderRadius: "12px", textDecoration: "none", fontWeight: 600 }}>
          Book a Service
        </a>
      </div>
    </div>
  );
}
"@