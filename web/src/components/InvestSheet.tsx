"use client";

import { useEffect, useMemo, useState } from "react";
import type { Startup } from "@/lib/data";
import { fmtEur, fmtMio } from "@/lib/format";
import Logo from "./Logo";
import { IconArrowUpRight, IconCheck, IconX } from "./Icons";

/**
 * Simulierter Investment-Prozess (Prototyp): keine Zahlung, kein Konto, kein KYC.
 * Zeigt die zentrale Frage des Konzepts: „Was bekomme ich für 500 €?"
 */

const TICKETS = [25, 100, 250, 500, 1000];

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

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label={`Investieren in ${s.name} (Simulation)`}>
        <div className="grabber" />

        {step === "done" ? (
          <div className="invest-done">
            <div className="done-icon"><IconCheck size={34} /></div>
            <h2>Beteiligung simuliert</h2>
            <p className="done-line">
              {fmtEur(amount)} an <b>{s.name}</b> – rein simuliert. Es wurde kein Geld bewegt und
              keine Beteiligung erworben.
            </p>
            <p className="done-note">
              Im echten Produkt folgt hier der Prozess unseres lizenzierten Partners:
              Identitätsprüfung, Bedenkzeit, Vertragsabschluss und Zahlungsabwicklung.
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
                  {s.round ? `${s.round.name} · Bewertung ${fmtMio(s.valuation)}` : `Bewertung ${fmtMio(s.valuation)}`}
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
                    type="number" inputMode="decimal" min={s.round?.minTicket ?? 25} step={25}
                    value={amount}
                    onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                    aria-label="Investitionsbetrag in Euro"
                  />
                  <span className="muted">EUR</span>
                </label>
                {s.round && amount < s.round.minTicket && (
                  <p className="ticket-hint">Mindestbetrag dieser Runde: {fmtEur(s.round.minTicket)}</p>
                )}

                <div className="what-you-get">
                  <div className="eyebrow-plain">Was bekommst du für {fmtEur(amount)}?</div>
                  <ul className="gets">
                    <li><IconCheck size={15} />Direkte wirtschaftliche Beteiligung an {s.legalName} – ca. {(shareOfCompany * 100).toLocaleString("de-DE", { maximumFractionDigits: 3 })} % des Unternehmenswerts</li>
                    <li><IconCheck size={15} />Vertraglicher Anspruch auf Gewinnbeteiligung und Erlös im Exit-Fall (genauer Umfang folgt aus dem Angebotsdokument)</li>
                    <li><IconCheck size={15} />Informationsrecht: regelmäßige Unternehmens-Updates in deiner Portfolio-Ansicht</li>
                    <li><IconX size={14} className="neg" />Keine operativen Stimmrechte – du beteiligst dich wirtschaftlich, nicht mitentscheidend</li>
                  </ul>
                </div>

                <button className="btn btn-accent" style={{ width: "100%", marginTop: 16 }} onClick={() => setStep("summary")}>
                  Zusammenfassung ansehen <IconArrowUpRight size={16} />
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
                  <div className="sum-row"><span>Auszahlung</span><b>Nur bei Ausschüttung, Exit oder zulässigem Verkauf</b></div>
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
                  <button className="btn btn-accent" style={{ flex: 2 }} onClick={() => setStep("done")}>Beteiligung simulieren</button>
                </div>
                <p className="done-note" style={{ marginTop: 10 }}>
                  Simulierter Abschluss – im echten Produkt folgt hier der lizenzierte Partnerprozess
                  mit Identitätsprüfung und vier Tagen Bedenkzeit.
                </p>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
