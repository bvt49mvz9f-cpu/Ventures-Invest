// Beispieldaten für den Prototyp. Zahlen, Bewertungen und Positionen sind erfunden.

export type Stage = "Pre-Seed" | "Seed" | "Series A";

/** Runde mit laufenden Teilabschlüssen (Rolling Closing) – Beispielwerte, keine Produktparameter. */
export type Round = {
  name: string;
  /** Enddatum der Angebotsdauer (ISO) */
  endDate: string;
  /** Angestrebtes Volumen – keine Auszahlungsvoraussetzung */
  target: number;
  /** Rundenobergrenze – maximal annehmbares Gesamtvolumen */
  cap: number;
  /** Verbindliches Finanzierungsminimum, falls vorhanden */
  fundingMinimum?: number;
  /** Mindestbetrag je Zeichnung */
  minTicket: number;
  /** Beispiel-Schwelle für einen Teilabschluss (abschließbares Kapital) */
  closingThreshold: number;
  /** Volumen wirksam abgeschlossener Investments (kumuliert) */
  closed: number;
  /** Volumen offener, noch nicht abgeschlossener Zeichnungen */
  openCommitments: number;
  /** Eingegangene Zahlungen, Prüfungen/Fristen noch offen */
  pendingPayments: number;
  /** Bestätigt an das Startup ausgezahltes Kapital (Brutto) */
  paidOut: number;
  /** Tranchenhistorie */
  tranches: { label: string; volume: number; date: string }[];
  open: boolean;
};

export type Startup = {
  id: string;
  name: string;
  legalName: string;
  initial: string;
  hue: number;
  sector: string;
  stage: Stage;
  city: string;
  founded: number;
  team: number;
  tagline: string;
  intro: string;
  tags: string[];
  /** Preis je Anteil bei der letzten Bewertung (EUR) – interne Rechengröße für den geschätzten Wert */
  sharePrice: number;
  lastValuationDate: string;
  /** Datum des letzten Startup-Updates (ISO) */
  lastUpdate: string;
  /** Überprüfbare Fakten statt Gütesiegel (fiktive Beispiele) */
  badges: string[];
  valuation: number; // Post-Money in EUR
  round?: Round;
  videoLength: string;
};

/** Verbleibender Zeichnungsrahmen: Obergrenze minus abgeschlossen und offen gezeichnet. */
export function remainingSpace(r: Round) {
  return Math.max(0, r.cap - r.closed - r.openCommitments);
}

