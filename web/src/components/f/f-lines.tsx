"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, RotateCcw } from "lucide-react";
import { useV3Robot } from "@/lib/v3/store";
import { FWindow } from "./f-window";

/** "What she says": see and change Stella's fixed spoken replies (and an optional style note for her smart brain). Pi: GET/POST /replies. */
type Row = { key: string; label: string; lines: string[]; default: string[]; edited: boolean };

export function FLines({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useV3Robot();
  const { robotUrl, connection } = state;
  const live = connection === "live" && !!robotUrl;
  const [rows, setRows] = useState<Row[] | null>(null);
  const [text, setText] = useState<Record<string, string>>({});
  const [persona, setPersona] = useState("");
  const [note, setNote] = useState<{ t: string; bad?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  const flash = (t: string, bad = false) => { setNote({ t, bad }); setTimeout(() => setNote(null), 2200); };

  const apply = useCallback((d: { lines: Row[]; persona: string }) => {
    setRows(d.lines);
    setText(Object.fromEntries(d.lines.map((r) => [r.key, r.lines.join("\n")])));
    setPersona(d.persona || "");
  }, []);

  useEffect(() => {
    if (!open || !live) return;
    let stop = false;
    fetch(`${robotUrl}/replies`).then((r) => (r.ok ? r.json() : Promise.reject())).then((d) => { if (!stop) apply(d); })
      .catch(() => { if (!stop) { setRows(null); flash("Couldn't reach Stella (update the Pi code first)", true); } });
    return () => { stop = true; };
  }, [open, live, robotUrl, apply]);

  const save = async () => {
    if (!rows) return;
    setBusy(true);
    const body: Record<string, string[] | string> = { _persona: persona };
    for (const r of rows) body[r.key] = text[r.key].split("\n").map((x) => x.trim()).filter(Boolean);
    try {
      const res = await fetch(`${robotUrl}/replies`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      apply(await res.json());
      flash("Saved. She'll use it on her next reply");
    } catch { flash("Couldn't save", true); }
    setBusy(false);
  };

  const hear = async (key: string) => {
    const lines = (text[key] || "").split("\n").map((x) => x.trim()).filter(Boolean);
    if (!lines.length) return;
    const line = lines[Math.floor(Math.random() * lines.length)].replace("{b}", "80");
    try { await fetch(`${robotUrl}/speak`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: line }) }); }
    catch { flash("Couldn't reach Stella", true); }
  };

  return (
    <FWindow open={open} onClose={onClose} title="What she says" subtitle={live ? "One line per reply. She picks one at random." : "Connect to the tailnet to edit"}>
      <div className="fl">
        <div className="fl-note" data-bad={note?.bad ? "1" : "0"} aria-live="polite">{note?.t ?? " "}</div>
        {!live && <p className="fl-hint">Open the dashboard on your tailnet to see and change her lines.</p>}
        {live && rows && (
          <>
            <div className="fl-card">
              <div className="fl-h"><b>Style for her smart brain</b></div>
              <textarea className="fl-ta" rows={2} maxLength={300} value={persona} placeholder="e.g. Talk a bit more like a southern grandma. Keep it short." onChange={(e) => setPersona(e.target.value)} />
              <div className="fl-s">Only changes how Claude phrases things. It can never change what she's allowed to do.</div>
            </div>
            {rows.map((r) => (
              <div className="fl-card" key={r.key}>
                <div className="fl-h">
                  <b>{r.label}</b>
                  <span className="fl-btns">
                    <button type="button" aria-label="Hear one" onClick={() => hear(r.key)}><Volume2 size={15} /></button>
                    <button type="button" aria-label="Reset to default" onClick={() => setText({ ...text, [r.key]: r.default.join("\n") })}><RotateCcw size={15} /></button>
                  </span>
                </div>
                <textarea className="fl-ta" rows={Math.min(6, Math.max(2, text[r.key]?.split("\n").length || 2))} value={text[r.key] ?? ""} onChange={(e) => setText({ ...text, [r.key]: e.target.value })} />
              </div>
            ))}
            <button type="button" className="fl-save" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save"}</button>
          </>
        )}
      </div>
    </FWindow>
  );
}
