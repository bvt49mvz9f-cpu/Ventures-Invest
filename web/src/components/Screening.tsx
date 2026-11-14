"use client";

import { useMemo, useState } from "react";
import { startups, type Stage, type Startup } from "@/lib/data";
import { fmtEur, fmtMio } from "@/lib/format";
import Logo from "./Logo";
import { IconArrowUpRight, IconBookmark, IconCheck, IconSliders, IconSparkle, IconX } from "./Icons";

type Criterion = { key: string; label: string; test: (s: Startup) => boolean };

const SECTORS = [...new Set(startups.map((s) => s.sector))];
const STAGES: Stage[] = ["Pre-Seed", "Seed", "Series A"];
const CITIES = [...new Set(startups.map((s) => s.city))];
const TICKETS = [25, 50, 100, 250];

/** Sehr einfache „Prompt-zu-Kriterien“-Logik – später durch echte semantische Suche ersetzen. */
const KEYWORDS: { re: RegExp; c: Criterion }[] = [
  { re: /\b(ki|ai|künstliche intelligenz|llm)\b/i, c: { key: "s:AI", label: "Branche: AI", test: (s) => s.sector === "AI" } },
  { re: /(klima|climate|energie|nachhaltig|co2|co₂)/i, c: { key: "s:Climate", label: "Branche: Climate", test: (s) => s.sector === "Climate" } },
  { re: /(health|gesundheit|medizin)/i, c: { key: "s:Health", label: "Branche: Health", test: (s) => s.sector === "Health" } },
  { re: /(fintech|finanz|banking)/i, c: { key: "s:Fintech", label: "Branche: Fintech", test: (s) => s.sector === "Fintech" } },
  { re: /(robot|automatisierung|industrie)/i, c: { key: "s:Robotics", label: "Branche: Robotics", test: (s) => s.sector === "Robotics" } },
  { re: /(datenschutz|privacy|dsgvo|compliance)/i, c: { key: "s:Privacy", label: "Branche: Privacy", test: (s) => s.sector === "Privacy" } },
  { re: /(saarland|saarbrücken)/i, c: { key: "c:Saarbrücken", label: "Standort: Saarland", test: (s) => s.city === "Saarbrücken" } },
  { re: /pre-?seed/i, c: { key: "p:Pre-Seed", label: "Phase: Pre-Seed", test: (s) => s.stage === "Pre-Seed" } },
  { re: /(?<!pre-?)\bseed\b/i, c: { key: "p:Seed", label: "Phase: Seed", test: (s) => s.stage === "Seed" } },
  { re: /series ?a/i, c: { key: "p:Series A", label: "Phase: Series A", test: (s) => s.stage === "Series A" } },
  { re: /(offen|investier|runde)/i, c: { key: "open", label: "Runde offen", test: (s) => !!s.round?.open } },
  { re: /(b2b|unternehmen)/i, c: { key: "t:B2B", label: "B2B", test: (s) => s.tags.some((t) => /b2b|saas|kmu/i.test(t)) || /unternehmen/i.test(s.intro) } },
];
for (const city of CITIES) {
  if (city === "Saarbrücken") continue;
  KEYWORDS.push({ re: new RegExp(city, "i"), c: { key: `c:${city}`, label: `Standort: ${city}`, test: (s) => s.city === city } });
}

const EXAMPLES = [
  "KI-Startups aus dem Saarland mit offener Runde",
  "Klima-Startups in der Seed-Phase",
  "B2B Software für Datenschutz",
];

