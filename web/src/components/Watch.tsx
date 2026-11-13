// The Saathi watch, drawn entirely in vector so it stays sharp at any size.
// `state` switches the screen between the calm face and the alert face.
import { useId } from "react";

export function Watch({
  state = "ok",
  className,
  title = "Saathi 4G safety watch",
}: {
  state?: "ok" | "alert";
  className?: string;
  title?: string;
}) {
  const id = useId().replace(/:/g, "");
  const alert = state === "alert";
  const accent = alert ? "#FF6B4A" : "#34C3AD";

  return (
    <svg viewBox="0 0 320 540" className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id={`${id}-strap`} x1="0" x2="1">
          <stop offset="0" stopColor="#1b1b1e" />
          <stop offset="0.5" stopColor="#2c2c31" />
          <stop offset="1" stopColor="#151517" />
        </linearGradient>
        <linearGradient id={`${id}-case`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2f2f4" />
          <stop offset="0.45" stopColor="#c9c9cf" />
          <stop offset="1" stopColor="#8e8e96" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#17171a" />
          <stop offset="1" stopColor="#050506" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={accent} stopOpacity="0.35" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Straps */}
      <path d="M98 150 C98 60 104 20 116 0 H204 C216 20 222 60 222 150 Z" fill={`url(#${id}-strap)`} />
      <path d="M98 390 C98 480 104 520 116 540 H204 C216 520 222 480 222 390 Z" fill={`url(#${id}-strap)`} />
      {[430, 456, 482, 508].map((y) => (
        <ellipse key={y} cx="160" cy={y} rx="7" ry="4.5" fill="#09090a" />
      ))}

      {/* Side buttons: the coral one is SOS */}
      <rect x="262" y="218" width="14" height="46" rx="6" fill="#FF6B4A" />
      <rect x="262" y="286" width="12" height="30" rx="5" fill="#9a9aa2" />

      {/* Case */}
      <rect x="52" y="140" width="216" height="260" rx="58" fill={`url(#${id}-case)`} />
      <rect x="62" y="150" width="196" height="240" rx="50" fill={`url(#${id}-glass)`} />

      {/* Screen */}
      <g fontFamily="Inter Variable, system-ui, sans-serif">
        <circle cx="160" cy="262" r="92" fill={`url(#${id}-glow)`} />

        {/* Status row */}
        <g fill="#a1a1a6">
          <rect x="92" y="186" width="3" height="5" rx="1" />
          <rect x="97" y="183" width="3" height="8" rx="1" />
          <rect x="102" y="180" width="3" height="11" rx="1" />
          <rect x="107" y="177" width="3" height="14" rx="1" />
          <text x="116" y="191" fontSize="12" fontWeight="600">
            4G
          </text>
          <rect x="202" y="179" width="24" height="12" rx="3.5" fill="none" stroke="#a1a1a6" strokeWidth="1.5" />
          <rect x="204.5" y="181.500" width="15" height="7" rx="1.5" />
          <rect x="227.500" y="182.500" width="2.500" height="5" rx="1" />
        </g>

        {alert ? (
          <>
            <circle cx="160" cy="258" r="40" fill="none" stroke="#FF6B4A" strokeWidth="3" opacity="0.35" />
            <circle cx="160" cy="258" r="29" fill="#FF6B4A" />
            <text x="160" y="264.500" textAnchor="middle" fontSize="18" fontWeight="800" fill="#fff" letterSpacing="0.5">
              SOS
            </text>
            <text x="160" y="328" textAnchor="middle" fontSize="15" fontWeight="600" fill="#fff">
              Calling Saathi…
            </text>
            <text x="160" y="350" textAnchor="middle" fontSize="12" fill="#a1a1a6">
              Help is on the line
            </text>
          </>
        ) : (
          <>
            <text
              x="160"
              y="278"
              textAnchor="middle"
              fontSize="62"
              fontWeight="700"
              fill="#fff"
              letterSpacing="-2.5"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              10:24
            </text>
            <text x="160" y="304" textAnchor="middle" fontSize="13" fill="#a1a1a6">
              Tuesday 12
            </text>
            <rect x="106" y="328" width="108" height="30" rx="15" fill="#34C3AD" fillOpacity="0.16" />
            <circle cx="124" cy="343" r="4" fill="#34C3AD" />
            <text x="136" y="347.500" fontSize="13" fontWeight="600" fill="#34C3AD">
              All is well
            </text>
          </>
        )}
      </g>

      {/* Glass reflection */}
      <rect x="62" y="150" width="196" height="240" rx="50" fill={`url(#${id}-shine)`} />
    </svg>
  );
}
