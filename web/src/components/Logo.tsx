import type { Startup } from "@/lib/data";

/**
 * Original-Logos der Startups aus /public/logos (von den Websites der Startups übernommen).
 * Nur die Bildmarke ohne Schriftzug; wo das Original auf Schwarz unsichtbar wäre,
 * wird die offizielle Dunkelmodus- bzw. Markenfarbe verwendet.
 */
const LOGOS = new Set([
  "melious", "zopa", "prevano", "detesia", "quantpi", "netbird", "kertos", "inputlab", "simplyblock", "lubis",
]);

export default function Logo({ s, size = 36 }: { s: Startup; size?: number }) {
  if (!LOGOS.has(s.id)) {
    return (
      <svg className="logo" width={size} height={size} viewBox="0 0 32 32" role="img" aria-label={`${s.name} Logo`}>
        <text x="16" y="21" textAnchor="middle" fontSize="15" fontWeight="700" fill={`hsl(${s.hue} 85% 68%)`}>{s.initial}</text>
      </svg>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- kleine SVG-Dateien, kein Bild-Optimizer nötig
    <img className="logo" src={`/logos/${s.id}.svg`} width={size} height={size} style={{ padding: Math.round(size * 0.1) }} alt={`${s.name} Logo`} />
  );
}

/** Farbige, unscharfe Lichtflächen als Platzhalter für Bilder/Videos */
export function Orbs({ hue, big = false }: { hue: number; big?: boolean }) {
  const k = big ? 1.6 : 1;
  return (
    <>
      <span className="orb" style={{ width: 220 * k, height: 220 * k, left: "-10%", top: "-20%", background: `hsl(${hue} 80% 50% / 0.55)` }} />
      <span className="orb" style={{ width: 180 * k, height: 180 * k, right: "-8%", bottom: "-25%", background: `hsl(${(hue + 30) % 360} 70% 40% / 0.5)` }} />
      <span className="orb" style={{ width: 120 * k, height: 120 * k, left: "45%", top: "30%", background: `hsl(${(hue + 340) % 360} 60% 60% / 0.25)` }} />
    </>
  );
}