export default function Screening() {
  const [prompt, setPrompt] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [panel, setPanel] = useState(false);
  const [sector, setSector] = useState<string[]>([]);
  const [stage, setStage] = useState<Stage[]>([]);
  const [city, setCity] = useState<string[]>([]);
  const [openOnly, setOpenOnly] = useState(false);
  const [maxTicket, setMaxTicket] = useState<number | null>(null);
  const [sort, setSort] = useState<"match" | "valuation" | "team">("match");
  const [shortlist, setShortlist] = useState<string[]>([]);

  const toggle = <T,>(arr: T[], v: T, set: (x: T[]) => void) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const criteria = useMemo(() => {
    const c: Criterion[] = KEYWORDS.filter((k) => k.re.test(submitted)).map((k) => k.c);
    if (sector.length) c.push({ key: "f:sector", label: `Branche: ${sector.join(", ")}`, test: (s) => sector.includes(s.sector) });
    if (stage.length) c.push({ key: "f:stage", label: `Phase: ${stage.join(", ")}`, test: (s) => stage.includes(s.stage) });
    if (city.length) c.push({ key: "f:city", label: `Standort: ${city.join(", ")}`, test: (s) => city.includes(s.city) });
    if (openOnly) c.push({ key: "f:open", label: "Runde offen", test: (s) => !!s.round?.open });
    if (maxTicket) c.push({ key: "f:ticket", label: `Ticket ab ≤ ${fmtEur(maxTicket)}`, test: (s) => !!s.round?.open && s.round.minTicket <= maxTicket });
    return c.filter((x, i, a) => a.findIndex((y) => y.label === x.label) === i);
  }, [submitted, sector, stage, city, openOnly, maxTicket]);

  const results = useMemo(() => {
    const scored = startups.map((s) => {
      const hits = criteria.map((c) => c.test(s));
      const match = criteria.length ? hits.filter(Boolean).length / criteria.length : 1;
      return { s, hits, match };
    });
    const filtered = criteria.length ? scored.filter((r) => r.match > 0) : scored;
    return filtered.sort((a, b) =>
      sort === "match" ? b.match - a.match || b.s.valuation - a.s.valuation
      : sort === "valuation" ? b.s.valuation - a.s.valuation
      : b.s.team - a.s.team
    );
  }, [criteria, sort]);

  const filterCount = sector.length + stage.length + city.length + (openOnly ? 1 : 0) + (maxTicket ? 1 : 0);
  const reset = () => { setSector([]); setStage([]); setCity([]); setOpenOnly(false); setMaxTicket(null); setPrompt(""); setSubmitted(""); };

  return (
    <>
      <header className="topbar">
        <div className="brand">Screening</div>
        <button className="chip glass" aria-label="Shortlist">
          <IconBookmark size={14} fill={shortlist.length ? "currentColor" : "none"} style={{ color: shortlist.length ? "var(--accent)" : undefined }} />
          Shortlist {shortlist.length}
        </button>
      </header>

      <h1 className="title">Startups finden</h1>
      <p className="subtitle">Beschreib in eigenen Worten, wonach du suchst.</p>

      <form className="prompt glass" style={{ marginTop: 18 }} onSubmit={(e) => { e.preventDefault(); setSubmitted(prompt); }}>
        <textarea
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setSubmitted(prompt); } }}
          placeholder="z. B. KI-Startups aus dem Saarland mit offener Runde"
          aria-label="Suchbeschreibung"
        />
        <div className="prompt-foot">
          <span className="row muted" style={{ fontSize: 12, gap: 6 }}><IconSparkle size={14} />{startups.length} Startups im Netzwerk</span>
          <button type="submit" className="btn btn-primary" style={{ height: 38, padding: "0 16px", fontSize: 13.5 }}>Suchen</button>
        </div>
      </form>

      {!submitted && !filterCount && (
        <div className="filters">
          {EXAMPLES.map((x) => (
            <button key={x} className="fchip glass" onClick={() => { setPrompt(x); setSubmitted(x); }}>{x}</button>
          ))}
        </div>
      )}

      <div className="filters">
        <button className="fchip glass" aria-pressed={panel} onClick={() => setPanel(!panel)}>
          <IconSliders size={15} />Filter{filterCount ? ` · ${filterCount}` : ""}
        </button>
        <button className="fchip glass" aria-pressed={openOnly} onClick={() => setOpenOnly(!openOnly)}>Runde offen</button>
        {SECTORS.map((x) => (
          <button key={x} className="fchip glass" aria-pressed={sector.includes(x)} onClick={() => toggle(sector, x, setSector)}>{x}</button>
        ))}
      </div>

      {panel && (
        <div className="filter-panel glass">
          <div className="group">
            <h4>Phase</h4>
            <div className="opt-row">{STAGES.map((x) => <button key={x} className="opt" aria-pressed={stage.includes(x)} onClick={() => toggle(stage, x, setStage)}>{x}</button>)}</div>
          </div>
          <div className="group">
            <h4>Standort</h4>
            <div className="opt-row">{CITIES.map((x) => <button key={x} className="opt" aria-pressed={city.includes(x)} onClick={() => toggle(city, x, setCity)}>{x}</button>)}</div>
          </div>
          <div className="group">
            <h4>Mindestticket bis</h4>
            <div className="opt-row">{TICKETS.map((x) => <button key={x} className="opt" aria-pressed={maxTicket === x} onClick={() => setMaxTicket(maxTicket === x ? null : x)}>{fmtEur(x)}</button>)}</div>
          </div>
        </div>
      )}

      {criteria.length > 0 && (
        <div className="criteria">
          {criteria.map((c) => <span key={c.key} className="criterion">{c.label}</span>)}
          <button className="criterion" onClick={reset}><IconX size={12} />Zurücksetzen</button>
        </div>
      )}

      <div className="result-meta">
        <span>{results.length} {results.length === 1 ? "Treffer" : "Treffer"}</span>
        <label className="row" style={{ gap: 6 }}>
          Sortieren:
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="match">Passung</option>
            <option value="valuation">Bewertung</option>
            <option value="team">Teamgröße</option>
          </select>
        </label>
      </div>

      {results.length === 0 && <div className="empty glass card">Keine passenden Startups. Versuch es mit weniger Kriterien.</div>}

      {results.map(({ s, hits, match }) => {
        const saved = shortlist.includes(s.id);
        return (
          <article key={s.id} className="result glass">
            <div className="result-top">
              <Logo s={s} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{s.name}</div>
                <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{s.sector} · {s.stage} · {s.city}</div>
              </div>
              {criteria.length > 0 && (
                <div className="match">
                  <div className="v" style={match === 1 ? { color: "var(--accent)" } : undefined}>{Math.round(match * 100)} %</div>
                  <div className="l">Passung</div>
                </div>
              )}
            </div>
            <p>{s.tagline} {s.intro.split(".")[0]}.</p>
            {criteria.length > 0 && (
              <div className="criteria">
                {criteria.map((c, i) => (
                  <span key={c.key} className="criterion">
                    <span className={`check ${hits[i] ? "" : "off"}`}>{hits[i] ? <IconCheck size={10} strokeWidth={3} /> : <IconX size={9} strokeWidth={3} />}</span>
                    {c.label.replace(/^.*?: /, "")}
                  </span>
                ))}
              </div>
            )}
            <div className="kv">
              <div><div className="k">Bewertung</div><div className="v">{fmtMio(s.valuation)}</div></div>
              <div><div className="k">Team</div><div className="v">{s.team}</div></div>
              <div><div className="k">Runde</div><div className="v">{s.round?.open ? `ab ${fmtEur(s.round.minTicket)}` : "–"}</div></div>
            </div>
            <div className="post-actions">
              <button className="btn btn-primary grow">Profil öffnen <IconArrowUpRight size={16} /></button>
              <button className="icon-btn glass" style={{ width: 46, height: 46, color: saved ? "var(--accent)" : undefined }}
                onClick={() => toggle(shortlist, s.id, setShortlist)} aria-label="Zur Shortlist" aria-pressed={saved}>
                <IconBookmark size={18} fill={saved ? "currentColor" : "none"} />
              </button>
            </div>
          </article>
        );
      })}
    </>
  );
}
