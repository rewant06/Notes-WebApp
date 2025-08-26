"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, ensureCsrf } from "@/lib/api";

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [title,setTitle] = useState(""); const [content,setContent]=useState("");

  useEffect(()=>{ (async()=>{
    await ensureCsrf();
    const res = await api.get(`/notes/${id}`);
    setTitle(res.data.note_title); setContent(res.data.note_content);
  })(); }, [id]);

  async function save() {
    await api.put(`/notes/${id}`, { note_title: title, note_content: content });
    router.push("/");
  }
  async function del() {
    await api.delete(`/notes/${id}`);
    router.push("/");
  }

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="modal w-full max-w-2xl">
        <input className="input mb-3" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="input h-56" value={content} onChange={e=>setContent(e.target.value)} />
        <div className="flex gap-3 mt-4">
          <button className="btn btn-primary" onClick={save}>Save</button>
          <button className="btn btn-secondary" onClick={del}>Delete</button>
        </div>
      </div>
    </div>
  );
}