"use client";

import { useEffect, useState } from "react";
import { posts, remainingSpace, type Startup } from "@/lib/data";
import { fmtDate, fmtEur, fmtMio, fmtNum } from "@/lib/format";
import Logo, { Orbs } from "./Logo";
import { IconArrowUpRight, IconX } from "./Icons";

/**
 * Startup-Profil: Gründerstory + strukturierte Fakten + Badges (überprüfbare
 * Fakten statt Gütesiegel) + letzte Updates + Runde mit laufenden
 * Teilabschlüssen (Rolling Closing).
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
  const r = s.round;
  const space = r ? remainingSpace(r) : 0;

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

        {r && (
          <div className="section">
            <div className="section-head">
              <h2 className="h2">Runde: {r.name}</h2>
              <span className="link">{r.open ? `offen bis ${fmtDate(r.endDate)}` : "geschlossen"}</span>
            </div>

            <div className="summary-card">
              <div className="sum-row"><span>Finanzierungsziel</span><b>{fmtEur(r.target)}</b></div>
              {r.fundingMinimum ? (
                <div className="sum-row"><span>Verbindliches Minimum</span><b>{fmtEur(r.fundingMinimum)} – vor Freigabe zu erfüllen</b></div>
              ) : (
                <div className="sum-row"><span>Verbindliches Minimum</span><b>keines in dieser Runde</b></div>
              )}
              <div className="sum-row"><span>Obergrenze</span><b>{fmtEur(r.cap)}</b></div>
              <div className="sum-row"><span>Zeichnungsraum</span><b>{space > 0 ? `noch ${fmtEur(space)}` : "ausgeschöpft"}</b></div>
              <div className="sum-row"><span>Teilabschluss-Schwelle</span><b>{fmtEur(r.closingThreshold)} abschließbares Kapital (Beispiel)</b></div>
              <div className="sum-row"><span>Mindestbetrag je Zeichnung</span><b>ab {fmtEur(r.minTicket)}</b></div>
            </div>

            <div className="round-progress-card" style={{ marginTop: 14 }}>
              <div className="eyebrow-plain">Fortschritt – getrennt nach Status</div>
              <div className="stacked-bar" aria-label="Fortschritt der Runde">
                <span className="seg closed" style={{ width: `${(r.closed / r.cap) * 100}%` }} />
                <span className="seg open-c" style={{ width: `${(r.openCommitments / r.cap) * 100}%` }} />
                <span className="seg pending" style={{ width: `${(r.pendingPayments / r.cap) * 100}%` }} />
              </div>
              <ul className="progress-legend">
                <li><i className="dot closed" />Abgeschlossen: {fmtEur(r.closed)}</li>
                <li><i className="dot open-c" />Offene Zeichnungen: {fmtEur(r.openCommitments)}</li>
                <li><i className="dot pending" />Zahlungen in Prüfung: {fmtEur(r.pendingPayments)}</li>
                <li className="muted">Obergrenze: {fmtEur(r.cap)}</li>
              </ul>
              <p className="facts-src">
                Abgeschlossene Investments, offene Zeichnungen und geprüfte Zahlungen werden getrennt
                gezählt. Gemerkte Startups (Watchlist) zählen nicht als Kapital.
              </p>
            </div>

            <div className="payout-card">
              <div className="payout-row">
                <span>An das Startup ausgezahlt</span>
                <strong>{fmtEur(r.paidOut)}</strong>
              </div>
              <p className="facts-src">
                Nur bestätigte Freigaben zählen. Brutto-Investmentvolumen: {fmtEur(r.closed)} –
                die Nettoauszahlung nach offengelegten Gebühren kann geringer ausfallen.
                Diese Auszahlung geht ans Startup, sie ist keine Renditezahlung an Anleger.
              </p>
            </div>

            {r.tranches.length > 0 && (
              <div className="tranche-hist">
                <div className="eyebrow-plain">Tranchenhistorie dieser Runde</div>
                {r.tranches.map((t) => (
                  <div key={t.label} className="tranche-row">
                    <span className="t-name">{t.label} abgeschlossen</span>
                    <span className="t-date">{fmtDate(t.date)}</span>
                    <span className="t-vol">{fmtEur(t.volume)} Investmentvolumen</span>
                  </div>
                ))}
                <p className="facts-src">
                  Mehrere Teilabschlüsse gehören zu dieser Runde – gleiche Runde, keine neuen
                  Angebote zu neuen Konditionen.
                </p>
              </div>
            )}

            <p className="facts-src" style={{ marginTop: 12 }}>
              Zum Enddatum oder bei ausgeschöpfter Obergrenze werden keine neuen Investments angenommen.
              Offene, rechtzeitig eingegangene Zeichnungen werden nach den definierten Regeln abgewickelt.
              Für Restbeträge unter der Teilabschluss-Schwelle ist Schlussabschluss oder Rückzahlung
              noch festzulegen (offene Produktentscheidung).
            </p>

            {r.open && space > 0 ? (
              <button className="btn btn-accent" style={{ width: "100%", marginTop: 14 }} onClick={onInvest}>
                Investieren (Simulation) <IconArrowUpRight size={16} />
              </button>
            ) : (
              <div className="closed-state">
                {space <= 0 ? "Zeichnungsraum ausgeschöpft – keine neuen Investments" : "Runde geschlossen – keine neuen Investments"}
              </div>
            )}
          </div>
        )}

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
      </div>
    </>
  );
}
