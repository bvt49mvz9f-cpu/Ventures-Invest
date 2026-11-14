"use client";

import { createPortal } from "react-dom";

/** Rendert Overlays direkt in <body>, damit sie über der Navigation liegen. */
export default function Portal({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}
