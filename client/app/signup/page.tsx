"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/auth";
import { useState } from "react";

export default function SignUp() {
  const r = useRouter();
  const { signUp } = useAuth();
  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPwd] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signUp(username, email, password);
    r.push("/signin");
  }

  return (
    <div className="min-h-[70vh] grid place-items-center">
       <form onSubmit={onSubmit} className="modal w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Sign up</h2>
        <input className="input mb-3" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="input mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input mb-6" type="password" placeholder="Password" value={password} onChange={e=>setPwd(e.target.value)} />
        <div className="flex gap-3">
          <button className="btn btn-primary" type="submit">Register</button>
          <a className="btn btn-secondary" href="/signin">Login</a>
        </div>
      </form>
    </div>
  );
}