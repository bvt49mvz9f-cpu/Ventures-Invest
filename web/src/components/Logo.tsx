import type { Startup } from "@/lib/data";

export default function Logo({ s, size = 42 }: { s: Startup; size?: number }) {
  return (
    <div
      className="logo"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        fontSize: size * 0.4,
        color: `hsl(${s.hue} 85% 68%)`,
        background: `hsl(${s.hue} 30% 12%)`,
      }}
    >
      {s.initial}
    </div>
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
