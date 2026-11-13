// The Saathi mark: two linked rings, one person beside another ("saathi" means companion).
export function LogoMark({ size = 28, onDark = false }: { size?: number; onDark?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill={onDark ? "#34C3AD" : "#0E8F7E"} />
      <circle cx="12.5" cy="16" r="6" fill="none" stroke={onDark ? "#0B0B0D" : "#fff"} strokeWidth="2.6" />
      <circle cx="19.5" cy="16" r="6" fill="none" stroke={onDark ? "#0B0B0D" : "#fff"} strokeWidth="2.6" opacity="0.85" />
    </svg>
  );
}

export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark onDark={onDark} />
      <span className={`text-[21px] font-bold tracking-[-0.03em] ${onDark ? "text-on-night" : "text-ink"}`}>saathi</span>
    </span>
  );
}
