// Beispieldaten für den Prototyp. Zahlen, Bewertungen und Positionen sind erfunden.

export type Stage = "Pre-Seed" | "Seed" | "Series A";

export type Startup = {
  id: string;
  name: string;
  legalName: string;
  initial: string;
  hue: number; // Farbton für Logo-Kachel und Cover
  sector: string;
  stage: Stage;
  city: string;
  founded: number;
  team: number;
  tagline: string;
  intro: string;
  tags: string[];
  /** Preis je Anteil bei der letzten Bewertung (EUR) */
  sharePrice: number;
  /** Preis je Anteil bei der vorletzten Bewertung (für Top-Mover) */
  prevSharePrice: number;
  lastValuationDate: string;
  valuation: number; // Post-Money in EUR
  round?: { name: string; startsOrEnds: string; filled: number; minTicket: number; open: boolean };
  videoLength: string;
};

export const startups: Startup[] = [
  {
    id: "melious",
    name: "Melious AI",
    legalName: "Melious AI GmbH",
    initial: "M",
    hue: 24,
    sector: "AI",
    stage: "Seed",
    city: "Saarbrücken",
    founded: 2025,
    team: 9,
    tagline: "Europäische KI – souverän und schnell.",
    intro:
      "Wir bündeln führende Open-Weight-Modelle hinter einer API und betreiben sie ausschließlich auf europäischer Infrastruktur. So können Unternehmen KI nutzen, ohne ihre Daten aus der EU zu geben.",
    tags: ["B2B", "LLM-Gateway", "EU-Cloud", "DSGVO"],
    sharePrice: 42.8,
    prevSharePrice: 34.5,
    lastValuationDate: "2026-10-02",
    valuation: 12_000_000,
    round: { name: "Seed II", startsOrEnds: "endet am 30. Nov.", filled: 0.72, minTicket: 100, open: true },
    videoLength: "1:42",
  },
  {
    id: "zoopa",
    name: "Zoopa AI",
    legalName: "Zoopa AI GmbH",
    initial: "Z",
    hue: 200,
    sector: "AI",
    stage: "Seed",
    city: "Saarbrücken",
    founded: 2025,
    team: 20,
    tagline: "Vertrieb, der sich selbst organisiert.",
    intro:
      "Unsere KI-Agenten recherchieren Leads, schreiben personalisierte Ansprachen und pflegen das CRM – damit Sales-Teams wieder Zeit für Gespräche haben.",
    tags: ["Sales", "KI-Agenten", "SaaS"],
    sharePrice: 18.6,
    prevSharePrice: 15.2,
    lastValuationDate: "2026-09-12",
    valuation: 8_500_000,
    round: { name: "Seed", startsOrEnds: "startet am 12. Dez.", filled: 0, minTicket: 50, open: true },
    videoLength: "0:58",
  },
  {
    id: "privano",
    name: "Privano",
    legalName: "Privano GmbH",
    initial: "P",
    hue: 160,
    sector: "Privacy",
    stage: "Pre-Seed",
    city: "Saarbrücken",
    founded: 2025,
    team: 5,
    tagline: "Datenschutz, der einfach funktioniert.",
    intro:
      "Privano automatisiert Datenschutz-Prozesse für kleine und mittlere Unternehmen – von Auskunftsanfragen bis zur Dokumentation. Platzhaltertext: bitte durch echte Beschreibung ersetzen.",
    tags: ["Privacy-Tech", "KMU", "Compliance"],
    sharePrice: 9.4,
    prevSharePrice: 9.4,
    lastValuationDate: "2026-06-20",
    valuation: 3_200_000,
    round: { name: "Pre-Seed", startsOrEnds: "endet am 18. Dez.", filled: 0.41, minTicket: 25, open: true },
    videoLength: "1:15",
  },
  {
    id: "nordwatt",
    name: "NORDWATT",
    legalName: "Nordwatt Energy GmbH",
    initial: "N",
    hue: 140,
    sector: "Climate",
    stage: "Series A",
    city: "Hamburg",
    founded: 2022,
    team: 34,
    tagline: "Batteriespeicher für jedes Mehrfamilienhaus.",
    intro:
      "Wir machen Mieter*innen zu Stromproduzenten: modulare Speicher im Keller, gesteuert per Software, finanziert über die Stromersparnis.",
    tags: ["Energie", "Hardware", "Mieterstrom"],
    sharePrice: 21.4,
    prevSharePrice: 19.1,
    lastValuationDate: "2026-08-04",
    valuation: 28_000_000,
    videoLength: "2:05",
  },
  {
    id: "klarheit",
    name: "Klarheit Health",
    legalName: "Klarheit Health GmbH",
    initial: "K",
    hue: 250,
    sector: "Health",
    stage: "Seed",
    city: "Berlin",
    founded: 2023,
    team: 14,
    tagline: "Befunde, die man versteht.",
    intro:
      "Klarheit übersetzt Arztbriefe und Laborwerte in verständliche Sprache – medizinisch geprüft und direkt in der App der Patient*innen.",
    tags: ["Digital Health", "B2C", "Medizin"],
    sharePrice: 33.1,
    prevSharePrice: 30.2,
    lastValuationDate: "2026-07-15",
    valuation: 15_000_000,
    round: { name: "Seed Extension", startsOrEnds: "endet am 5. Dez.", filled: 0.88, minTicket: 100, open: true },
    videoLength: "1:30",
  },
  {
    id: "loopcycle",
    name: "Loopcycle",
    legalName: "Loopcycle GmbH",
    initial: "L",
    hue: 90,
    sector: "Climate",
    stage: "Seed",
    city: "München",
    founded: 2023,
    team: 11,
    tagline: "Mehrweg für den Onlinehandel.",
    intro: "Versandverpackungen, die 50-mal zurückkommen – mit Pfand, Tracking und einem Netz aus Rückgabestellen.",
    tags: ["Circular Economy", "E-Commerce", "Logistik"],
    sharePrice: 18.6,
    prevSharePrice: 19.06,
    lastValuationDate: "2026-05-28",
    valuation: 7_000_000,
    videoLength: "1:05",
  },
  {
    id: "finlytics",
    name: "Finlytics",
    legalName: "Finlytics GmbH",
    initial: "F",
    hue: 35,
    sector: "Fintech",
    stage: "Seed",
    city: "Frankfurt",
    founded: 2024,
    team: 8,
    tagline: "Finanzplanung für Selbstständige.",
    intro: "Steuern, Rücklagen und Liquidität auf einen Blick – automatisch aus dem Geschäftskonto berechnet.",
    tags: ["B2C", "Steuern", "Banking"],
    sharePrice: 27.9,
    prevSharePrice: 25.9,
    lastValuationDate: "2026-09-01",
    valuation: 9_000_000,
    videoLength: "0:48",
  },
  {
    id: "kernel",
    name: "Kernel Robotics",
    legalName: "Kernel Robotics GmbH",
    initial: "K",
    hue: 280,
    sector: "Robotics",
    stage: "Series A",
    city: "Aachen",
    founded: 2021,
    team: 41,
    tagline: "Roboterarme, die man in einer Stunde einlernt.",
    intro: "Unsere Cobots lernen Handgriffe per Vormachen – gebaut für mittelständische Fertigungen ohne eigene Robotik-Abteilung.",
    tags: ["Industrie", "Hardware", "Automatisierung"],
    sharePrice: 96.5,
    prevSharePrice: 77.4,
    lastValuationDate: "2026-10-20",
    valuation: 42_000_000,
    round: { name: "Series A+", startsOrEnds: "endet am 22. Dez.", filled: 0.35, minTicket: 250, open: true },
    videoLength: "2:20",
  },
  {
    id: "grundstoff",
    name: "Grundstoff",
    legalName: "Grundstoff Materials GmbH",
    initial: "G",
    hue: 15,
    sector: "Climate",
    stage: "Pre-Seed",
    city: "Leipzig",
    founded: 2025,
    team: 4,
    tagline: "Zement ohne CO₂.",
    intro: "Ein Bindemittel aus Industrieabfällen, das klassischen Zement im Hochbau ersetzt.",
    tags: ["Bau", "Materialien", "DeepTech"],
    sharePrice: 6.2,
    prevSharePrice: 6.2,
    lastValuationDate: "2026-04-10",
    valuation: 2_500_000,
    round: { name: "Pre-Seed", startsOrEnds: "endet am 10. Jan.", filled: 0.18, minTicket: 25, open: true },
    videoLength: "1:10",
  },
  {
    id: "lumen",
    name: "Lumen Legal",
    legalName: "Lumen Legal GmbH",
    initial: "L",
    hue: 210,
    sector: "AI",
    stage: "Seed",
    city: "Köln",
    founded: 2024,
    team: 12,
    tagline: "Verträge prüfen in Minuten.",
    intro: "Lumen liest Verträge, markiert Risiken und schlägt Formulierungen vor – trainiert auf deutschem Recht.",
    tags: ["LegalTech", "LLM", "B2B"],
    sharePrice: 24.0,
    prevSharePrice: 26.1,
    lastValuationDate: "2026-08-22",
    valuation: 11_000_000,
    videoLength: "1:20",
  },
];

