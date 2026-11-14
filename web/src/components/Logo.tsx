import { useId } from "react";
import type { Startup } from "@/lib/data";

/**
 * Freistehende Bildmarken der Startups (ohne Kachel), ausgedacht für den Prototyp.
 * Aussparungen sind echte Masken, damit sie auf jedem Hintergrund funktionieren.
 */
export default function Logo({ s, size = 36 }: { s: Startup; size?: number }) {
  const uid = useId().replace(/:/g, "");
  const m = `m-${uid}`;
  const g = `g-${uid}`;

  const marks: Record<string, React.ReactNode> = {
    melious: (
      <>
        <defs><linearGradient id={g} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffa25c" /><stop offset="1" stopColor="#ff5a14" /></linearGradient></defs>
        <path d="M5 26V13.5a5.5 5.5 0 0 1 11 0V26M16 13.5a5.5 5.5 0 0 1 11 0V26" fill="none" stroke={`url(#${g})`} strokeWidth="4.6" strokeLinecap="round" />
      </>
    ),
    zoopa: (
      <>
        <mask id={m}><rect width="32" height="32" fill="#fff" /><path d="M11 11h10l-10 10h10" fill="none" stroke="#000" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></mask>
        <circle cx="16" cy="16" r="13" fill="#3ba7ff" mask={`url(#${m})`} />
      </>
    ),
    privano: (
      <>
        <mask id={m}><rect width="32" height="32" fill="#fff" /><circle cx="16" cy="13.5" r="3" fill="#000" /><rect x="14.6" y="14" width="2.8" height="7" rx="1.4" fill="#000" /></mask>
        <path d="M16 3.5 26 7.5v8c0 6.4-4.3 10.9-10 13-5.7-2.1-10-6.6-10-13v-8z" fill="#34d399" mask={`url(#${m})`} />
      </>
    ),
    nordwatt: (
      <>
        <mask id={m}><rect width="32" height="32" fill="#fff" /><path d="M17.2 11 12.8 18.4h4l-1.4 6 4.6-8h-4z" fill="#000" /></mask>
        <path d="M16 3.2c.8 0 1.5.4 1.9 1.1l10.4 18.6c.8 1.5-.2 3.3-1.9 3.3H5.6c-1.7 0-2.7-1.8-1.9-3.3L14.1 4.3c.4-.7 1.1-1.1 1.9-1.1z" fill="#22c55e" mask={`url(#${m})`} />
      </>
    ),
    klarheit: (
      <>
        <path d="M12.5 4.5h7v8h8v7h-8v8h-7v-8h-8v-7h8z" fill="#8b7cff" strokeLinejoin="round" stroke="#8b7cff" strokeWidth="2.4" />
        <circle cx="16" cy="16" r="2.2" fill="#000" />
      </>
    ),
    loopcycle: (
      <path d="M16 16c-2.6-3.4-4.6-5-7-5a5 5 0 0 0 0 10c2.4 0 4.4-1.6 7-5s4.6-5 7-5a5 5 0 0 1 0 10c-2.4 0-4.4-1.6-7-5z" fill="none" stroke="#a3e635" strokeWidth="3.6" strokeLinecap="round" />
    ),
    finlytics: (
      <>
        <rect x="4.5" y="17" width="6" height="10" rx="3" fill="#fbbf24" opacity=".55" />
        <rect x="13" y="11" width="6" height="16" rx="3" fill="#fbbf24" opacity=".8" />
        <rect x="21.5" y="4.5" width="6" height="22.5" rx="3" fill="#fbbf24" />
      </>
    ),
    kernel: (
      <>
        <mask id={m}><rect width="32" height="32" fill="#fff" /><circle cx="16" cy="16" r="4.2" fill="#000" /></mask>
        <path d="M14 3.6a4 4 0 0 1 4 0l8.4 4.9a4 4 0 0 1 2 3.4v9.8a4 4 0 0 1-2 3.4L18 28.4a4 4 0 0 1-4 0l-8.4-4.9a4 4 0 0 1-2-3.4v-9.8a4 4 0 0 1 2-3.4z" fill="#c084fc" mask={`url(#${m})`} />
      </>
    ),
    grundstoff: (
      <>
        <rect x="4" y="21" width="24" height="6" rx="3" fill="#f97350" />
        <rect x="7" y="13" width="18" height="6" rx="3" fill="#f97350" opacity=".7" />
        <rect x="10" y="5" width="12" height="6" rx="3" fill="#f97350" opacity=".4" />
      </>
    ),
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