export const startups: Startup[] = [
  {
    id: "melious",
    name: "Melious AI",
    legalName: "Melious AI GmbH",
    initial: "M",
    hue: 228,
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
    lastValuationDate: "2026-10-02",
    lastUpdate: "2026-11-10",
    badges: ["Lead-Investor", "Bezahltes Pilotprojekt"],
    valuation: 12_000_000,
    round: {
      name: "Seed II",
      endDate: "2026-12-30",
      target: 300_000,
      cap: 300_000,
      minTicket: 100,
      closingThreshold: 10_000,
      closed: 72_000,
      openCommitments: 3_500,
      pendingPayments: 1_500,
      paidOut: 50_000,
      tranches: [
        { label: "Teilabschluss 1", volume: 10_000, date: "2026-11-04" },
        { label: "Teilabschluss 2", volume: 20_000, date: "2026-11-08" },
        { label: "Teilabschluss 3", volume: 20_000, date: "2026-11-12" },
      ],
      open: true,
    },
    videoLength: "1:42",
  },
  {
    id: "zopa",
    name: "Zopa AI",
    legalName: "ZopaAI GmbH",
    initial: "Z",
    hue: 155,
    sector: "AI",
    stage: "Seed",
    city: "Saarbrücken",
    founded: 2025,
    team: 20,
    tagline: "Die strategische KI für den B2B-Vertrieb.",
    intro:
      "Wir quantifizieren Potenziale und Risiken jedes Kunden und geben Vertriebsteams belastbare Empfehlungen und Prognosen – wissenschaftlich validiert, halluzinationsfrei und gemeinsam mit dem DFKI entwickelt.",
    tags: ["B2B-Sales", "DeepTech", "DFKI", "SaaS"],
    sharePrice: 18.6,
    lastValuationDate: "2026-09-12",
    lastUpdate: "2026-11-08",
    badges: ["10 Pilotkunden"],
    valuation: 8_500_000,
    round: {
      name: "Seed",
      endDate: "2027-01-12",
      target: 150_000,
      cap: 150_000,
      minTicket: 50,
      closingThreshold: 10_000,
      closed: 0,
      openCommitments: 0,
      pendingPayments: 0,
      paidOut: 0,
      tranches: [],
      open: true,
    },
    videoLength: "0:58",
  },
  {
    id: "prevano",
    name: "Prevano",
    legalName: "Prevano GmbH",
    initial: "P",
    hue: 355,
    sector: "Sales",
    stage: "Pre-Seed",
    city: "Saarbrücken",
    founded: 2025,
    team: 5,
    tagline: "Der richtige Kunde. Der richtige Moment. Die richtige Vorstellung.",
    intro:
      "Prevano erkennt, wann ein potenzieller Kunde bereit ist – und über wen in deinem Netzwerk die beste Vorstellung gelingt. Platzhaltertext: bitte durch echte Beschreibung ersetzen.",
    tags: ["B2B", "Warm Intros", "Netzwerk"],
    sharePrice: 9.4,
    lastValuationDate: "2026-06-20",
    lastUpdate: "2026-10-01",
    badges: ["EXIST-Förderung"],
    valuation: 3_200_000,
    round: {
      name: "Pre-Seed",
      endDate: "2026-12-18",
      target: 60_000,
      cap: 60_000,
      minTicket: 25,
      closingThreshold: 10_000,
      closed: 24_600,
      openCommitments: 500,
      pendingPayments: 900,
      paidOut: 10_000,
      tranches: [
        { label: "Teilabschluss 1", volume: 10_000, date: "2026-11-06" },
        { label: "Teilabschluss 2", volume: 14_600, date: "2026-11-13" },
      ],
      open: true,
    },
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
    lastValuationDate: "2026-08-04",
    lastUpdate: "2026-11-04",
    badges: ["Umsatz seit 2024"],
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
    lastValuationDate: "2026-07-15",
    lastUpdate: "2026-11-12",
    badges: ["Lead-Investor", "Medizinisch geprüft"],
    valuation: 15_000_000,
    round: {
      name: "Seed Extension",
      endDate: "2026-12-05",
      target: 100_000,
      cap: 100_000,
      minTicket: 100,
      closingThreshold: 10_000,
      closed: 88_000,
      openCommitments: 4_200,
      pendingPayments: 2_800,
      paidOut: 70_000,
      tranches: [
        { label: "Teilabschluss 1", volume: 10_000, date: "2026-10-28" },
        { label: "Teilabschluss 2", volume: 30_000, date: "2026-11-04" },
        { label: "Teilabschluss 3", volume: 30_000, date: "2026-11-10" },
      ],
      open: true,
    },
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
    lastValuationDate: "2026-05-28",
    lastUpdate: "2026-09-12",
    badges: ["Patent angemeldet"],
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
    lastValuationDate: "2026-09-01",
    lastUpdate: "2026-10-20",
    badges: ["400 Beta-Nutzer"],
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
    lastValuationDate: "2026-10-20",
    lastUpdate: "2026-10-28",
    badges: ["Patent angemeldet", "Serienaufträge"],
    valuation: 42_000_000,
    round: {
      name: "Series A+",
      endDate: "2026-12-22",
      target: 400_000,
      cap: 400_000,
      minTicket: 250,
      closingThreshold: 10_000,
      closed: 140_000,
      openCommitments: 8_000,
      pendingPayments: 3_500,
      paidOut: 120_000,
      tranches: [
        { label: "Teilabschluss 1", volume: 40_000, date: "2026-11-02" },
        { label: "Teilabschluss 2", volume: 50_000, date: "2026-11-08" },
        { label: "Teilabschluss 3", volume: 50_000, date: "2026-11-13" },
      ],
      open: true,
    },
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
    lastValuationDate: "2026-04-10",
    lastUpdate: "2026-08-25",
    badges: ["EXIST-Förderung", "Laborprototyp"],
    valuation: 2_500_000,
    round: {
      name: "Pre-Seed",
      endDate: "2027-01-10",
      target: 50_000,
      cap: 50_000,
      minTicket: 25,
      closingThreshold: 10_000,
      closed: 9_000,
      openCommitments: 2_400,
      pendingPayments: 1_100,
      paidOut: 0,
      tranches: [],
      open: true,
    },
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
    lastValuationDate: "2026-08-22",
    lastUpdate: "2026-10-22",
    badges: ["Lead-Investor", "Umsatz seit 2025"],
    valuation: 11_000_000,
    videoLength: "1:20",
  },
];

export type Position = { startupId: string; shares: number; invested: number; payouts: number };

