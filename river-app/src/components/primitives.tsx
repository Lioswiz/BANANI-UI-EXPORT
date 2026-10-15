/**
 * Shared primitives. Sizes come from tools/measure.py, which read the real
 * pixel bounds out of the export (mockups are 1125px = 375pt wide, so every
 * measurement is divided by 3).
 */
import type { ReactNode } from "react";

import { SearchIcon } from "../lib/icons";

/* --------------------------------------------------------------- marks */

/** The "rv" app mark: 32px ink square, 10px radius. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid size-8 shrink-0 place-items-center rounded-[10px] bg-ink ${className}`}
    >
      <span className="text-[13px] font-extrabold tracking-[-0.02em] text-white">
        rv
      </span>
    </div>
  );
}

/** Lime "beta" pill, 41x20. */
export function BetaChip() {
  return (
    <span className="rounded-full bg-zest px-[9px] py-[3px] text-[11px] leading-none font-bold text-ink">
      beta
    </span>
  );
}

/** Screen title: 20px extra-bold lowercase. */
export function Title({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-[20px] leading-none font-extrabold tracking-[-0.02em]">
      {children}
    </h1>
  );
}

/* -------------------------------------------------------------- chrome */

/** White circular header action, 34px. */
export function IconButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-[34px] place-items-center rounded-full border border-hairline bg-surface text-ink transition active:scale-95"
    >
      {children}
    </button>
  );
}

/** Filled pill button — brand pink by default, 30-32px tall. */
export function PillButton({
  children,
  tone = "brand",
  size = "md",
  onClick,
  className = "",
}: {
  children: ReactNode;
  tone?: "brand" | "ink" | "zest";
  size?: "sm" | "md";
  onClick?: () => void;
  className?: string;
}) {
  const tones = {
    brand: "bg-brand text-white",
    ink: "bg-ink text-white",
    zest: "bg-zest text-ink",
  };
  const sizes = {
    sm: "h-[30px] px-[15px] text-[13px]",
    md: "h-8 px-[17px] text-[14px]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full font-bold transition active:scale-95 ${tones[tone]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

/** Hairline outlined pill, e.g. the "View" action on activity rows. */
export function GhostButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-[30px] shrink-0 rounded-full border border-hairline px-[13px] text-[12px] font-bold text-ink transition active:scale-95"
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------- form bits */

/** Search / message field: 40px tall sunken pill. */
export function SearchField({
  placeholder,
  value,
  onChange,
  trailing,
  className = "",
}: {
  placeholder: string;
  value?: string;
  onChange?: (v: string) => void;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-10 items-center gap-[10px] rounded-full bg-sunken px-[15px] ${className}`}
    >
      <SearchIcon size={18} className="shrink-0 text-muted" />
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-ink outline-none placeholder:text-muted"
      />
      {trailing}
    </div>
  );
}

/** Filter chip, 34px tall. Active is an ink pill, rest are outlined. */
export function Chip({
  children,
  active = false,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[34px] shrink-0 rounded-full px-[17px] text-[14px] font-bold transition ${
        active
          ? "bg-ink text-white"
          : "border border-hairline bg-surface text-ink active:scale-95"
      }`}
    >
      {children}
    </button>
  );
}

/** Horizontal rail that scrolls without a scrollbar. */
export function Rail({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`no-scrollbar flex gap-2 overflow-x-auto ${className}`}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------- avatar */

export function Avatar({
  src,
  alt,
  size = 48,
  online = false,
  className = "",
}: {
  src: string;
  alt: string;
  size?: number;
  online?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="size-full rounded-full object-cover"
      />
      {online && (
        <span
          className="absolute right-0 bottom-0 rounded-full border-[2.5px] border-cream bg-online"
          style={{ width: size * 0.3, height: size * 0.3 }}
        />
      )}
    </div>
  );
}

/** Small grey tag chip used on chat rows (Close / Group / Channel). */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="shrink-0 rounded-full bg-sunken px-[9px] py-[3px] text-[12px] leading-none font-semibold text-ink/70">
      {children}
    </span>
  );
}

/** Section heading inside a screen, e.g. "Channels you follow". */
export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[17px] leading-none font-extrabold tracking-[-0.01em]">
      {children}
    </h2>
  );
}
