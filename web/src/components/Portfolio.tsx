"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { byId, positions, startups, type Startup } from "@/lib/data";
import { fmtDate, fmtEur, fmtMio, fmtNum, fmtPct } from "@/lib/format";
import Bubbles from "./Bubbles";
import Logo from "./Logo";
import Portal from "./Portal";
import SearchSheet from "./SearchSheet";
import InvestSheet from "./InvestSheet";
import StartupProfile from "./StartupProfile";
import { IconArrowUpRight, IconChevron, IconSearch, IconX } from "./Icons";

/** Client-Zeit erst nach Mount – beim Prerender steht noch kein Datum fest. */
function useNow() {
  const [now, setNow] = useState(0);
  useEffect(() => setNow(Date.now()), []);
  return now;
}

function daysSince(iso: string, now: number) {
  return Math.max(0, Math.round((now - new Date(iso).getTime()) / 86_400_000));
}

export default function Portfolio({ onOpenScreening }: { onOpenScreening: () => void }) {
  const [view, setView] = useState<"portfolio" | "runden">("portfolio");
  const [search, setSearch] = useState(false);
  const [invest, setInvest] = useState<Startup | null>(null);

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
        ? <Overview onSearch={() => setSearch(true)} onOpenScreening={onOpenScreening} onInvest={setInvest} />
        : <Rounds onProfile={setInvest} />}

      {search && <Portal><SearchSheet onClose={() => setSearch(false)} /></Portal>}
      {invest && <Portal><InvestSheet s={invest} onClose={() => setInvest(null)} /></Portal>}
    </>
  );
}

function Overview({ onSearch, onOpenScreening, onInvest }: {
  onSearch: () => void; onOpenScreening: () => void; onInvest: (s: Startup) => void;
}) {
  const [showRounds, setShowRounds] = useState(true);
  const [slide, setSlide] = useState(0);
  const [allPositions, setAllPositions] = useState(false);
  const [profile, setProfile] = useState<Startup | null>(null);
  const now = useNow();
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
  const payouts = rows.reduce((a, r) => a + r.payouts, 0);
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
        <div className="label">Geschätzter Wert deiner Beteiligungen</div>
        <div className="hero-value">
          <strong>{fmtEur(total)}</strong>
          <span className={`chg ${diff >= 0 ? "pos" : "neg"}`}>{diff >= 0 ? "▲" : "▼"} {fmtPct(Math.abs(diff / invested)).replace("+", "")}</span>
        </div>
        <p className="hero-line">
          <b>{fmtEur(invested)}</b> eingesetzt · <b>{fmtEur(payouts)}</b> ausgezahlt erhalten ·{" "}
          <b>{diff >= 0 ? "+" : "−"}{fmtEur(Math.abs(diff))}</b> unverwirklicht seit Einstieg
        </p>
        <p className="hero-line small">
          Schätzung zum Preis der letzten Runde · Stand {fmtDate(lastUpdate)} · nicht auszahlbar
        </p>
      </div>

      {showRounds && (
        <div className="rounds" ref={track}
          onScroll={() => { const el = track.current; if (el) setSlide(Math.round(el.scrollLeft / el.clientWidth)); }}>
          {open.map((s) => (
            <article key={s.id} className="round-card" onClick={onOpenScreening}>
              <button className="close" aria-label="Ausblenden" onClick={(e) => { e.stopPropagation(); setShowRounds(false); }}><IconX size={18} /></button>
              <div className="eyebrow">Neue Runde</div>
              <h3>{s.name} · {s.round!.name} <IconChevron size={18} /></h3>
              <p>läuft bis {fmtDate(s.round!.endDate)} · ab {fmtEur(s.round!.minTicket)} dabei · laufende Teilabschlüsse</p>
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
          {(allPositions ? rows : rows.slice(0, 4)).map((r) => {
            const days = daysSince(r.s.lastUpdate, now);
            const overdue = days > 60;
            return (
              <button key={r.startupId} className="item" onClick={() => setProfile(r.s)}>
                <Logo s={r.s} />
                <div className="grow">
                  <div className="name">{r.s.name}</div>
                  <div className="sub">{fmtEur(r.invested)} eingesetzt · geschätzt {fmtEur(r.value)}</div>
                  <div className="sub" style={overdue ? { color: "var(--accent)" } : undefined}>
                    {overdue ? `letztes Update vor ${fmtNum(days)} Tagen – überfällig` : `letztes Update vor ${fmtNum(days)} ${days === 1 ? "Tag" : "Tagen"}`}
                    {r.payouts > 0 && ` · ${fmtEur(r.payouts)} ausgezahlt`}
                  </div>
                </div>
                <div className="right">
                  <div className="val">{fmtEur(r.value)}</div>
                  <div className={`sub ${r.chg > 0 ? "pos" : "neg"}`}>{r.chg > 0 ? "▲" : r.chg < 0 ? "▼" : ""} {fmtPct(Math.abs(r.chg)).replace("+", "")}</div>
                  <div className="sub">geschätzt</div>
                </div>
              </button>
            );
          })}
        </div>
        {rows.length > 4 && (
          <button className="more-link" onClick={() => setAllPositions(!allPositions)}>
            {allPositions ? "Weniger anzeigen" : `Alle ${rows.length} Positionen anzeigen`}
          </button>
        )}
      </div>

      {profile && <Portal><StartupProfile s={profile} onInvest={() => { setProfile(null); onInvest(profile); }} onClose={() => setProfile(null)} /></Portal>}
    </>
  );
}

function Rounds({ onProfile }: { onProfile: (s: Startup) => void }) {
  const open = startups.filter((s) => s.round?.open);
  return (
    <>
      <div className="hero">
        <div className="label">Offene Runden</div>
        <div className="hero-value"><strong>{open.length}</strong></div>
        <p className="hero-line">Startups, in die du dich gerade beteiligen kannst – mit laufenden Teilabschlüssen.</p>
      </div>
      <div className="section">
        <div className="list">
          {open.map((s) => {
            const r = s.round!;
            return (
              <button key={s.id} className="item" style={{ alignItems: "flex-start" }} onClick={() => onProfile(s)}>
                <Logo s={s} />
                <div className="grow">
                  <div className="name">{s.name}</div>
                  <div className="sub">{r.name} · läuft bis {fmtDate(r.endDate)} · Schwelle {fmtEur(r.closingThreshold)}</div>
                  <div className="stacked-bar" aria-label={`Fortschritt ${s.name}`}>
                    <span className="seg closed" style={{ width: `${(r.closed / r.cap) * 100}%` }} />
                    <span className="seg open-c" style={{ width: `${(r.openCommitments / r.cap) * 100}%` }} />
                    <span className="seg pending" style={{ width: `${(r.pendingPayments / r.cap) * 100}%` }} />
                  </div>
                  <div className="sub" style={{ marginTop: 4 }}>
                    {fmtEur(r.closed)} abgeschlossen · {fmtEur(r.paidOut)} ans Startup ausgezahlt
                  </div>
                </div>
                <div className="right">
                  <div className="val">ab {fmtEur(r.minTicket)}</div>
                  <div className="sub">{fmtMio(s.valuation)}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
