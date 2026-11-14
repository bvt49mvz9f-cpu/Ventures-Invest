"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { startups } from "@/lib/data";
import { fmtEur2, fmtPct } from "@/lib/format";
import Logo from "./Logo";
import { IconSearch, IconX, IconTrend } from "./Icons";

export default function SearchSheet({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const movers = useMemo(
    () =>
      startups
        .map((s) => ({ s, chg: s.sharePrice / s.prevSharePrice - 1 }))
        .filter((m) => m.chg !== 0)
        .sort((a, b) => Math.abs(b.chg) - Math.abs(a.chg))
        .slice(0, 6),
    []
  );

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return startups.filter((s) =>
      [s.name, s.sector, s.city, ...s.tags].some((f) => f.toLowerCase().includes(t))
    );
  }, [q]);

  const sectors = [...new Set(startups.map((s) => s.sector))];

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet glass" role="dialog" aria-label="Suche">
        <div className="grabber" />
        <div className="row">
          <label className="search-field glass" style={{ flex: 1 }}>
            <IconSearch size={18} className="muted" />
            <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Startups, Branchen, Städte" />
          </label>
          <button className="icon-btn glass" onClick={onClose} aria-label="Schließen"><IconX size={18} /></button>
        </div>

        {q ? (
          <div className="list glass" style={{ marginTop: 18 }}>
            {results.length === 0 && <div className="empty">Keine Treffer für „{q}“</div>}
            {results.map((s) => (
              <div key={s.id} className="list-item">
                <Logo s={s} />
                <div className="grow">
                  <div className="name">{s.name}</div>
                  <div className="sub">{s.sector} · {s.city}</div>
                </div>
                <div className="right">
                  <div className="val">{fmtEur2(s.sharePrice)}</div>
                  <div className="sub">je Anteil</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="section-head"><h2>Top Mover</h2><span>seit letzter Bewertung</span></div>
            <div className="movers">
              {movers.map(({ s, chg }) => (
                <button key={s.id} className="mover glass">
                  <Logo s={s} size={38} />
                  <div className="name">{s.name}</div>
                  <div className={`chg ${chg > 0 ? "pos" : "neg"}`}>{fmtPct(chg)}</div>
                  <div className="sub muted" style={{ fontSize: 12, marginTop: 2 }}>{fmtEur2(s.sharePrice)}</div>
                </button>
              ))}
            </div>

            <div className="section-head"><h2>Branchen</h2></div>
            <div className="opt-row">
              {sectors.map((x) => (
                <button key={x} className="fchip glass" onClick={() => setQ(x)}>{x}</button>
              ))}
            </div>

            <div className="section-head"><h2>Beliebt</h2></div>
            <div className="list glass">
              {startups.slice(0, 4).map((s) => (
                <button key={s.id} className="list-item" onClick={() => setQ(s.name)}>
                  <Logo s={s} />
                  <div className="grow">
                    <div className="name">{s.name}</div>
                    <div className="sub">{s.tagline}</div>
                  </div>
                  <IconTrend size={18} className="muted" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
