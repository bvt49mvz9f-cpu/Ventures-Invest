"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { startups } from "@/lib/data";
import { fmtEur2, fmtPct } from "@/lib/format";
import Logo from "./Logo";
import { IconSearch } from "./Icons";

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
        .sort((a, b) => b.chg - a.chg),
    []
  );

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return startups.filter((s) => [s.name, s.sector, s.city, ...s.tags].some((f) => f.toLowerCase().includes(t)));
  }, [q]);

  const sectors = [...new Set(startups.map((s) => s.sector))];

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label="Suche">
        <div className="grabber" />
        <div className="row">
          <label className="field glass" style={{ flex: 1 }}>
            <IconSearch size={18} className="muted" />
            <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Startups, Branchen, Städte" />
          </label>
          <button className="muted" style={{ fontSize: 15, padding: "0 4px" }} onClick={onClose}>Abbrechen</button>
        </div>

        {q ? (
          <div className="list" style={{ marginTop: 12 }}>
            {results.length === 0 && <div className="empty">Keine Treffer für „{q}“</div>}
            {results.map((s) => (
              <div key={s.id} className="item">
                <Logo s={s} />
                <div className="grow"><div className="name">{s.name}</div><div className="sub">{s.sector} · {s.city}</div></div>
                <div className="right"><div className="val">{fmtEur2(s.sharePrice)}</div><div className="sub">je Anteil</div></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="section" style={{ marginTop: 28 }}>
              <div className="section-head"><h2 className="h2">Top Mover</h2><span className="link">seit letzter Runde</span></div>
              <div className="movers">
                {movers.map(({ s, chg }) => (
                  <button key={s.id} className="mover" onClick={() => setQ(s.name)}>
                    <Logo s={s} size={56} />
                    <span className="n">{s.name}</span>
                    <span className={`c ${chg > 0 ? "pos" : "neg"}`}>{fmtPct(chg)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="section" style={{ marginTop: 30 }}>
              <div className="section-head"><h2 className="h2">Branchen</h2></div>
              <div className="pills" style={{ flexWrap: "wrap" }}>
                {sectors.map((x) => <button key={x} className="pill" onClick={() => setQ(x)}>{x}</button>)}
              </div>
            </div>

            <div className="section" style={{ marginTop: 30 }}>
              <div className="section-head"><h2 className="h2">Beliebt</h2></div>
              <div className="list">
                {startups.slice(0, 5).map((s) => (
                  <button key={s.id} className="item" onClick={() => setQ(s.name)}>
                    <Logo s={s} />
                    <div className="grow"><div className="name">{s.name}</div><div className="sub">{s.tagline}</div></div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
