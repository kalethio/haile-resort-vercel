// app/admin/6emailMarketing/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Subscriber } from "@/app/data/subscriber";

export default function EmailMarketingAdmin() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/subscribers");
      if (!res.ok) throw new Error("Failed to load subscribers");
      const data: Subscriber[] = await res.json();
      setSubs(data);
      const sel: Record<string, boolean> = {};
      data.forEach((s) => (sel[s.id] = false));
      setSelected(sel);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function toggle(id: string) {
    setSelected((p) => ({ ...p, [id]: !p[id] }));
  }

  async function remove(id: string) {
    if (!confirm("Delete this subscriber?")) return;
    const res = await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
    if (res.ok) {
      await load();
    } else {
      alert("Delete failed");
    }
  }

  async function sendCampaign() {
    if (!subject || !html) {
      alert("Subject and message are required");
      return;
    }
    setSending(true);
    setMessage(null);

    const targetIds = Object.keys(selected).filter((id) => selected[id]);

    try {
      const res = await fetch("/api/subscribers/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, html, targetIds }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Send failed");
      setMessage(payload.message || "Campaign sent/simulated");
      // optional: reload campaigns or subscribers
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Send failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Email Marketing — Subscribers</h1>

      <div className="mb-6">
        <div className="bg-white border rounded p-4">
          <h2 className="font-semibold mb-2">Compose Campaign</h2>
          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <textarea
            placeholder="HTML message (or plain text)"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={6}
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={sendCampaign}
              disabled={sending}
              className="bg-primary text-white px-4 py-2 rounded"
            >
              {sending ? "Sending..." : "Send to selected"}
            </button>
            <button
              onClick={() =>
                setSelected(Object.fromEntries(subs.map((s) => [s.id, true])))
              }
              className="px-4 py-2 border rounded"
            >
              Select All
            </button>
            <button
              onClick={() =>
                setSelected(Object.fromEntries(subs.map((s) => [s.id, false])))
              }
              className="px-4 py-2 border rounded"
            >
              Clear Selection
            </button>
          </div>
          {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold mb-2">Subscribers ({subs.length})</h2>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-2">
            {subs.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between border-b py-2"
              >
                <div>
                  <div className="font-medium">{s.name || s.email}</div>
                  <div className="text-xs text-gray-500">{s.email}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(s.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!selected[s.id]}
                    onChange={() => toggle(s.id)}
                  />
                  <button
                    onClick={() => remove(s.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
