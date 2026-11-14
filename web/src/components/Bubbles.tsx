"use client";

import { useMemo } from "react";

type Item = { label: string; share: number };
type Placed = Item & { x: number; y: number; r: number };

/** Einfaches Kreis-Packing: größter Kreis in die Mitte, Rest möglichst nah drumherum. */
function pack(items: Item[], gap = 0.03): Placed[] {
  const sorted = [...items].sort((a, b) => b.share - a.share);
  const placed: Placed[] = [];
  for (const it of sorted) {
    const r = Math.sqrt(it.share) * 0.5;
    if (!placed.length) { placed.push({ ...it, x: 0, y: 0, r }); continue; }
    let best: { x: number; y: number; d: number } | null = null;
    for (const p of placed) {
      for (let a = 0; a < 360; a += 5) {
        const rad = (a * Math.PI) / 180;
        const x = p.x + Math.cos(rad) * (p.r + r + gap);
        const y = p.y + Math.sin(rad) * (p.r + r + gap);
        if (!placed.every((q) => Math.hypot(q.x - x, q.y - y) >= q.r + r + gap - 1e-6)) continue;
        const d = Math.hypot(x * 0.7, y * 1.3); // eher in die Breite
        if (!best || d < best.d) best = { x, y, d };
      }
    }
    placed.push({ ...it, x: best!.x, y: best!.y, r });
  }
  return placed;
}

const W = 100, H = 72;

export default function Bubbles({ items }: { items: Item[] }) {
  const layout = useMemo(() => {
    const p = pack(items);
    const minX = Math.min(...p.map((c) => c.x - c.r)), maxX = Math.max(...p.map((c) => c.x + c.r));
    const minY = Math.min(...p.map((c) => c.y - c.r)), maxY = Math.max(...p.map((c) => c.y + c.r));
    const s = Math.min((W * 0.98) / (maxX - minX), (H * 0.98) / (maxY - minY));
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    return p.map((c) => ({ ...c, left: (c.x - cx) * s + W / 2, top: (((c.y - cy) * s + H / 2) / H) * 100, size: 2 * c.r * s }));
  }, [items]);

  return (
    <div className="bubbles" role="img" aria-label={items.map((i) => `${i.label} ${Math.round(i.share * 100)} %`).join(", ")}>
      {layout.map((b, i) => (
        <div key={b.label} className={`bubble ${i === 0 ? "top" : ""} ${b.size < 24 ? "sm" : ""}`}
          style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.size}%`, aspectRatio: "1" }}>
          <span className="p">{Math.round(b.share * 100)} %</span>
          <span className="l">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
