import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <UserProfile />
    </div>
  );
}
