import { useId } from "react";
import type { Startup } from "@/lib/data";

/**
 * Freistehende Bildmarken der Startups (ohne Kachel).
 * Melious, ZopaAI und Prevano sind den echten Logos nachempfunden (für Dunkelmodus angepasst),
 * die übrigen Startups sind fiktiv und haben ausgedachte Marken.
 * Aussparungen sind echte Masken, damit sie auf jedem Hintergrund funktionieren.
 */
export default function Logo({ s, size = 36 }: { s: Startup; size?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const m = `m${uid}`;
  const g = `g${uid}`;

  const marks: Record<string, React.ReactNode> = {
    // Vier Kacheln, zwei mit Viertelkreis-Aussparung → Stern in der Mitte
    melious: (
      <>
        <defs>
          <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5d86f0" />
            <stop offset=".55" stopColor="#9aa8f2" />
            <stop offset="1" stopColor="#e8c9da" />
          </linearGradient>
        </defs>
        <g fill={`url(#${g})`}>
          <rect x="3.5" y="3.5" width="11.8" height="11.8" rx="1.6" />
          <path d="M16.7 3.5h10.2a1.6 1.6 0 0 1 1.6 1.6v10.2a11.8 11.8 0 0 1-11.8-11.8z" />
          <path d="M3.5 16.7a11.8 11.8 0 0 1 11.8 11.8H5.1a1.6 1.6 0 0 1-1.6-1.6z" />
          <rect x="16.7" y="16.7" width="11.8" height="11.8" rx="1.6" />
        </g>
      </>
    ),
    // Grüne „AI-Box“ aus dem ZopaAI-Logo, mit ausgespartem Z
    zopa: (
      <>
        <mask id={m}>
          <rect width="32" height="32" fill="#fff" />
          <path d="M10.5 10.5h11l-11 11h11" fill="none" stroke="#000" strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />
        </mask>
        <rect x="3.5" y="3.5" width="25" height="25" rx="5" fill="#22c98a" mask={`url(#${m})`} />
      </>
    ),
    // Drei Balken wie im Prevano-Logo (oberer Balken hell statt dunkel für den Dunkelmodus)
    prevano: (
      <>
        <rect x="4" y="6" width="17" height="5.4" rx="2.7" fill="#e9e9ec" />
        <rect x="4" y="13.3" width="22" height="5.4" rx="2.7" fill="#e3262d" />
        <rect x="4" y="20.6" width="13.5" height="5.4" rx="2.7" fill="#8e8e93" />
      </>
    ),
    // Nordpfeil mit Blitz
    nordwatt: (
      <>
        <mask id={m}><rect width="32" height="32" fill="#fff" /><path d="M17.3 11.5 13 18.6h3.9l-1.3 5.9 4.5-7.8h-3.9z" fill="#000" /></mask>
        <path d="M16 3.2c.8 0 1.5.4 1.9 1.1l10.4 18.6c.8 1.5-.2 3.3-1.9 3.3H5.6c-1.7 0-2.7-1.8-1.9-3.3L14.1 4.3c.4-.7 1.1-1.1 1.9-1.1z" fill="#2fbf71" mask={`url(#${m})`} />
      </>
    ),
    // Weiches Kreuz mit Lichtpunkt
    klarheit: (
      <>
        <mask id={m}><rect width="32" height="32" fill="#fff" /><circle cx="16" cy="16" r="2.4" fill="#000" /></mask>
        <path d="M13 4h6a1.5 1.5 0 0 1 1.5 1.5V11.5h6A1.5 1.5 0 0 1 28 13v6a1.5 1.5 0 0 1-1.5 1.5h-6v6A1.5 1.5 0 0 1 19 28h-6a1.5 1.5 0 0 1-1.5-1.5v-6h-6A1.5 1.5 0 0 1 4 19v-6a1.5 1.5 0 0 1 1.5-1.5h6v-6A1.5 1.5 0 0 1 13 4z" fill="#8b7cff" mask={`url(#${m})`} />
      </>
    ),
    // Endlosschleife
    loopcycle: (
      <path d="M16 16c-2.6-3.4-4.6-5-7-5a5 5 0 0 0 0 10c2.4 0 4.4-1.6 7-5s4.6-5 7-5a5 5 0 0 1 0 10c-2.4 0-4.4-1.6-7-5z" fill="none" stroke="#a3e635" strokeWidth="3.6" strokeLinecap="round" />
    ),
    // Aufsteigende Balken
    finlytics: (
      <>
        <rect x="4.5" y="17" width="6" height="10" rx="3" fill="#fbbf24" opacity=".5" />
        <rect x="13" y="11" width="6" height="16" rx="3" fill="#fbbf24" opacity=".78" />
        <rect x="21.5" y="4.5" width="6" height="22.5" rx="3" fill="#fbbf24" />
      </>
    ),
    // Sechseck mit Gelenk
    kernel: (
      <>
        <mask id={m}><rect width="32" height="32" fill="#fff" /><circle cx="16" cy="16" r="4.2" fill="#000" /></mask>
        <path d="M14 3.6a4 4 0 0 1 4 0l8.4 4.9a4 4 0 0 1 2 3.4v9.8a4 4 0 0 1-2 3.4L18 28.4a4 4 0 0 1-4 0l-8.4-4.9a4 4 0 0 1-2-3.4v-9.8a4 4 0 0 1 2-3.4z" fill="#c084fc" mask={`url(#${m})`} />
      </>
    ),
    // Gestapelte Schichten
    grundstoff: (
      <>
        <rect x="4" y="21" width="24" height="6" rx="3" fill="#f97350" />
        <rect x="7" y="13" width="18" height="6" rx="3" fill="#f97350" opacity=".7" />
        <rect x="10" y="5" width="12" height="6" rx="3" fill="#f97350" opacity=".4" />
      </>
    ),
    // Aufgehende Sonne
    lumen: (
      <>
        <path d="M6 22a10 10 0 0 1 20 0z" fill="#60a5fa" />
        <path d="M16 4.5v4M6.2 9.6l2.8 2.8M25.8 9.6 23 12.4M3.5 18h3.2M25.3 18h3.2" stroke="#60a5fa" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="4" y="24.5" width="24" height="3" rx="1.5" fill="#60a5fa" opacity=".45" />
      </>
    ),
  };

  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 32 32" role="img" aria-label={`${s.name} Logo`}>
      {marks[s.id] ?? <text x="16" y="21" textAnchor="middle" fontSize="15" fontWeight="700" fill={`hsl(${s.hue} 85% 68%)`}>{s.initial}</text>}
    </svg>
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
