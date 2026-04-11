import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const bookings = [
  {
    id: 1,
    service: "Haircut & Styling",
    date: "April 15, 2026",
    time: "10:00 AM",
    status: "Upcoming",
    price: 500,
    emoji: "✂️",
  },
  {
    id: 2,
    service: "Full Body Massage",
    date: "April 10, 2026",
    time: "2:00 PM",
    status: "Completed",
    price: 800,
    emoji: "💆",
  },
  {
    id: 3,
    service: "Facial Treatment",
    date: "March 28, 2026",
    time: "11:00 AM",
    status: "Cancelled",
    price: 650,
    emoji: "🧖",
  },
];

const statusColor: Record<string, string> = {
  Upcoming: "bg-blue-100 text-blue-500",
  Completed: "bg-green-100 text-green-500",
  Cancelled: "bg-red-100 text-red-400",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", padding: "32px" }}>
      {/* Top Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#E61D72" }}>🌸 Serviko</h1>
        <UserButton />
      </div>

      {/* Welcome */}
      <div className="flex items-center gap-4 mb-8">
        <img src={user?.imageUrl} alt="Profile" className="w-14 h-14 rounded-full object-cover" />
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {user?.firstName}! 🌸</h2>
          <p className="text-gray-400 text-sm">Here are your bookings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">1</p>
          <p className="text-gray-400 text-sm">Upcoming</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-500">1</p>
          <p className="text-gray-400 text-sm">Completed</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-red-400">1</p>
          <p className="text-gray-400 text-sm">Cancelled</p>
        </div>
      </div>

      {/* Bookings List */}
      <h2 className="text-lg font-semibold mb-4">My Bookings</h2>
      <div className="flex flex-col gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-2xl shadow p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{booking.emoji}</div>
              <div>
                <p className="font-semibold">{booking.service}</p>
                <p className="text-gray-400 text-sm">{booking.date} at {booking.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[booking.status]}`}>
                {booking.status}
              </span>
              <span className="font-bold text-pink-500">₱{booking.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Book More */}
      <div className="mt-8 text-center">
        <a href="/services" className="bg-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-600 transition">
          Book a Service
        </a>
      </div>
    </div>
  );
}