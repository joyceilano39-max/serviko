import { currentUser } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  const user = await currentUser();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-pink-500 mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        {/* Profile Photo */}
        <div className="flex items-center gap-4">
          <img
            src={user?.imageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <p className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-gray-500 text-sm">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Phone</p>
            <p>{user?.phoneNumbers[0]?.phoneNumber || "Not set"}</p>
          </div>
          <div>
            <p className="text-gray-400">Member since</p>
            <p>{new Date(user?.createdAt!).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Booking History placeholder */}
        <div className="border-t pt-4">
          <p className="text-gray-400 text-sm mb-2">Booking History</p>
          <p className="text-gray-400 italic text-sm">No bookings yet.</p>
        </div>
      </div>
    </div>
  );
}