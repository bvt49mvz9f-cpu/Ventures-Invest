"use client";

import { useEffect, useState } from "react";
import { byId, reels, startups, type Startup } from "@/lib/data";
import { fmtCompact, fmtEur, fmtMio } from "@/lib/format";
import Logo, { Orbs } from "./Logo";
import Portal from "./Portal";
import { IconBookmark, IconChat, IconHeart, IconPin, IconPlayFilled, IconShare, IconUsers, IconVolume, IconX } from "./Icons";

export default function Feed() {
  const [mode, setMode] = useState<"startups" | "reels">("startups");
  const [video, setVideo] = useState<Startup | null>(null);

  return (
    <>
      <header className="topbar">
        <div className="brand">Feed</div>
        <div className="segmented glass" style={{ width: 200 }}>
          <span className="ind glass glass-strong" style={{ transform: `translateX(${mode === "reels" ? 100 : 0}%)` }} />
          <button aria-pressed={mode === "startups"} onClick={() => setMode("startups")}>Startups</button>
          <button aria-pressed={mode === "reels"} onClick={() => setMode("reels")}>Reels</button>
        </div>
      </header>

      {mode === "startups" ? (
        <div>
          {startups.map((s) => <Post key={s.id} s={s} onPlay={() => setVideo(s)} />)}
        </div>
      ) : (
        <Reels />
      )}

      {video && <Portal><VideoModal s={video} onClose={() => setVideo(null)} /></Portal>}
    </>
  );
}

function Post({ s, onPlay }: { s: Startup; onPlay: () => void }) {
  const [saved, setSaved] = useState(false);
  return (
    <article className="post glass">
      <div className="cover">
        <Orbs hue={s.hue} />
        <button className="play-btn glass glass-strong" onClick={onPlay} aria-label={`Vorstellungsvideo von ${s.name} abspielen`}>
          <IconPlayFilled size={22} style={{ marginLeft: 3 }} />
        </button>
        <div className="cover-meta">
          <div className="row">
            <Logo s={s} size={36} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14.5 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>{s.sector} · {s.stage}</div>
            </div>
          </div>
          <span className="chip glass">{s.videoLength}</span>
        </div>
      </div>
      <div className="post-body">
        <div className="hi">Hi, wir sind {s.name}.</div>
        <p>{s.intro}</p>
        <div className="tags">
          <span className="tag row" style={{ gap: 4 }}><IconPin size={12} />{s.city}</span>
          <span className="tag row" style={{ gap: 4 }}><IconUsers size={12} />{s.team} Personen</span>
          {s.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
        {s.round?.open && (
          <div className="round">
            <div className="row" style={{ justifyContent: "space-between", fontSize: 13 }}>
              <span>{s.round.name} <span className="muted">{s.round.startsOrEnds}</span></span>
              <span className="muted">{s.round.filled > 0 ? `${Math.round(s.round.filled * 100)} % vergeben` : "bald"}</span>
            </div>
            <div className={`bar ${s.round.filled > 0.8 ? "accent" : ""}`}><span style={{ width: `${s.round.filled * 100}%` }} /></div>
            <div className="row muted" style={{ justifyContent: "space-between", fontSize: 12, marginTop: 8 }}>
              <span>Bewertung {fmtMio(s.valuation)}</span>
              <span>ab {fmtEur(s.round.minTicket)}</span>
            </div>
          </div>
        )}
        <div className="post-actions">
          <button className="btn btn-primary grow">{s.round?.open ? "Jetzt investieren" : "Profil ansehen"}</button>
          <button className="icon-btn glass" style={{ width: 46, height: 46, color: saved ? "var(--accent)" : undefined }} onClick={() => setSaved(!saved)} aria-label="Merken" aria-pressed={saved}>
            <IconBookmark size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
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
          <article key={r.id} className="reel glass">
            <div className="reel-bg"><Orbs hue={s.hue} big /></div>
            <div className="reel-progress"><span /></div>
            <span className="chip glass reel-kind">{r.kind}</span>
            <div className="reel-center">
              <div className="play-btn glass" style={{ opacity: 0.85 }}><IconVolume size={22} /></div>
            </div>
            <div className="reel-info">
              <div className="row"><Logo s={s} size={34} /><strong style={{ fontSize: 14.5 }}>{s.name}</strong></div>
              <h3>{r.title}</h3>
              <p>{r.caption}</p>
            </div>
            <div className="reel-side">
              <div>
                <button className={`icon-btn glass ${on ? "liked" : ""}`} onClick={() => setLiked({ ...liked, [r.id]: !on })} aria-label="Gefällt mir" aria-pressed={on}><IconHeart size={22} /></button>
                <small>{fmtCompact(r.likes + (on ? 1 : 0))}</small>
              </div>
              <div><button className="icon-btn glass" aria-label="Kommentare"><IconChat size={21} /></button><small>{r.comments}</small></div>
              <div><button className="icon-btn glass" aria-label="Teilen"><IconShare size={21} /></button></div>
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
      <div className="player glass" onClick={(e) => e.stopPropagation()}>
        <div className="reel-bg"><Orbs hue={s.hue} big /></div>
        <button className="icon-btn glass" style={{ position: "absolute", top: 14, right: 14, zIndex: 3 }} onClick={onClose} aria-label="Schließen"><IconX size={18} /></button>
        <div className="reel-info" style={{ bottom: 70, right: 16 }}>
          <div className="row"><Logo s={s} size={34} /><strong>{s.name}</strong></div>
          <h3>Vorstellungsvideo</h3>
          <p>Platzhalter – hier läuft später das echte Video des Startups.</p>
        </div>
        <div className="player-ui">
          <IconPlayFilled size={18} />
          <div className="bar"><span style={{ width: `${t}%` }} /></div>
          <span style={{ fontSize: 12 }}>{s.videoLength}</span>
        </div>
      </div>
    </div>
  );
}
