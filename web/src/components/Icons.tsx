import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export const IconHome = (p: P) => <Base {...p}><path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z" /></Base>;
export const IconPlay = (p: P) => <Base {...p}><path d="M7 4.5v15l13-7.5z" /></Base>;
export const IconPlayFilled = (p: P) => <Base {...p} fill="currentColor" stroke="none"><path d="M7 4.5v15l13-7.5z" /></Base>;
export const IconSearch = (p: P) => <Base {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></Base>;
export const IconX = (p: P) => <Base {...p}><path d="M6 6l12 12M18 6 6 18" /></Base>;
export const IconChevron = (p: P) => <Base {...p}><path d="m9 6 6 6-6 6" /></Base>;
export const IconArrowUpRight = (p: P) => <Base {...p}><path d="M7 17 17 7M8 7h9v9" /></Base>;
export const IconHeart = (p: P) => <Base {...p}><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" /></Base>;
export const IconChat = (p: P) => <Base {...p}><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l.9-4.4A8 8 0 1 1 20 12z" /></Base>;
export const IconShare = (p: P) => <Base {...p}><path d="M12 15V3m0 0-4 4m4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></Base>;
export const IconBookmark = (p: P) => <Base {...p}><path d="M6 3.5h12V21l-6-4-6 4z" /></Base>;
export const IconSliders = (p: P) => <Base {...p}><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></Base>;
export const IconCheck = (p: P) => <Base {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Base>;
export const IconSparkle = (p: P) => <Base {...p}><path d="M12 3.5 13.8 10l6.7 2-6.7 2L12 20.5 10.2 14l-6.7-2 6.7-2z" /></Base>;
export const IconPin = (p: P) => <Base {...p}><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></Base>;
export const IconUsers = (p: P) => <Base {...p}><circle cx="9" cy="8" r="3.3" /><path d="M3 20c.6-3.3 3-5 6-5s5.4 1.7 6 5M16 5a3 3 0 0 1 0 6M18 15c1.8.6 2.8 2.2 3 5" /></Base>;
export const IconTrend = (p: P) => <Base {...p}><path d="m3 17 6-6 4 4 8-8M15 7h6v6" /></Base>;
export const IconVolume = (p: P) => <Base {...p}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" /></Base>;
