"use client";

import { useMemo } from "react";

type Item = { label: string; share: number };
type Placed = Item & { x: number; y: number; r: number };

/** Einfaches Kreis-Packing: größter Kreis in die Mitte, Rest möglichst nah drumherum. */
function pack(items: Item[], gap = 0.035): Placed[] {
  const sorted = [...items].sort((a, b) => b.share - a.share);
  const placed: Placed[] = [];
  for (const it of sorted) {
    const r = Math.sqrt(it.share) * 0.5;
    if (!placed.length) { placed.push({ ...it, x: 0, y: 0, r }); continue; }
    let best: { x: number; y: number; d: number } | null = null;
    for (const p of placed) {
      for (let a = 0; a < 360; a += 6) {
        const rad = (a * Math.PI) / 180;
        const x = p.x + Math.cos(rad) * (p.r + r + gap);
        const y = p.y + Math.sin(rad) * (p.r + r + gap) * 1.0;
        const ok = placed.every((q) => Math.hypot(q.x - x, q.y - y) >= q.r + r + gap - 1e-6);
        if (!ok) continue;
        const d = Math.hypot(x * 0.8, y * 1.15); // leicht in die Breite ziehen
        if (!best || d < best.d) best = { x, y, d };
      }
    }
    placed.push({ ...it, x: best!.x, y: best!.y, r });
  }
  return placed;
}

const W = 100, H = 86;

export default function Bubbles({ items }: { items: Item[] }) {
  const layout = useMemo(() => {
    const p = pack(items);
    const minX = Math.min(...p.map((c) => c.x - c.r)), maxX = Math.max(...p.map((c) => c.x + c.r));
    const minY = Math.min(...p.map((c) => c.y - c.r)), maxY = Math.max(...p.map((c) => c.y + c.r));
    const s = Math.min((W * 0.96) / (maxX - minX), (H * 0.96) / (maxY - minY));
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    return p.map((c) => ({
      ...c,
      left: (c.x - cx) * s + W / 2,
      top: (((c.y - cy) * s + H / 2) / H) * 100,
      size: 2 * c.r * s,
    }));
  }, [items]);

  return (
    <div className="bubbles" role="img" aria-label={items.map((i) => `${i.label} ${Math.round(i.share * 100)} %`).join(", ")}>
      {layout.map((b, i) => (
        <div
          key={b.label}
          className={`bubble glass ${b.size < 26 ? "sm" : ""}`}
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: `${b.size}%`,
            aspectRatio: "1",
            animationDelay: `${i * -1.7}s`,
            ...(i === 0
              ? { ["--glass-fill" as string]: "radial-gradient(120% 120% at 30% 20%, rgba(255,140,70,0.30), rgba(255,107,31,0.10) 55%, rgba(255,107,31,0.04))" }
              : {}),
          }}
        >
          <span className="l">{b.label}</span>
          <span className="p" style={i === 0 ? { color: "var(--accent)" } : undefined}>{Math.round(b.share * 100)} %</span>
        </div>
      ))}
    </div>
  );
}
