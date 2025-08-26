"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/lib/store/auth";

export default function Navbar() {
  const { user, fetchMe, signOut } = useAuth();
  useEffect(() => { fetchMe(); }, []);

  return (
    <div className="w-full bg-accent text-black px-6 py-3 flex justify-between">
      <div className="font-semibold">
        <Link href="/">Keep Notes</Link>
      </div>
      <nav className="space-x-6 text-sm opacity-90">
        <Link className="font-semibold" href="/">Notes</Link>
        {user ? (
          <button className="font-semibold" onClick={() => signOut()}>Logout</button>
        ) : (
          <>
            <Link className="" href="/signin">Login</Link>
            <Link className="" href="/signup">Register</Link>
          </>
        )}
      </nav>
    </div>
  );
}
