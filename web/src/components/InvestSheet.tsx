"use client";

import { useEffect, useMemo, useState } from "react";
import type { Startup } from "@/lib/data";
import { remainingSpace } from "@/lib/data";
import { fmtEur, fmtMio } from "@/lib/format";
import Logo from "./Logo";
import { IconArrowUpRight, IconCheck, IconX } from "./Icons";

/**
 * Simulierter Investment-Prozess (Prototyp): keine Zahlung, kein Konto, kein KYC.
 * Zeigt die zentrale Frage des Konzepts: „Was bekomme ich für 500 €?"
 * Zielmodell: laufende Teilabschlüsse (Rolling Closing) innerhalb einer offenen Runde.
 */

const TICKETS = [25, 100, 250, 500, 1000];

/** Status-Kette laut Konzept: gezeichnet → Zahlung → Bedingungen → aktiv */
const STATUS_STEPS = [
  { label: "Investment gezeichnet", hint: "Deine Zeichnung ist vermerkt. Noch unverbindlich genug, um ohne Prüfung zu gelten – die Zahlung steht aus." },
  { label: "Zahlung eingegangen", hint: "Das Geld ist beim Abwickler zugeordnet. Prüfungen und anwendbare Fristen laufen. Zahlung allein aktiviert keine Beteiligung." },
  { label: "Abschlussbedingungen erfüllt", hint: "Prüfungen bestanden, Fristen abgelaufen, Teilabschluss-Schwelle erreicht. Genussrechte werden ausgegeben." },
  { label: "Beteiligung aktiv", hint: "Rechte sind dir zugeordnet und in deinem Portfolio sichtbar. Erst bestätigte Auszahlungen an das Startup erscheinen als solche." },
];

