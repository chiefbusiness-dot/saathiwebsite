import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)}>{children}</div>;
}

type Tone = "light" | "mist" | "dark";
const toneClass: Record<Tone, string> = {
  light: "bg-paper text-ink",
  mist: "bg-mist text-ink",
  dark: "bg-night text-on-night",
};

export function Section({
  children,
  tone = "light",
  id,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cx(toneClass[tone], "py-20 sm:py-28 lg:py-32", className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("eyebrow text-teal", className)}>{children}</p>;
}

type Variant = "primary" | "secondary" | "ghost" | "onDark";
const variantClass: Record<Variant, string> = {
  primary: "bg-teal text-white hover:bg-teal-deep shadow-[0_1px_0_rgb(255_255_255/0.2)_inset]",
  secondary: "bg-mist text-ink hover:bg-line",
  ghost: "text-teal hover:text-teal-deep px-0",
  onDark: "bg-white text-night hover:bg-mist",
};

export function Button({
  to,
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  to: string;
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  className?: string;
}) {
  const cls = cx(
    "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-colors duration-200",
    size === "lg" ? "h-14 px-8 text-[17px]" : "h-11 px-6 text-[15px]",
    variant === "ghost" && "!h-auto",
    variantClass[variant],
    className,
  );
  return to.startsWith("#") ? (
    <a href={to} className={cls}>
      {children}
    </a>
  ) : (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}

export function Pill({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "coral" | "night" }) {
  const t = {
    teal: "bg-teal-soft text-teal-deep",
    coral: "bg-coral-soft text-coral-deep",
    night: "bg-night-2 text-on-night-2 ring-1 ring-night-line",
  }[tone];
  return (
    <span className={cx("inline-flex items-center gap-2 rounded-pill px-3.5 py-1.5 text-[13px] font-medium", t)}>
      {children}
    </span>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("rounded-card bg-paper p-7 shadow-soft ring-1 ring-black/5 sm:p-8", className)}>{children}</div>;
}

export { cx };
