"use client";

import { useEffect, useRef, useState } from "react";
import Portfolio from "./Portfolio";
import Feed from "./Feed";
import Screening from "./Screening";
import { IconHome, IconPlay, IconSearch } from "./Icons";

const tabs = [
  { key: "feed", label: "Feed", Icon: IconPlay },
  { key: "portfolio", label: "Portfolio", Icon: IconHome },
  { key: "screening", label: "Screening", Icon: IconSearch },
] as const;

export default function AppShell() {
  const pager = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);

  // Start in der Mitte (Portfolio)
  useEffect(() => {
    const el = pager.current;
    if (el) el.scrollLeft = el.clientWidth;
  }, []);

  const onScroll = () => {
    const el = pager.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) setActive(i);
  };

  const go = (i: number) => {
    pager.current?.scrollTo({ left: i * pager.current.clientWidth, behavior: "smooth" });
    setActive(i);
  };

  return (
    <>
      <div className="ambient" aria-hidden="true"><span className="a1" /><span className="a2" /><span className="a3" /></div>
      <main className="app">
        <div className="pager" ref={pager} onScroll={onScroll}>
          <section className="page" aria-label="Feed"><Feed /></section>
          <section className="page" aria-label="Portfolio"><Portfolio onOpenScreening={() => go(2)} /></section>
          <section className="page" aria-label="Screening"><Screening /></section>
        </div>
      </main>
      <div className="nav-wrap">
        <nav className="nav glass glass-strong" aria-label="Hauptnavigation">
          <span className="nav-indicator glass glass-strong" style={{ transform: `translateX(${active * 100}%)` }} />
          {tabs.map(({ key, label, Icon }, i) => (
            <button key={key} onClick={() => go(i)} aria-current={active === i ? "page" : undefined}>
              <Icon size={21} />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
