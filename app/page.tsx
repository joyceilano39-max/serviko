"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main style={{minHeight:"100vh",background:"#FFF0F6",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <div style={{textAlign:"center"}}>
        <h1 style={{fontSize:"36px",fontWeight:"900",color:"#E61D72",marginBottom:"8px"}}>Serviko</h1>
        <p style={{color:"#888",marginBottom:"32px"}}>Book trusted home services in Metro Manila</p>
        <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
          <button onClick={()=>router.push("/sign-up")} style={{background:"#E61D72",color:"white",padding:"12px 32px",borderRadius:"99px",fontWeight:"600",border:"none",cursor:"pointer",fontSize:"16px"}}>Get Started</button>
          <button onClick={()=>router.push("/sign-in")} style={{border:"2px solid #E61D72",color:"#E61D72",padding:"12px 32px",borderRadius:"99px",fontWeight:"600",background:"white",cursor:"pointer",fontSize:"16px"}}>Sign In</button>
        </div>
      </div>
    </main>
  );
}