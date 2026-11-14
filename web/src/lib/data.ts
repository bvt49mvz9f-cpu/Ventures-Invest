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
  // ── Echte Startups (Recherche Nov. 2026). Name, Ort, Gründung, Produkt und Fakten sind öffentlich belegt;
  //    Bewertungen, Anteilspreise und Runden auf dieser Plattform sind erfunden.
  {
    id: "detesia",
    name: "Detesia",
    legalName: "Detesia GmbH",
    initial: "D",
    hue: 205,
    sector: "Security",
    stage: "Pre-Seed",
    city: "Saarbrücken",
    founded: 2024,
    team: 6,
    tagline: "Deepfakes erkennen, bevor sie Schaden anrichten.",
    intro:
      "Detesia prüft Bilder, Videos und Audio automatisch auf Manipulationen und liefert forensisch nachvollziehbare Ergebnisse – für Versicherer, Medienhäuser und Ermittlungsbehörden. Ausgründung aus dem CISPA in Saarbrücken.",
    tags: ["Deepfake-Erkennung", "Forensik", "B2B", "CISPA"],
    sharePrice: 8.9,
    lastValuationDate: "2026-07-15",
    lastUpdate: "2026-11-12",
    badges: ["CISPA-Ausgründung", "Helmholtz-Transfer"],
    valuation: 4_000_000,
    round: {
      name: "Pre-Seed",
      endDate: "2026-12-05",
      target: 100_000,
      cap: 100_000,
      minTicket: 50,
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
    id: "quantpi",
    name: "QuantPi",
    legalName: "QuantPi GmbH",
    initial: "Q",
    hue: 220,
    sector: "AI",
    stage: "Seed",
    city: "Saarbrücken",
    founded: 2020,
    team: 35,
    tagline: "Vertrauenswürdige KI – geprüft, bevor sie live geht.",
    intro:
      "QuantPi testet KI-Modelle auf Robustheit, Fairness und Erklärbarkeit und hilft Unternehmen, die Anforderungen des EU AI Act nachzuweisen. Ausgründung aus CISPA und Universität des Saarlandes.",
    tags: ["AI Act", "KI-Governance", "B2B", "SaaS"],
    sharePrice: 31.5,
    lastValuationDate: "2026-08-22",
    lastUpdate: "2026-10-30",
    badges: ["2,5 Mio. € Pre-Seed 2022", "EIC-Förderung"],
    valuation: 18_000_000,
    round: {
      name: "Seed",
      endDate: "2027-01-10",
      target: 250_000,
      cap: 250_000,
      minTicket: 100,
      closingThreshold: 10_000,
      closed: 40_000,
      openCommitments: 2_400,
      pendingPayments: 1_100,
      paidOut: 30_000,
      tranches: [
        { label: "Teilabschluss 1", volume: 20_000, date: "2026-11-03" },
        { label: "Teilabschluss 2", volume: 20_000, date: "2026-11-11" },
      ],
      open: true,
    },
    videoLength: "1:20",
  },
  {
    id: "netbird",
    name: "NetBird",
    legalName: "NetBird GmbH",
    initial: "N",
    hue: 22,
    sector: "Security",
    stage: "Series A",
    city: "Berlin",
    founded: 2022,
    team: 28,
    tagline: "Zero-Trust-Netzwerke ohne Konfigurationsaufwand.",
    intro:
      "NetBird verbindet Geräte, Server und Clouds über ein sicheres Peer-to-Peer-Netz auf Basis von WireGuard – Open Source, in Minuten eingerichtet und ohne klassische VPN-Gateways.",
    tags: ["Open Source", "Zero Trust", "WireGuard", "B2B"],
    sharePrice: 64.0,
    lastValuationDate: "2026-01-20",
    lastUpdate: "2026-11-04",
    badges: ["10 Mio. $ Series A 2026", "Open Source"],
    valuation: 45_000_000,
    videoLength: "2:05",
  },
  {
    id: "kertos",
    name: "Kertos",
    legalName: "Kertos GmbH",
    initial: "K",
    hue: 285,
    sector: "Compliance",
    stage: "Series A",
    city: "München",
    founded: 2021,
    team: 80,
    tagline: "Europas Compliance-Desk – automatisiert.",
    intro:
      "Kertos automatisiert Datenschutz und Compliance von DSGVO über ISO 27001 bis NIS2 und DORA. Gestartet im Inkubator des CISPA, heute in München.",
    tags: ["DSGVO", "ISO 27001", "NIS2", "SaaS"],
    sharePrice: 96.5,
    lastValuationDate: "2025-09-18",
    lastUpdate: "2026-10-28",
    badges: ["14 Mio. € Series A 2025", "CISPA-Inkubator"],
    valuation: 60_000_000,
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
    id: "inputlab",
    name: "InputLab",
    legalName: "InputLab GmbH",
    initial: "I",
    hue: 192,
    sector: "DevTools",
    stage: "Pre-Seed",
    city: "Saarbrücken",
    founded: 2025,
    team: 5,
    tagline: "Synthetische Testdaten – vollständig und datenschutzkonform.",
    intro:
      "InputLab erzeugt komplett synthetische Testdaten für XML, JSON und OpenAPI, mit kontrollierter Abdeckung für kritische Software in Finanzen, Telekommunikation und Verwaltung. Ausgründung aus dem CISPA.",
    tags: ["Testing", "Synthetische Daten", "DSGVO", "B2B"],
    sharePrice: 6.2,
    lastValuationDate: "2026-05-12",
    lastUpdate: "2026-08-24",
    badges: ["CISPA-Ausgründung", "3 Pilotprojekte"],
    valuation: 2_500_000,
    round: {
      name: "Pre-Seed",
      endDate: "2027-01-20",
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
    id: "simplyblock",
    name: "simplyblock",
    legalName: "simplyblock GmbH",
    initial: "S",
    hue: 217,
    sector: "Cloud",
    stage: "Seed",
    city: "Berlin",
    founded: 2022,
    team: 18,
    tagline: "Schneller Block-Speicher für Kubernetes und die Cloud.",
    intro:
      "simplyblock bündelt NVMe-Speicher zu einem verteilten, softwaredefinierten Storage – mit Snapshots, Verschlüsselung und Schutz vor Ransomware, deutlich günstiger als klassischer Cloud-Speicher.",
    tags: ["Infrastruktur", "Kubernetes", "Storage", "B2B"],
    sharePrice: 27.9,
    lastValuationDate: "2026-03-01",
    lastUpdate: "2026-10-20",
    badges: ["2,75 Mio. $ Seed"],
    valuation: 14_000_000,
    videoLength: "0:48",
  },
  {
    id: "lubis",
    name: "LUBIS EDA",
    legalName: "LUBIS EDA GmbH",
    initial: "L",
    hue: 160,
    sector: "Chips",
    stage: "Seed",
    city: "Kaiserslautern",
    founded: 2021,
    team: 30,
    tagline: "Chips ohne Bugs – durch formale Verifikation.",
    intro:
      "LUBIS EDA erzeugt Verifikations-IP für digitale Chips automatisch und findet so Fehler, die Simulationen übersehen. Gefördert durch den EIC Accelerator, begleitet vom CISPA-Inkubator.",
    tags: ["Halbleiter", "Formale Verifikation", "DeepTech", "B2B"],
    sharePrice: 24.0,
    lastValuationDate: "2026-06-22",
    lastUpdate: "2026-09-12",
    badges: ["EIC Accelerator", "Kunden in der Chipindustrie"],
    valuation: 16_000_000,
    videoLength: "1:05",
  },
];

export type Position = { startupId: string; shares: number; invested: number; payouts: number };

export const positions: Position[] = [
  { startupId: "melious", shares: 60, invested: 1800, payouts: 0 },
  { startupId: "zopa", shares: 90, invested: 1200, payouts: 0 },
  { startupId: "prevano", shares: 120, invested: 1128, payouts: 0 },
  { startupId: "netbird", shares: 15, invested: 860, payouts: 150 },
  { startupId: "detesia", shares: 110, invested: 900, payouts: 0 },
  { startupId: "quantpi", shares: 34, invested: 960, payouts: 0 },
];

export type Reel = { id: string; startupId: string; title: string; caption: string; likes: number; comments: number; kind: string };

export const reels: Reel[] = [
  { id: "r1", startupId: "melious", kind: "Pitch", title: "60 Sekunden Pitch", caption: "Warum europäische KI nicht langsamer sein muss – live aus unserem Büro in Saarbrücken.", likes: 1240, comments: 86 },
  { id: "r2", startupId: "zopa", kind: "Behind the scenes", title: "Halluzinationsfrei?", caption: "Warum unsere Prognosen nachprüfbar sind – erklärt in 50 Sekunden aus dem DFKI-Labor.", likes: 980, comments: 54 },
  { id: "r3", startupId: "prevano", kind: "Idee", title: "Der richtige Moment", caption: "Woran du erkennst, dass ein Kunde jetzt bereit für ein Gespräch ist.", likes: 412, comments: 23 },
  { id: "r4", startupId: "detesia", kind: "Demo", title: "Echt oder Fake?", caption: "Wir lassen unsere Erkennung live gegen ein frisch erzeugtes Deepfake-Video antreten.", likes: 2310, comments: 140 },
  { id: "r5", startupId: "netbird", kind: "Behind the scenes", title: "VPN in 60 Sekunden", caption: "Vom leeren Laptop zum Zero-Trust-Netz – ohne einen einzigen offenen Port.", likes: 1688, comments: 97 },
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
    id: "p4", startupId: "quantpi", ago: "gestern",
    text: "Der EU AI Act gilt schrittweise – viele Unternehmen wissen noch nicht, welche ihrer KI-Systeme als hochriskant gelten. Wir haben eine kurze Checkliste gebaut, mit der ihr das in 10 Minuten einschätzen könnt 👇",
    media: { kind: "image", caption: "AI-Act-Checkliste" }, likes: 412, comments: 47,
  },
  {
    id: "p5", startupId: "detesia", ago: "vor 2 Tagen",
    text: "Drei Teilabschlüsse sind abgeschlossen: 70.000 € sind bei uns angekommen. Die Runde läuft weiter – wir nehmen noch Zeichnungen bis zur Obergrenze an.",
    likes: 73, comments: 9,
  },
  {
    id: "p6", startupId: "netbird", ago: "vor 3 Tagen",
    text: "Neues Release: Netzwerk-Routen lassen sich jetzt per Richtlinie für ganze Teams freigeben – ohne ein einziges Gateway. Wie immer Open Source auf GitHub.",
    media: { kind: "video", caption: "Release-Walkthrough", length: "2:05" }, likes: 188, comments: 14,
  },
];

export const byId =(id: string) => startups.find((s) => s.id === id)!;
