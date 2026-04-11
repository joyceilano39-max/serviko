import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div style={{minHeight:"100vh",background:"#FFF0F6",padding:"32px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"32px"}}>
        <h1 style={{fontSize:"32px",fontWeight:"900",color:"#E61D72"}}>🌸 Serviko</h1>
        <UserButton />
      </div>
      <h2 style={{fontSize:"24px",fontWeight:"700",marginBottom:"8px"}}>Welcome to Serviko! 🎉</h2>
      <p style={{color:"#888"}}>You are now signed in! 🌸</p>
    </div>
  );
}