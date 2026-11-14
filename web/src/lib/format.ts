const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const eur2 = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = new Intl.NumberFormat("de-DE", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: "always" });
const num = new Intl.NumberFormat("de-DE");

export const fmtEur = (v: number) => eur.format(v);
export const fmtEur2 = (v: number) => eur2.format(v);
export const fmtPct = (v: number) => pct.format(v);
export const fmtNum = (v: number) => num.format(v);
export const fmtMio = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} Mio. €` : fmtEur(v);
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });
export const fmtCompact = (v: number) =>
  v >= 1000 ? `${(v / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 })}k` : String(v);