export const positions: Position[] = [
  { startupId: "melious", shares: 60, invested: 1800, payouts: 0 },
  { startupId: "zopa", shares: 90, invested: 1200, payouts: 0 },
  { startupId: "prevano", shares: 120, invested: 1128, payouts: 0 },
  { startupId: "nordwatt", shares: 45, invested: 860, payouts: 150 },
  { startupId: "klarheit", shares: 30, invested: 900, payouts: 0 },
  { startupId: "kernel", shares: 12, invested: 960, payouts: 0 },
];

export type Reel = { id: string; startupId: string; title: string; caption: string; likes: number; comments: number; kind: string };

export const reels: Reel[] = [
  { id: "r1", startupId: "melious", kind: "Pitch", title: "60 Sekunden Pitch", caption: "Warum europäische KI nicht langsamer sein muss – live aus unserem Büro in Saarbrücken.", likes: 1240, comments: 86 },
  { id: "r2", startupId: "zopa", kind: "Behind the scenes", title: "Halluzinationsfrei?", caption: "Warum unsere Prognosen nachprüfbar sind – erklärt in 50 Sekunden aus dem DFKI-Labor.", likes: 980, comments: 54 },
  { id: "r3", startupId: "prevano", kind: "Idee", title: "Der richtige Moment", caption: "Woran du erkennst, dass ein Kunde jetzt bereit für ein Gespräch ist.", likes: 412, comments: 23 },
  { id: "r4", startupId: "kernel", kind: "Demo", title: "Einlernen per Vormachen", caption: "Unser Cobot sieht einmal zu – und packt danach 600 Teile pro Stunde.", likes: 2310, comments: 140 },
  { id: "r5", startupId: "nordwatt", kind: "Lustig", title: "Der Speicher im Keller", caption: "Was unsere Installateure im Keller schon alles gefunden haben (Teil 3).", likes: 1688, comments: 97 },
];

export type Post = {
  id: string;
  startupId: string;
  ago: string;
  text: string;
  media?: { kind: "image" | "video"; caption: string; length?: string };
  likes: number;
  comments: number;
};

export const posts: Post[] = [
  {
    id: "p1", startupId: "melious", ago: "2 Std.",
    text: "Ab heute laufen über 60 Open-Weight-Modelle bei uns – alle auf europäischer Infrastruktur. 🇪🇺\n\nDanke an alle, die uns in der Beta Feedback gegeben haben. Als Nächstes: eigene Fine-Tunes für Unternehmenskunden.",
    media: { kind: "video", caption: "Unser Vorstellungsvideo", length: "1:42" }, likes: 214, comments: 31,
  },
  {
    id: "p2", startupId: "zopa", ago: "5 Std.",
    text: "Neu in ZopaAI: Prognosen für jeden Bestandskunden – inklusive Risiko-Score und konkreter Empfehlung für das nächste Gespräch. Entwickelt gemeinsam mit dem DFKI und wissenschaftlich validiert.",
    likes: 96, comments: 18,
  },
  {
    id: "p3", startupId: "prevano", ago: "gestern",
    text: "Kaltakquise hat eine Antwortquote von 2 %. Eine persönliche Vorstellung über einen gemeinsamen Kontakt: 38 %. Genau darum bauen wir Prevano 👇",
    media: { kind: "image", caption: "2 % → 38 % Antwortquote" }, likes: 158, comments: 22,
  },
  {
    id: "p4", startupId: "kernel", ago: "gestern",
    text: "Unser 100. Cobot ist ausgeliefert – an einen Familienbetrieb in Aachen, der seit 1921 Zahnräder fertigt. Team-Foto vor der Halle 📸",
    media: { kind: "image", caption: "Auslieferung Nr. 100" }, likes: 412, comments: 47,
  },
  {
    id: "p5", startupId: "klarheit", ago: "vor 2 Tagen",
    text: "Drei Teilabschlüsse sind abgeschlossen: 70.000 € sind bei uns angekommen. Die Runde läuft weiter – wir nehmen noch Zeichnungen bis zur Obergrenze an.",
    likes: 73, comments: 9,
  },
  {
    id: "p6", startupId: "nordwatt", ago: "vor 3 Tagen",
    text: "Neues Projekt in Hamburg-Altona: 48 Wohnungen, ein Speicher im Keller, im Schnitt 31 % weniger Stromkosten für die Mieter*innen.",
    media: { kind: "video", caption: "Rundgang durch den Keller", length: "2:05" }, likes: 188, comments: 14,
  },
];

export const byId =(id: string) => startups.find((s) => s.id === id)!;