export type Position = { startupId: string; shares: number; invested: number };

export const positions: Position[] = [
  { startupId: "melious", shares: 60, invested: 1800 },
  { startupId: "zoopa", shares: 90, invested: 1200 },
  { startupId: "privano", shares: 120, invested: 1128 },
  { startupId: "nordwatt", shares: 45, invested: 860 },
  { startupId: "klarheit", shares: 30, invested: 900 },
  { startupId: "kernel", shares: 12, invested: 960 },
];

export type Reel = { id: string; startupId: string; title: string; caption: string; likes: number; comments: number; kind: string };

export const reels: Reel[] = [
  { id: "r1", startupId: "melious", kind: "Pitch", title: "60 Sekunden Pitch", caption: "Warum europäische KI nicht langsamer sein muss – live aus unserem Büro in Saarbrücken.", likes: 1240, comments: 86 },
  { id: "r2", startupId: "zoopa", kind: "Behind the scenes", title: "Ein Tag bei Zoopa", caption: "Unser Agent hat heute 400 Leads recherchiert. Wir haben Kaffee getrunken. ☕️", likes: 980, comments: 54 },
  { id: "r3", startupId: "privano", kind: "Idee", title: "DSGVO in 3 Klicks", caption: "So beantwortest du eine Auskunftsanfrage, ohne einen Anwalt anzurufen.", likes: 412, comments: 23 },
  { id: "r4", startupId: "kernel", kind: "Demo", title: "Einlernen per Vormachen", caption: "Unser Cobot sieht einmal zu – und packt danach 600 Teile pro Stunde.", likes: 2310, comments: 140 },
  { id: "r5", startupId: "nordwatt", kind: "Lustig", title: "Der Speicher im Keller", caption: "Was unsere Installateure im Keller schon alles gefunden haben (Teil 3).", likes: 1688, comments: 97 },
];

export const byId = (id: string) => startups.find((s) => s.id === id)!;
