"use client";

import { useEffect, useState } from "react";
import { posts, type Startup } from "@/lib/data";
import { fmtDate, fmtEur, fmtMio, fmtNum } from "@/lib/format";
import Logo, { Orbs } from "./Logo";
import { IconArrowUpRight, IconX } from "./Icons";

/**
 * Startup-Profil: Gründerstory + strukturierte Fakten + Badges (überprüfbare
 * Fakten statt Gütesiegel) + letzte Updates. Buttons öffnen den simulierten
 * Investment-Flow bzw. führen zurück.
 */
export default function StartupProfile({
  s, onInvest, onClose,
}: { s: Startup; onInvest: () => void; onClose: () => void }) {
  const updates = posts.filter((p) => p.startupId === s.id);

  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Date.now());
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const daysAgo = Math.max(0, Math.round((now - new Date(s.lastUpdate).getTime()) / 86_400_000));
  const overdue = daysAgo > 60;

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label={`Profil ${s.name}`}>
        <div className="grabber" />

        <div className="profile-head">
          <Orbs hue={s.hue} />
          <button className="round-btn glass" style={{ position: "absolute", top: 18, right: 20, zIndex: 3 }} onClick={onClose} aria-label="Schließen"><IconX size={18} /></button>
          <div className="profile-id">
            <Logo s={s} size={56} />
            <div className="profile-names">
              <h2>{s.name}</h2>
              <p>{s.tagline}</p>
              <div className="profile-badges">
                {s.badges.map((b) => <span key={b} className="badge">{b}</span>)}
              </div>
            </div>
          </div>
        </div>

        <div className="section" style={{ marginTop: 20 }}>
          <div className="section-head"><h2 className="h2">Über das Startup</h2></div>
          <p className="profile-intro">{s.intro}</p>
          <div className="facts">
            <div><div className="k">Branche</div><div className="v">{s.sector}</div></div>
            <div><div className="k">Phase</div><div className="v">{s.stage}</div></div>
            <div><div className="k">Standort</div><div className="v">{s.city}</div></div>
            <div><div className="k">Gegründet</div><div className="v">{s.founded}</div></div>
            <div><div className="k">Team</div><div className="v">{s.team} Personen</div></div>
            <div><div className="k">Bewertung</div><div className="v">{fmtMio(s.valuation)}</div></div>
          </div>
          <p className="facts-src">
            Bewertung: Post-Money der letzten Runde vom {fmtDate(s.lastValuationDate)} – Schätzung, kein handelbarer Kurs.
          </p>
          <div className="pills" style={{ flexWrap: "wrap", marginTop: 12 }}>
            {s.tags.map((t) => <span key={t} className="pill">{t}</span>)}
          </div>
        </div>

        <div className="section">
          <div className="section-head">
            <h2 className="h2">Updates</h2>
            <span className="link" style={overdue ? { color: "var(--accent)" } : undefined}>
              {overdue ? `seit ${daysAgo} Tagen – Reporting überfällig` : `vor ${fmtNum(daysAgo)} ${daysAgo === 1 ? "Tag" : "Tagen"}`}
            </span>
          </div>
          {updates.length === 0 && <p className="profile-intro muted">Für dieses Startup liegen noch keine Updates vor.</p>}
          {updates.map((p) => (
            <article key={p.id} className="profile-update">
              <div className="update-date">{p.ago}</div>
              <p>{p.text}</p>
            </article>
          ))}
        </div>

        {s.round?.open && (
          <>
            <div className="section">
              <div className="section-head"><h2 className="h2">Runde</h2></div>
              <div className="summary-card">
                <div className="sum-row"><span>Runde</span><b>{s.round.name}</b></div>
                <div className="sum-row"><span>Zeitraum</span><b>{s.round.startsOrEnds}</b></div>
                <div className="sum-row"><span>Mindestbetrag</span><b>ab {fmtEur(s.round.minTicket)}</b></div>
                <div className="sum-row"><span>Füllstand</span><b>{Math.round(s.round.filled * 100)} %</b></div>
              </div>
              <div className="progress" style={{ margin: "12px 0 0" }}><span style={{ width: `${s.round.filled * 100}%` }} /></div>
            </div>
            <button className="btn btn-accent" style={{ width: "100%", marginTop: 18 }} onClick={onInvest}>
              Investieren (Simulation) <IconArrowUpRight size={16} />
            </button>
          </>
        )}
      </div>
    </>
  );
}
