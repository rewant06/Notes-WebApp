"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ensureCsrf } from "@/lib/api";
import { useAuth } from "@/lib/store/auth";

type Note = { note_id: string; note_title: string; note_content: string; last_update: string; };

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, fetchMe } = useAuth();
  useEffect(() => { fetchMe(); }, []); 


  const getISTGreeting = () => {
    const now = new Date();
    const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const istDate = new Date(istString);
    const hour = istDate.getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };
  const greeting = getISTGreeting();

  useEffect(() => {
    (async () => {
      await ensureCsrf();
      try {
        const res = await api.get("/notes/");
        setNotes(res.data.items || []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  return (
    <div>
  <h1 className="text-4xl font-bold my-8 text-[#7B3F00]">{greeting}{user?.name ? ` ${user.name}` : ""}!</h1>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {notes.map(n => (
            <div key={n.note_id} className="card">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">{n.note_title}</div>
        <Link className="text-cyan" href={`/notes/${n.note_id}`}>✎</Link>
              </div>
              <p className="text-sm opacity-80">{n.note_content}</p>
              <div className="text-xs opacity-60 mt-3">Last modified: {new Date(n.last_update).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
  <Link href="/notes/new" className="fixed bottom-6 right-6 btn btn-secondary rounded-full w-12 h-12 flex items-center justify-center">+</Link>
    </div>
  );
}