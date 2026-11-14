"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { startups, type Stage, type Startup } from "@/lib/data";
import { fmtEur, fmtMio } from "@/lib/format";
import Logo from "./Logo";
import InvestSheet from "./InvestSheet";
import StartupProfile from "./StartupProfile";
import { IconArrowUpRight, IconBookmark, IconCheck, IconChevron, IconSearch, IconX } from "./Icons";

type Criterion = { key: string; label: string; test: (s: Startup) => boolean };

const SECTORS = [...new Set(startups.map((s) => s.sector))];
const STAGES: Stage[] = ["Pre-Seed", "Seed", "Series A"];
const CITIES = [...new Set(startups.map((s) => s.city))];

/** Sehr einfache „Beschreibung → Kriterien“-Logik – später durch echte semantische Suche ersetzen. */
const KEYWORDS: { re: RegExp; c: Criterion }[] = [
  { re: /\b(ki|ai|künstliche intelligenz|llm)\b/i, c: { key: "s:AI", label: "AI", test: (s) => s.sector === "AI" } },
  { re: /(klima|climate|energie|nachhaltig|co2|co₂)/i, c: { key: "s:Climate", label: "Climate", test: (s) => s.sector === "Climate" } },
  { re: /(health|gesundheit|medizin)/i, c: { key: "s:Health", label: "Health", test: (s) => s.sector === "Health" } },
  { re: /(fintech|finanz|banking)/i, c: { key: "s:Fintech", label: "Fintech", test: (s) => s.sector === "Fintech" } },
  { re: /(robot|automatisierung|industrie)/i, c: { key: "s:Robotics", label: "Robotics", test: (s) => s.sector === "Robotics" } },
  { re: /(datenschutz|privacy|dsgvo|compliance)/i, c: { key: "s:Privacy", label: "Privacy", test: (s) => s.sector === "Privacy" } },
  { re: /(saarland|saarbrücken)/i, c: { key: "c:Saarbrücken", label: "Saarland", test: (s) => s.city === "Saarbrücken" } },
  { re: /pre-?seed/i, c: { key: "p:Pre-Seed", label: "Pre-Seed", test: (s) => s.stage === "Pre-Seed" } },
  { re: /(?<!pre-?)\bseed\b/i, c: { key: "p:Seed", label: "Seed", test: (s) => s.stage === "Seed" } },
  { re: /series ?a/i, c: { key: "p:Series A", label: "Series A", test: (s) => s.stage === "Series A" } },
  { re: /(offen|investier|runde)/i, c: { key: "open", label: "Runde offen", test: (s) => !!s.round?.open } },
  { re: /(b2b|unternehmen)/i, c: { key: "t:B2B", label: "B2B", test: (s) => s.tags.some((t) => /b2b|saas|kmu/i.test(t)) || /unternehmen/i.test(s.intro) } },
];
for (const city of CITIES) {
  if (city !== "Saarbrücken") KEYWORDS.push({ re: new RegExp(city, "i"), c: { key: `c:${city}`, label: city, test: (s) => s.city === city } });
}

const EXAMPLES = ["KI aus dem Saarland mit offener Runde", "Klima-Startups in der Seed-Phase", "B2B Datenschutz"];

type MenuKey = "sector" | "stage" | "city" | null;