export default function InvestSheet({ s, onClose }: { s: Startup; onClose: () => void }) {
  const [amount, setAmount] = useState(500);
  const [step, setStep] = useState<"amount" | "summary" | "done">("amount");

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const shareOfCompany = amount / s.valuation;
  const fee = useMemo(() => Math.round(amount * 0.05), [amount]);
  const r = s.round;
  const space = r ? remainingSpace(r) : 0;
  const exceedsCap = r ? amount > space : false;

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label={`Investieren in ${s.name} (Simulation)`}>
        <div className="grabber" />

        {step === "done" ? (
          <div className="invest-done">
            <div className="done-icon"><IconCheck size={34} /></div>
            <h2>Investment gezeichnet</h2>
            <p className="done-line">
              {fmtEur(amount)} für <b>{s.name}</b> – rein simuliert. Es wurde kein Geld bewegt und
              keine Beteiligung erworben.
            </p>

            <div className="status-chain">
              <div className="eyebrow-plain" style={{ marginBottom: 12 }}>So geht es im Zielmodell weiter</div>
              {STATUS_STEPS.map((st, i) => (
                <div key={st.label} className={`chain-step ${i === 0 ? "now" : ""}`}>
                  <span className="chain-no">{i + 1}</span>
                  <div>
                    <strong>{i === 0 ? "✓ " : ""}{st.label}{i === 0 ? " – jetzt" : ""}</strong>
                    <p>{st.hint}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="done-note">
              Im echten Produkt folgt hier der lizenzierte Partnerprozess:
              Identitätsprüfung, anwendbare Fristen, Vertragsabschluss und Zahlungsabwicklung.
            </p>
            <button className="btn btn-white" style={{ width: "100%" }} onClick={onClose}>Verstanden</button>
          </div>
        ) : (
          <>
            <div className="invest-head">
              <Logo s={s} size={44} />
              <div className="grow">
                <div className="invest-name">{s.name}</div>
                <div className="sub">
                  {r ? `${r.name} · Bewertung ${fmtMio(s.valuation)}` : `Bewertung ${fmtMio(s.valuation)}`}
                </div>
              </div>
              <button className="round-btn glass" onClick={onClose} aria-label="Schließen"><IconX size={18} /></button>
            </div>

            <div className="sim-note">
              Simulation – hier fließt kein echtes Geld. Alle Unternehmen und Zahlen sind fiktive Beispiele.
            </div>

            {step === "amount" && (
              <>
                <h3 className="sheet-h">Wie viel möchtest du investieren?</h3>
                <div className="tickets">
                  {TICKETS.map((t) => (
                    <button key={t} className={`pill ${amount === t ? "on" : ""}`} aria-pressed={amount === t} onClick={() => setAmount(t)}>
                      {fmtEur(t)}
                    </button>
                  ))}
                </div>
                <label className="field glass" style={{ marginTop: 14 }}>
                  <input
                    type="number" inputMode="decimal" min={r?.minTicket ?? 25} step={25}
                    value={amount}
                    onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                    aria-label="Investitionsbetrag in Euro"
                  />
                  <span className="muted">EUR</span>
                </label>
                {r && amount < r.minTicket && (
                  <p className="ticket-hint">Mindestbetrag dieser Runde: {fmtEur(r.minTicket)}</p>
                )}
                {exceedsCap && (
                  <p className="ticket-hint">
                    Zeichnungsraum dieser Runde: noch {fmtEur(space)} bis zur Obergrenze.
                  </p>
                )}

                {r && (
                  <div className="round-progress-card">
                    <div className="eyebrow-plain">Stand dieser Runde (Beispiel)</div>
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
                  </div>
                )}

                <div className="what-you-get">
                  <div className="eyebrow-plain">Was bekommst du für {fmtEur(amount)}?</div>
                  <ul className="gets">
                    <li><IconCheck size={15} />Direkte wirtschaftliche Beteiligung an {s.legalName} – ca. {(shareOfCompany * 100).toLocaleString("de-DE", { maximumFractionDigits: 3 })} % des Unternehmenswerts bei aktueller Bewertung</li>
                    <li><IconCheck size={15} />Vertraglicher Anspruch auf Gewinnbeteiligung und Erlös im Exit-Fall (genauer Umfang folgt aus dem Angebotsdokument)</li>
                    <li><IconCheck size={15} />Informationsrecht: regelmäßige Unternehmens-Updates in deiner Portfolio-Ansicht</li>
                    <li><IconX size={14} className="neg" />Keine operativen Stimmrechte – du beteiligst dich wirtschaftlich, nicht mitentscheidend</li>
                  </ul>
                  <p className="cond-note">
                    Konditionen gelten für diese Zeichnung. Spätere Zeichnungen können andere Konditionen haben.
                    Die wirtschaftliche Quote ergibt sich aus dem Vertrag, nicht allein aus dem Rundenmaximum.
                  </p>
                </div>

                <button
                  className="btn btn-accent"
                  style={{ width: "100%", marginTop: 16, opacity: exceedsCap ? 0.5 : 1 }}
                  disabled={exceedsCap}
                  onClick={() => setStep("summary")}
                >
                  {exceedsCap ? "Zeichnungsraum ausgeschöpft" : "Zusammenfassung ansehen"} <IconArrowUpRight size={16} />
                </button>
              </>
            )}

            {step === "summary" && (
              <>
                <h3 className="sheet-h">Zusammenfassung</h3>
                <div className="summary-card">
                  <div className="sum-row"><span>Beteiligung an</span><b>{s.name}</b></div>
                  <div className="sum-row"><span>Instrument</span><b>Wirtschaftliches Beteiligungsrecht</b></div>
                  <div className="sum-row"><span>Betrag</span><b>{fmtEur(amount)}</b></div>
                  <div className="sum-row"><span>Plattformgebühr (Beispiel)</span><b>{fmtEur(fee)}</b></div>
                  <div className="sum-row"><span>Kapitalbindung</span><b>Mehrere Jahre – kein garantierter Rückfluss</b></div>
                  <div className="sum-row"><span>Auszahlung an dich</span><b>Nur bei Ausschüttung, Exit oder zulässigem Verkauf</b></div>
                </div>

                <div className="rolling-box">
                  <strong>Laufende Teilabschlüsse</strong>
                  <p>
                    {r
                      ? `Dein Investment wird zusammen mit anderen gezeichneten Beträgen wirksam abgeschlossen, sobald mindestens ${fmtEur(r.closingThreshold)} abschließbares Kapital zusammen sind und die Abschlussbedingungen erfüllt sind. So fließen kleinere Beträge früh an das Startup – nicht erst am Rundenende.`
                      : "Dein Investment wird zusammen mit anderen gezeichneten Beträgen wirksam abgeschlossen, sobald die vereinbarte Schwelle abschließbaren Kapitals erreicht ist und die Abschlussbedingungen erfüllt sind."}
                  </p>
                  <p>
                    <b>Bereits abgeschlossene Beteiligungen bleiben bestehen</b>, auch wenn das
                    angestrebte Rundenziel später verfehlt wird. Das ist keine garantierte
                    Rückzahlung oder Rendite.
                  </p>
                  {r && r.tranches.length > 0 && (
                    <p className="muted" style={{ marginTop: 8 }}>
                      Bisher in dieser Runde: {r.tranches.map((t) => t.label).join(", ")} –
                      zusammen {fmtEur(r.closed)} abgeschlossen, {fmtEur(r.paidOut)} ans Startup ausgezahlt.
                    </p>
                  )}
                </div>

                <div className="risk-box">
                  <strong>Risikohinweise</strong>
                  <p>
                    Startup-Beteiligungen sind hochriskant: Totalverlust des eingesetzten Kapitals ist möglich.
                    Es gibt keinen garantierten Rückfluss und keinen liquiden Markt für einen jederzeitigen Verkauf.
                    Die angezeigte Bewertung ist eine Schätzung aus der letzten Finanzierungsrunde, kein handelbarer Kurs.
                  </p>
                </div>

                <div className="row" style={{ marginTop: 16 }}>
                  <button className="btn" style={{ background: "var(--surface-2)", flex: 1 }} onClick={() => setStep("amount")}>Zurück</button>
                  <button className="btn btn-accent" style={{ flex: 2 }} onClick={() => setStep("done")}>Investment zeichnen (Simulation)</button>
                </div>
                <p className="done-note" style={{ marginTop: 10 }}>
                  Simulierter Abschluss – im echten Produkt folgt hier der lizenzierte Partnerprozess
                  mit Identitätsprüfung und den dann anwendbaren Fristen.
                </p>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
