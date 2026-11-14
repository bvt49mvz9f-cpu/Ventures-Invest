"use client";

import { useMemo, useState } from "react";
import { byId, positions, startups } from "@/lib/data";
import { fmtDate, fmtEur, fmtEur2, fmtPct } from "@/lib/format";
import Bubbles from "./Bubbles";
import Logo from "./Logo";
import SearchSheet from "./SearchSheet";
import Portal from "./Portal";
import { IconArrowUpRight, IconSearch, IconSparkle, IconX } from "./Icons";

export default function Portfolio({ onOpenScreening }: { onOpenScreening: () => void }) {
  const [search, setSearch] = useState(false);
  const [banner, setBanner] = useState(true);

  const rows = useMemo(
    () =>
      positions
        .map((p) => {
          const s = byId(p.startupId);
          const value = p.shares * s.sharePrice;
          return { ...p, s, value, chg: value / p.invested - 1 };
        })
        .sort((a, b) => b.value - a.value),
    []
  );

  const total = rows.reduce((a, r) => a + r.value, 0);
  const invested = rows.reduce((a, r) => a + r.invested, 0);
  const diff = total - invested;
  const lastUpdate = rows.map((r) => r.s.lastValuationDate).sort().at(-1)!;
  const openRounds = startups.filter((s) => s.round?.open).length;

  const allocation = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.s.sector, (m.get(r.s.sector) ?? 0) + r.value));
    return [...m].map(([label, v]) => ({ label, share: v / total }));
  }, [rows, total]);

  const nextRound = byId("zoopa");

  return (
    <>
      <header className="topbar">
        <div className="brand">anteil<i>.</i></div>
        <div className="row">
          <button className="icon-btn glass" aria-label="Suche öffnen" onClick={() => setSearch(true)}><IconSearch size={19} /></button>
          <button className="icon-btn glass avatar" aria-label="Profil">N</button>
        </div>
      </header>

      <h1 className="title">Portfolio</h1>
      <p className="subtitle">{rows.length} Beteiligungen · {openRounds} offene Runden</p>

      <div className="card hero glass" style={{ marginTop: 18 }}>
        <div className="eyebrow">Wert deiner Anteile</div>
        <div className="hero-value">{fmtEur(total)}</div>
        <div className="hero-meta">
          <span className={diff >= 0 ? "pos" : "neg"} style={{ fontWeight: 600 }}>{fmtPct(diff / invested)}</span>
          <span className="muted">{diff >= 0 ? "+" : "−"}{fmtEur(Math.abs(diff))} seit Einstieg</span>
        </div>
        <div className="valuation-note">
          <IconSparkle size={16} style={{ flex: "0 0 auto", marginTop: 1 }} />
          <span>Berechnet aus deinen Anteilen × Preis je Anteil der letzten Finanzierungsrunde. Zuletzt aktualisiert am {fmtDate(lastUpdate)}.</span>
        </div>
      </div>

      <div className="stats">
        <div className="stat glass"><div className="eyebrow">Eingesetzt</div><div className="v">{fmtEur(invested)}</div></div>
        <div className="stat glass"><div className="eyebrow">Beteiligt</div><div className="v">{rows.length}</div></div>
        <div className="stat glass"><div className="eyebrow">Runden</div><div className="v">{openRounds}</div></div>
      </div>

      {banner && (
        <div className="banner glass glass-accent">
          <div style={{ flex: 1 }}>
            <div className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>Neue Runde</div>
            <h3>{nextRound.name} · {nextRound.round!.name} {nextRound.round!.startsOrEnds}</h3>
            <p>Ab {fmtEur(nextRound.round!.minTicket)} dabei · Bewertung {fmtEur(nextRound.valuation)}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            <button className="icon-btn" style={{ width: 30, height: 30, background: "rgba(0,0,0,.2)" }} onClick={() => setBanner(false)} aria-label="Ausblenden"><IconX size={14} /></button>
            <button className="icon-btn" style={{ background: "rgba(255,255,255,.95)", color: "#111" }} onClick={onOpenScreening} aria-label="Zum Screening"><IconArrowUpRight size={18} /></button>
          </div>
        </div>
      )}

      <div className="section-head"><h2>Allokation</h2><span>nach Branche</span></div>
      <div className="card glass" style={{ padding: 14 }}>
        <Bubbles items={allocation} />
      </div>

      <div className="section-head"><h2>Deine Positionen</h2><span className="link">Bewertung je Anteil</span></div>
      <div className="list glass">
        {rows.map((r) => (
          <button key={r.startupId} className="list-item">
            <Logo s={r.s} />
            <div className="grow">
              <div className="name">{r.s.name}</div>
              <div className="sub">{r.s.sector} · {r.shares} Anteile à {fmtEur2(r.s.sharePrice)}</div>
            </div>
            <div className="right">
              <div className="val">{fmtEur(r.value)}</div>
              <div className={`sub ${r.chg > 0 ? "pos" : "neg"}`}>{fmtPct(r.chg)}</div>
            </div>
          </button>
        ))}
      </div>

      {search && <Portal><SearchSheet onClose={() => setSearch(false)} /></Portal>}
    </>
  );
}
