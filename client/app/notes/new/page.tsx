"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, ensureCsrf } from "@/lib/api";

export default function NewNote() {
  const r = useRouter();
  const [title,setTitle] = useState(""); const [content,setContent]=useState("");
  useEffect(()=>{ ensureCsrf(); },[]);
  async function add() {
    await api.post("/notes/", { note_title: title, note_content: content });
    r.push("/");
  }
  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="modal w-full max-w-2xl">
        <h2 className="text-xl mb-3">Add Notes</h2>
        <input className="input mb-3" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="input h-56" placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} />
        <div className="flex gap-3 mt-4">
          <button className="btn btn-primary" onClick={add}>Add</button>
          <a className="btn btn-secondary" href="/">Cancel</a>
        </div>
      </div>
    </div>
  );
}