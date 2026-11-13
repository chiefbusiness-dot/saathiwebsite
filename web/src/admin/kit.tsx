// Small building blocks shared by the admin screens.
import type { ReactNode } from "react";
import { cx } from "../components/ui";

export function Panel({ title, intro, children, actions }: { title?: string; intro?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="rounded-3xl bg-paper p-5 shadow-soft ring-1 ring-black/5 sm:p-7">
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-[19px] font-semibold tracking-[-0.01em]">{title}</h2>}
            {intro && <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-ink-2">{intro}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Btn({
  children,
  onClick,
  kind = "primary",
  type = "button",
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  kind?: "primary" | "secondary" | "danger" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex h-11 items-center justify-center gap-2 rounded-pill px-5 text-[15px] font-semibold transition-colors disabled:cursor-default disabled:opacity-50",
        kind === "primary" && "bg-teal text-white hover:bg-teal-deep",
        kind === "secondary" && "bg-mist text-ink hover:bg-line",
        kind === "danger" && "bg-coral-soft text-coral-deep hover:bg-[#ffe1d9]",
        kind === "ghost" && "px-3 text-ink-2 hover:bg-mist hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

export const inputCls =
  "block w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors hover:border-ink-2/40 focus:border-teal focus:ring-4 focus:ring-teal-soft";

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[14px] font-semibold">{label}</span>
      {hint && <span className="mt-0.5 block text-[13px] text-ink-2">{hint}</span>}
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-1.5 block text-[13px] font-medium text-coral-deep">{error}</span>}
    </label>
  );
}

export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-6">
      <span>
        <span className="block text-[15px] font-semibold">{label}</span>
        {hint && <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-2">{hint}</span>}
      </span>
      <span className="relative mt-0.5 shrink-0">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span className="block h-7 w-12 rounded-full bg-line transition-colors peer-checked:bg-teal peer-focus-visible:ring-4 peer-focus-visible:ring-teal-soft" />
        <span className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export function Notice({ kind, children }: { kind: "ok" | "error"; children: ReactNode }) {
  return (
    <p
      role={kind === "error" ? "alert" : "status"}
      className={cx(
        "rounded-xl px-4 py-3 text-[14px] font-medium",
        kind === "ok" ? "bg-teal-soft text-teal-deep" : "bg-coral-soft text-coral-deep",
      )}
    >
      {children}
    </p>
  );
}

export const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  pilot: "In the pilot",
  not_a_fit: "Not a fit",
};
export const statusTone: Record<string, string> = {
  new: "bg-coral-soft text-coral-deep",
  contacted: "bg-mist text-ink",
  pilot: "bg-teal-soft text-teal-deep",
  not_a_fit: "bg-mist text-ink-2",
};
export const ageLabels: Record<string, string> = { under60: "Under 60", "60-69": "60–69", "70-79": "70–79", "80plus": "80+" };
