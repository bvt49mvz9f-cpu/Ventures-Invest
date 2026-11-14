"use client";

import { useMemo, useRef, useState } from "react";
import { byId, positions, startups } from "@/lib/data";
import { fmtDate, fmtEur, fmtEur2, fmtMio, fmtPct } from "@/lib/format";
import Bubbles from "./Bubbles";
import Logo from "./Logo";
import Portal from "./Portal";
import SearchSheet from "./SearchSheet";
import { IconArrowUpRight, IconChevron, IconSearch, IconX } from "./Icons";

export default function Portfolio({ onOpenScreening }: { onOpenScreening: () => void }) {
  const [view, setView] = useState<"portfolio" | "runden">("portfolio");
  const [search, setSearch] = useState(false);

  return (
    <>
      <header className="head">
        <div className="head-tabs">
          <button aria-pressed={view === "portfolio"} onClick={() => setView("portfolio")}>Portfolio</button>
          <button aria-pressed={view === "runden"} onClick={() => setView("runden")}>Runden</button>
        </div>
        <button className="round-btn avatar" aria-label="Profil">N</button>
      </header>

      {view === "portfolio"
        ? <Overview onSearch={() => setSearch(true)} onOpenScreening={onOpenScreening} />
        : <Rounds />}

      {search && <Portal><SearchSheet onClose={() => setSearch(false)} /></Portal>}
    </>
  );
}

function Overview({ onSearch, onOpenScreening }: { onSearch: () => void; onOpenScreening: () => void }) {
  const [showRounds, setShowRounds] = useState(true);
  const [slide, setSlide] = useState(0);
  const [allPositions, setAllPositions] = useState(false);
  const track = useRef<HTMLDivElement>(null);

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
  const open = startups.filter((s) => s.round?.open).slice(0, 4);

  const allocation = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.s.sector, (m.get(r.s.sector) ?? 0) + r.value));
    return [...m].map(([label, v]) => ({ label, share: v / total }));
  }, [rows, total]);

  return (
    <>
      <div className="hero">
        <div className="label">Wert deiner Anteile</div>
        <div className="hero-value">
          <strong>{fmtEur(total)}</strong>
          <span className={`chg ${diff >= 0 ? "pos" : "neg"}`}>{diff >= 0 ? "▲" : "▼"} {fmtPct(Math.abs(diff / invested)).replace("+", "")}</span>
        </div>
        <p className="hero-line">
          <b>{fmtEur(invested)}</b> eingesetzt · <b>{diff >= 0 ? "+" : "−"}{fmtEur(Math.abs(diff))}</b> seit Einstieg
        </p>
        <p className="hero-line small">Bewertet zum Preis der letzten Runde · Stand {fmtDate(lastUpdate)}</p>
      </div>

      {showRounds && (
        <div className="rounds" ref={track}
          onScroll={() => { const el = track.current; if (el) setSlide(Math.round(el.scrollLeft / el.clientWidth)); }}>
          {open.map((s) => (
            <article key={s.id} className="round-card" onClick={onOpenScreening}>
              <button className="close" aria-label="Ausblenden" onClick={(e) => { e.stopPropagation(); setShowRounds(false); }}><IconX size={18} /></button>
              <div className="eyebrow">Neue Runde</div>
              <h3>{s.name} · {s.round!.name} <IconChevron size={18} /></h3>
              <p>{s.round!.startsOrEnds[0].toUpperCase() + s.round!.startsOrEnds.slice(1)} · ab {fmtEur(s.round!.minTicket)} dabei</p>
              <div className="dots">{open.map((o, i) => <span key={o.id} className={i === slide ? "on" : ""} />)}</div>
            </article>
          ))}
        </div>
      )}

      <div className="actions" style={showRounds ? undefined : { marginTop: 30 }}>
        <button className="action glass" onClick={onSearch}>Suche <IconSearch size={20} /></button>
        <button className="action glass" onClick={onOpenScreening}>Investieren <IconArrowUpRight size={20} /></button>
      </div>

      <div className="section">
        <div className="section-head"><h2 className="h2">Allokation</h2><span className="link">nach Branche</span></div>
        <Bubbles items={allocation} />
      </div>

      <div className="section">
        <div className="section-head"><h2 className="h2">Positionen <IconChevron size={18} className="muted" /></h2></div>
        <div className="list">
          {(allPositions ? rows : rows.slice(0, 4)).map((r) => (
            <button key={r.startupId} className="item">
              <Logo s={r.s} />
              <div className="grow">
                <div className="name">{r.s.name}</div>
                <div className="sub">{r.shares} Anteile · {fmtEur2(r.s.sharePrice)}</div>
              </div>
              <div className="right">
                <div className="val">{fmtEur(r.value)}</div>
                <div className={`sub ${r.chg > 0 ? "pos" : "neg"}`}>{r.chg > 0 ? "▲" : r.chg < 0 ? "▼" : ""} {fmtPct(Math.abs(r.chg)).replace("+", "")}</div>
              </div>
            </button>
          ))}
        </div>
        {rows.length > 4 && (
          <button className="more-link" onClick={() => setAllPositions(!allPositions)}>
            {allPositions ? "Weniger anzeigen" : `Alle ${rows.length} Positionen anzeigen`}
          </button>
        )}
      </div>
    </>
  );
}

function Rounds() {
  const open = startups.filter((s) => s.round?.open);
  return (
    <>
      <div className="hero">
        <div className="label">Offene Runden</div>
        <div className="hero-value"><strong>{open.length}</strong></div>
        <p className="hero-line">Startups, in die du gerade investieren kannst.</p>
      </div>
      <div className="section">
        <div className="list">
          {open.map((s) => (
            <button key={s.id} className="item" style={{ alignItems: "flex-start" }}>
              <Logo s={s} />
              <div className="grow">
                <div className="name">{s.name}</div>
                <div className="sub">{s.round!.name} · {s.round!.startsOrEnds}</div>
                <div className="progress"><span style={{ width: `${s.round!.filled * 100}%` }} /></div>
              </div>
              <div className="right">
                <div className="val">ab {fmtEur(s.round!.minTicket)}</div>
                <div className="sub">{fmtMio(s.valuation)}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
