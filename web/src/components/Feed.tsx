"use client";

import { useEffect, useState } from "react";
import { byId, posts, reels, type Post, type Startup } from "@/lib/data";
import { fmtCompact } from "@/lib/format";
import Logo, { Orbs } from "./Logo";
import Portal from "./Portal";
import { IconArrowUpRight, IconChat, IconHeart, IconPlayFilled, IconShare, IconX } from "./Icons";

export default function Feed() {
  const [mode, setMode] = useState<"posts" | "reels">("posts");
  const [video, setVideo] = useState<Startup | null>(null);

  return (
    <>
      <header className="head">
        <div className="head-tabs">
          <button aria-pressed={mode === "posts"} onClick={() => setMode("posts")}>Beiträge</button>
          <button aria-pressed={mode === "reels"} onClick={() => setMode("reels")}>Reels</button>
        </div>
      </header>

      {mode === "posts"
        ? <div>{posts.map((p) => <PostItem key={p.id} p={p} onPlay={() => setVideo(byId(p.startupId))} />)}</div>
        : <Reels />}

      {video && <Portal><VideoModal s={video} onClose={() => setVideo(null)} /></Portal>}
    </>
  );
}

function PostItem({ p, onPlay }: { p: Post; onPlay: () => void }) {
  const s = byId(p.startupId);
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const long = p.text.length > 160;
  const text = long && !expanded ? p.text.slice(0, 150).trimEnd() + "… " : p.text;

  return (
    <article className="post">
      <div className="post-head">
        <Logo s={s} size={40} />
        <div className="who">
          <div className="n">{s.name}</div>
          <div className="m">{s.sector} · {s.stage} · {p.ago}</div>
        </div>
      </div>

      <p className="post-text">
        {text}
        {long && !expanded && <button className="more" onClick={() => setExpanded(true)}>mehr</button>}
      </p>

      {p.media && (
        <div className="media">
          <Orbs hue={s.hue} />
          {p.media.kind === "video" && (
            <button className="play glass" onClick={onPlay} aria-label="Video abspielen"><IconPlayFilled size={20} style={{ marginLeft: 3 }} /></button>
          )}
          <span className="cap">{p.media.caption}</span>
          {p.media.length && <span className="len">{p.media.length}</span>}
        </div>
      )}

      <div className="post-actions">
        <button className={liked ? "liked" : ""} onClick={() => setLiked(!liked)} aria-pressed={liked}><IconHeart size={19} />{p.likes + (liked ? 1 : 0)}</button>
        <button><IconChat size={18} />{p.comments}</button>
        <button aria-label="Teilen"><IconShare size={18} /></button>
        {s.round?.open && <button className="invest">Investieren <IconArrowUpRight size={16} /></button>}
      </div>
    </article>
  );
}

function Reels() {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  return (
    <div className="reels">
      {reels.map((r) => {
        const s = byId(r.startupId);
        const on = !!liked[r.id];
        return (
          <article key={r.id} className="reel">
            <Orbs hue={s.hue} big />
            <div className="reel-progress"><span /></div>
            <span className="reel-kind">{r.kind}</span>
            <div className="reel-info">
              <div className="row"><Logo s={s} size={34} /><strong style={{ fontSize: 14.5 }}>{s.name}</strong></div>
              <h3>{r.title}</h3>
              <p>{r.caption}</p>
            </div>
            <div className="reel-side">
              <div>
                <button className={`round-btn glass ${on ? "liked" : ""}`} onClick={() => setLiked({ ...liked, [r.id]: !on })} aria-label="Gefällt mir" aria-pressed={on}><IconHeart size={22} /></button>
                <small>{fmtCompact(r.likes + (on ? 1 : 0))}</small>
              </div>
              <div><button className="round-btn glass" aria-label="Kommentare"><IconChat size={21} /></button><small>{r.comments}</small></div>
              <div><button className="round-btn glass" aria-label="Teilen"><IconShare size={21} /></button></div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function VideoModal({ s, onClose }: { s: Startup; onClose: () => void }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => (x >= 100 ? 0 : x + 0.5)), 80);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => { clearInterval(id); window.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <div className="modal" onClick={onClose}>
      <div className="player" onClick={(e) => e.stopPropagation()}>
        <Orbs hue={s.hue} big />
        <button className="round-btn glass" style={{ position: "absolute", top: 14, right: 14, zIndex: 3 }} onClick={onClose} aria-label="Schließen"><IconX size={18} /></button>
        <div className="reel-info" style={{ bottom: 60, right: 16 }}>
          <div className="row"><Logo s={s} size={34} /><strong>{s.name}</strong></div>
          <h3>Vorstellungsvideo</h3>
          <p>Platzhalter – hier läuft später das echte Video des Startups.</p>
        </div>
        <div className="player-ui">
          <IconPlayFilled size={16} />
          <div className="progress"><span style={{ width: `${t}%` }} /></div>
          <span>{s.videoLength}</span>
        </div>
      </div>
    </div>
  );
}
