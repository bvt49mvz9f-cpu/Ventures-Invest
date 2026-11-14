import type { Startup } from "@/lib/data";

export default function Logo({ s, size = 44 }: { s: Startup; size?: number }) {
  return (
    <div
      className="logo glass"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        fontSize: size * 0.36,
        color: `hsl(${s.hue} 75% 72%)`,
        background: `linear-gradient(160deg, hsl(${s.hue} 60% 50% / 0.22), hsl(${s.hue} 60% 30% / 0.08))`,
      }}
    >
      <span>{s.initial}</span>
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