export default function Screening() {
  const [prompt, setPrompt] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [menu, setMenu] = useState<MenuKey>(null);
  const [sector, setSector] = useState<string[]>([]);
  const [stage, setStage] = useState<string[]>([]);
  const [city, setCity] = useState<string[]>([]);
  const [openOnly, setOpenOnly] = useState(false);
  const [sort, setSort] = useState<"match" | "valuation" | "ticket">("match");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [sheet, setSheet] = useState<Startup | null>(null);
  const [profile, setProfile] = useState<Startup | null>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => { if (!bar.current?.contains(e.target as Node)) setMenu(null); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menu]);

  const toggle = (arr: string[], v: string, set: (x: string[]) => void) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const criteria = useMemo(() => {
    const c: Criterion[] = KEYWORDS.filter((k) => k.re.test(submitted)).map((k) => k.c);
    if (sector.length) c.push({ key: "f:sector", label: sector.join(", "), test: (s) => sector.includes(s.sector) });
    if (stage.length) c.push({ key: "f:stage", label: stage.join(", "), test: (s) => stage.includes(s.stage) });
    if (city.length) c.push({ key: "f:city", label: city.join(", "), test: (s) => city.includes(s.city) });
    if (openOnly) c.push({ key: "f:open", label: "Runde offen", test: (s) => !!s.round?.open });
    return c.filter((x, i, a) => a.findIndex((y) => y.label === x.label) === i);
  }, [submitted, sector, stage, city, openOnly]);

  const results = useMemo(() => {
    const scored = startups.map((s) => {
      const hits = criteria.map((c) => c.test(s));
      return { s, hits, match: criteria.length ? hits.filter(Boolean).length / criteria.length : 1 };
    });
    const list = criteria.length ? scored.filter((r) => r.match > 0) : scored;
    return list.sort((a, b) =>
      sort === "match" ? b.match - a.match || b.s.valuation - a.s.valuation
      : sort === "valuation" ? b.s.valuation - a.s.valuation
      : (a.s.round?.minTicket ?? 1e9) - (b.s.round?.minTicket ?? 1e9)
    );
  }, [criteria, sort]);

  const reset = () => { setSector([]); setStage([]); setCity([]); setOpenOnly(false); setPrompt(""); setSubmitted(""); };
  const filters: { key: Exclude<MenuKey, null>; label: string; options: string[]; value: string[]; set: (x: string[]) => void }[] = [
    { key: "sector", label: "Branche", options: SECTORS, value: sector, set: setSector },
    { key: "stage", label: "Phase", options: STAGES, value: stage, set: setStage },
    { key: "city", label: "Standort", options: CITIES, value: city, set: setCity },
  ];

  return (
    <>
      <header className="head">
        <div className="head-title">Screening</div>
        <button className="round-btn glass" aria-label={`Shortlist (${shortlist.length})`} style={{ color: shortlist.length ? "var(--accent)" : undefined }}>
          <IconBookmark size={18} fill={shortlist.length ? "currentColor" : "none"} />
        </button>
      </header>

      <form className="search" onSubmit={(e) => { e.preventDefault(); setSubmitted(prompt); }}>
        <label className="field glass">
          <IconSearch size={18} className="muted" />
          <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Beschreibe, wonach du suchst" aria-label="Suchbeschreibung" />
          {prompt && <button type="button" className="muted" onClick={() => { setPrompt(""); setSubmitted(""); }} aria-label="Leeren"><IconX size={16} /></button>}
        </label>
      </form>

      <div className="filterbar" ref={bar}>
        <div className="pills">
          {filters.map((f) => (
            <button key={f.key} className={`pill ${f.value.length ? "on" : ""}`} aria-expanded={menu === f.key} onClick={() => setMenu(menu === f.key ? null : f.key)}>
              {f.value.length ? `${f.label} · ${f.value.length}` : f.label}
              <IconChevron size={14} style={{ transform: "rotate(90deg)" }} />
            </button>
          ))}
          <button className="pill" aria-pressed={openOnly} onClick={() => setOpenOnly(!openOnly)}>Runde offen</button>
        </div>
        {filters.map((f) => menu === f.key && (
          <div key={f.key} className="menu" role="menu" style={{ left: f.key === "sector" ? 0 : f.key === "stage" ? 60 : 120 }}>
            {f.options.map((o) => (
              <button key={o} role="menuitemcheckbox" aria-checked={f.value.includes(o)} onClick={() => toggle(f.value, o, f.set)}>
                {o}{f.value.includes(o) && <IconCheck size={16} />}
              </button>
            ))}
          </div>
        ))}
      </div>

      {criteria.length > 0 ? (
        <div className="criteria">
          {criteria.map((c) => <span key={c.key}><IconCheck size={13} />{c.label}</span>)}
          <button className="clear" onClick={reset}>Zurücksetzen</button>
        </div>
      ) : (
        <div className="criteria">
          <span>Probier z. B.</span>
          <button className="clear" onClick={() => { setPrompt(EXAMPLES[0]); setSubmitted(EXAMPLES[0]); }}>„{EXAMPLES[0]}“</button>
        </div>
      )}

      <div className="results-head">
        <span>{results.length} Startups</span>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sortierung">
          <option value="match">Passung</option>
          <option value="valuation">Bewertung</option>
          <option value="ticket">Mindestticket</option>
        </select>
      </div>

      {results.length === 0 && <div className="empty">Keine passenden Startups. Versuch es mit weniger Kriterien.</div>}

      <div className="list">
        {results.map(({ s, hits, match }) => {
          const open = expanded === s.id;
          const saved = shortlist.includes(s.id);
          return (
            <div key={s.id}>
              <button className="item" onClick={() => setExpanded(open ? null : s.id)} aria-expanded={open} style={open ? { borderBottom: 0 } : undefined}>
                <Logo s={s} />
                <div className="grow">
                  <div className="name">{s.name}</div>
                  <div className="sub">{s.sector} · {s.stage} · {s.city}</div>
                </div>
                <div className="right">
                  {criteria.length > 0
                    ? <div className={`match ${match === 1 ? "pos" : ""}`}>{Math.round(match * 100)} %</div>
                    : <div className="val">{fmtMio(s.valuation)}</div>}
                  <div className="sub">{s.round?.open ? `ab ${fmtEur(s.round.minTicket)}` : "keine offene Runde"}</div>
                </div>
              </button>
              {open && (
                <div className="detail">
                  <p>{s.intro}</p>
                  {s.badges.length > 0 && (
                    <div className="pills" style={{ flexWrap: "wrap", marginTop: 10 }}>
                      {s.badges.map((b) => <span key={b} className="pill">{b}</span>)}
                    </div>
                  )}
                  <div className="facts">
                    <div><div className="k">Bewertung</div><div className="v">{fmtMio(s.valuation)}</div></div>
                    <div><div className="k">Team</div><div className="v">{s.team} Personen</div></div>
                    <div><div className="k">Gegründet</div><div className="v">{s.founded}</div></div>
                    <div><div className="k">Mindestbetrag</div><div className="v">{s.round?.open ? `ab ${fmtEur(s.round.minTicket)}` : "–"}</div></div>
                    <div><div className="k">Instrument</div><div className="v">Wirtschaftliches Beteiligungsrecht</div></div>
                    <div><div className="k">Stimmrechte</div><div className="v">Keine</div></div>
                  </div>
                  <p className="facts-src">
                    Bewertung: Post-Money der letzten Runde, Stand {s.lastValuationDate} – Schätzung, kein handelbarer Kurs.
                  </p>
                  {criteria.length > 0 && (
                    <div className="checks">
                      {criteria.map((c, i) => (
                        <span key={c.key} className={hits[i] ? "ok" : ""}>{hits[i] ? <IconCheck size={13} /> : <IconX size={12} />}{c.label}</span>
                      ))}
                    </div>
                  )}
                  <div className="row" style={{ marginTop: 16 }}>
                    <button
                      className={`btn ${s.round?.open ? "btn-accent" : "btn-white"}`}
                      onClick={() => (s.round?.open ? setSheet(s) : setProfile(s))}
                    >
                      {s.round?.open ? "Investieren" : "Profil ansehen"} <IconArrowUpRight size={16} />
                    </button>
                    <button className="btn" style={{ background: "var(--surface-2)", color: saved ? "var(--accent)" : undefined }} onClick={() => toggle(shortlist, s.id, setShortlist)} aria-pressed={saved}>
                      <IconBookmark size={16} fill={saved ? "currentColor" : "none"} />{saved ? "Gemerkt" : "Merken"}
                    </button>
                  </div>
                  <button className="more-link" style={{ marginTop: 12 }} onClick={() => setProfile(s)}>Vollständiges Profil ansehen</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sheet && <InvestSheet s={sheet} onClose={() => setSheet(null)} />}
      {profile && <StartupProfile s={profile} onInvest={() => { setProfile(null); setSheet(profile); }} onClose={() => setProfile(null)} />}
    </>
  );
}
