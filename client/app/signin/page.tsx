"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/store/auth";

export default function SignIn() {
  const r = useRouter();
  const { signIn, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signIn(email, password);
    r.push("/");
  }

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <form onSubmit={onSubmit} className="modal w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <input className="input mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input mb-6" type="password" placeholder="Password" value={password} onChange={e=>setPwd(e.target.value)} />
        {error && <div className="text-red-400 text-sm mb-3">{error}</div>}
        <div className="flex gap-3">
          <button className="btn btn-primary" type="submit">Login</button>
          <a className="btn btn-secondary" href="/signup">Register</a>
        </div>
      </form>
    </div>
  );
}