import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <main style={{minHeight:'100vh',background:'#FFF0F6',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <SignIn />
    </main>
  );
}