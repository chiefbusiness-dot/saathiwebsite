// The family app preview: an interactive demo inside a phone frame. Sample data only.
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { useLang } from "../i18n";
import { LogoMark } from "./Logo";
import { cx } from "./ui";
import { IconBattery, IconCalendar, IconCheck, IconFall, IconHeadset, IconHome, IconPin, IconShield, IconSignal, IconSos } from "./Icons";

type Tab = "home" | "map" | "alerts" | "calls";
const STEP_MS = 2400;

function AppCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("rounded-2xl bg-paper p-4 shadow-soft ring-1 ring-black/5", className)}>{children}</div>;
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <AppCard className="!p-3">
      <span className="text-teal">{icon}</span>
      <p className="mt-2 text-[11px] text-ink-2">{label}</p>
      <p className="nums text-[15px] font-semibold leading-tight">{value}</p>
    </AppCard>
  );
}

function HomeTab() {
  const h = useLang().t.app.home;
  return (
    <div className="space-y-3">
      <p className="text-[13px] text-ink-2">{h.greeting}</p>
      <div className="rounded-3xl bg-teal p-5 text-white">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/20 text-[20px] font-bold">
            {h.name.slice(0, 1)}
          </span>
          <div>
            <p className="text-[13px] text-white/85">{h.name}</p>
            <p className="text-[22px] font-bold leading-tight">{h.status}</p>
          </div>
          <IconShield size={28} className="ml-auto shrink-0" />
        </div>
        <p className="mt-4 text-[13px] text-white/90">{h.sub}</p>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        <Stat icon={<IconBattery size={20} />} label={h.battery} value={h.batteryValue} />
        <Stat icon={<IconSignal size={20} />} label={h.signal} value={h.signalValue} />
        <Stat icon={<IconHeadset size={20} />} label={h.plan} value={h.planValue} />
      </div>
      <AppCard>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[13px] font-semibold">{h.lastCheck}</p>
          <p className="nums text-[12px] text-ink-2">{h.lastCheckTime}</p>
        </div>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{h.lastNote}</p>
      </AppCard>
      <AppCard className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-semibold">{h.lastAlert}</p>
        <p className="text-[12px] text-ink-2">{h.lastAlertValue}</p>
      </AppCard>
    </div>
  );
}

/** A stylised map: no real map data, just enough to read as "a place". */
export function MiniMap({ alert = false, className }: { alert?: boolean; className?: string }) {
  const m = useLang().t.app.map;
  const reduce = useReducedMotion();
  const pin = alert ? "#FF6B4A" : "#0E8F7E";
  return (
    <svg viewBox="0 0 320 300" className={className} role="img" aria-label={`${m.place}, ${m.address}`}>
      <rect width="320" height="300" fill="#EAF1EE" />
      <path d="M-10 250 C60 215 90 240 150 205 S260 180 330 140 V310 H-10Z" fill="#D5E7DF" />
      <path d="M-10 60 C50 85 120 40 200 70 S300 50 330 80" fill="none" stroke="#BFD9EA" strokeWidth="14" strokeLinecap="round" />
      <g fill="none" stroke="#fff" strokeLinecap="round">
        <path d="M-10 170 H330" strokeWidth="13" />
        <path d="M110 -10 V310" strokeWidth="13" />
        <path d="M230 -10 L205 310" strokeWidth="9" />
        <path d="M-10 115 L330 135" strokeWidth="7" />
        <path d="M-10 235 H330" strokeWidth="7" />
        <path d="M45 115 V310" strokeWidth="6" />
      </g>
      <g fill="#DCE4E0">
        <rect x="126" y="184" width="34" height="38" rx="5" />
        <rect x="126" y="246" width="60" height="28" rx="5" />
        <rect x="58" y="184" width="40" height="38" rx="5" />
        <rect x="248" y="150" width="46" height="70" rx="5" />
        <rect x="126" y="128" width="62" height="28" rx="5" />
        <rect x="6" y="184" width="28" height="38" rx="5" />
      </g>
      <g fontFamily="Inter Variable, Noto Sans Devanagari, system-ui, sans-serif" fontSize="10.5" fill="#6E6E73" fontWeight="500">
        <circle cx="268" cy="110" r="4" fill="#9AA8A2" />
        <text x="277" y="114">{m.temple}</text>
        <circle cx="66" cy="96" r="4" fill="#9AA8A2" />
        <text x="14" y="88">{m.market}</text>
      </g>
      {/* The watch's position */}
      <g transform="translate(168 150)">
        {!reduce && (
          <circle r="16" fill={pin} opacity="0.25">
            <animate attributeName="r" values="12;34;12" dur={alert ? "1.2s" : "2.8s"} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0;0.35" dur={alert ? "1.2s" : "2.8s"} repeatCount="indefinite" />
          </circle>
        )}
        <circle r="18" fill={pin} opacity="0.18" />
        <circle r="9" fill={pin} stroke="#fff" strokeWidth="3" />
      </g>
    </svg>
  );
}

function MapTab() {
  const m = useLang().t.app.map;
  return (
    <div className="space-y-3">
      <h3 className="text-[18px] font-bold">{m.title}</h3>
      <div className="overflow-hidden rounded-3xl ring-1 ring-black/5">
        <MiniMap className="block h-auto w-full" />
      </div>
      <AppCard className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-soft text-teal-deep">
          <IconHome size={20} />
        </span>
        <div>
          <p className="text-[15px] font-semibold leading-tight">{m.place}</p>
          <p className="text-[13px] text-ink-2">{m.address}</p>
        </div>
      </AppCard>
      <p className="text-center text-[12px] text-ink-2">{m.updated}</p>
    </div>
  );
}

type Alert = { kind: string; title: string; when: string; outcome: string; log: { t: string; text: string }[] };

function AlertCard({ a, open }: { a: Alert; open?: boolean }) {
  const al = useLang().t.app.alerts;
  const fall = a.kind === "fall";
  return (
    <details open={open} className="group rounded-2xl bg-paper shadow-soft ring-1 ring-black/5">
      <summary className="flex cursor-pointer list-none gap-3 p-4 [&::-webkit-details-marker]:hidden">
        <span
          className={cx(
            "grid h-10 w-10 shrink-0 place-items-center rounded-full",
            fall ? "bg-coral-soft text-coral-deep" : "bg-mist text-ink-2",
          )}
        >
          {fall ? <IconFall size={20} /> : <IconSos size={20} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[15px] font-semibold leading-tight">{a.title}</span>
            <span className="rounded-pill bg-teal-soft px-2 py-0.5 text-[11px] font-semibold text-teal-deep">
              {fall ? al.resolved : al.falseAlarm}
            </span>
          </span>
          <span className="mt-1 block text-[12px] text-ink-2">{a.when}</span>
          <span className="mt-1 block text-[13px] text-ink-2">{a.outcome}</span>
        </span>
      </summary>
      <div className="border-t border-line px-4 pb-4 pt-3">
        <p className="eyebrow !text-[10px] text-ink-2">{al.log}</p>
        <ol className="mt-3 space-y-2.5">
          {a.log.map((l, i) => (
            <li key={i} className="flex gap-3 text-[13px] leading-snug">
              <span className="nums w-9 shrink-0 font-semibold text-teal-deep">{l.t}</span>
              <span className="text-ink-2">{l.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}

function AlertsTab({ demoAlert }: { demoAlert: boolean }) {
  const { alerts, sim } = useLang().t.app;
  const demo: Alert = {
    kind: "fall",
    title: sim.newTitle,
    when: sim.newWhen,
    outcome: sim.newOutcome,
    log: sim.steps.map((s, i) => ({ t: `0:0${i}`, text: s.title })),
  };
  return (
    <div className="space-y-3">
      <h3 className="text-[18px] font-bold">{alerts.title}</h3>
      {demoAlert && <AlertCard a={demo} open />}
      {alerts.items.map((a, i) => (
        <AlertCard key={a.when} a={a} open={!demoAlert && i === 0} />
      ))}
    </div>
  );
}

function CallsTab() {
  const c = useLang().t.app.calls;
  return (
    <div className="space-y-3">
      <h3 className="text-[18px] font-bold">{c.title}</h3>
      <p className="flex items-center gap-2 text-[12px] text-ink-2">
        <IconHeadset size={16} className="text-teal" /> {c.by}
      </p>
      {c.items.map((it) => (
        <AppCard key={it.day}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[14px] font-semibold">{it.day}</p>
            <p className="nums text-[12px] text-ink-2">{it.time}</p>
          </div>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{it.note}</p>
        </AppCard>
      ))}
    </div>
  );
}

/** The alert screen that takes over the phone while the demo runs. */
function SimScreen({ step, onClose }: { step: number; onClose: () => void }) {
  const s = useLang().t.app.sim;
  const reduce = useReducedMotion();
  const done = step >= s.steps.length;
  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col bg-paper"
      initial={reduce ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: 30 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
    >
      <div className={cx("px-5 pb-5 pt-12 text-white transition-colors duration-500", done ? "bg-teal" : "bg-coral-deep")}>
        <div className="flex items-center gap-3">
          <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/20">
            {!done && !reduce && <span className="absolute inset-0 animate-ping rounded-full bg-white/30" />}
            {done ? <IconCheck size={24} strokeWidth={2.5} /> : <IconFall size={24} />}
          </span>
          <div className="min-w-0">
            <p className="text-[20px] font-bold leading-tight">{done ? s.doneTitle : s.title}</p>
            <p className="text-[13px] text-white/90">{done ? s.doneBody : s.sub}</p>
          </div>
          {!done && (
            <span className="ml-auto shrink-0 rounded-pill bg-white/20 px-2.5 py-1 text-[11px] font-bold uppercase">{s.live}</span>
          )}
        </div>
      </div>

      <div className="relative h-28 shrink-0 overflow-hidden border-b border-line">
        <MiniMap alert={!done} className="absolute inset-0 h-full w-full" />
      </div>

      <ol className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {s.steps.map((st, i) => {
          if (i > step) return null;
          const current = i === step && !done;
          return (
            <motion.li
              key={st.title}
              className="flex gap-3"
              initial={reduce ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span
                className={cx(
                  "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full",
                  current ? "bg-coral-soft text-coral-deep" : "bg-teal text-white",
                )}
              >
                {current ? <span className="h-2 w-2 animate-pulse rounded-full bg-coral-deep" /> : <IconCheck size={14} strokeWidth={3} />}
              </span>
              <div>
                <p className="text-[14px] font-semibold leading-snug">{st.title}</p>
                <p className="text-[12.5px] leading-snug text-ink-2">{st.body}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>

      {done && (
        <div className="px-5 pb-6">
          <button type="button" onClick={onClose} className="h-12 w-full rounded-pill bg-teal text-[15px] font-semibold text-white hover:bg-teal-deep">
            {s.close}
          </button>
        </div>
      )}
    </motion.div>
  );
}

/**
 * `run` counts how many times the demo has been started; each increase plays the simulation.
 * `onRunning` reports whether the demo is in progress.
 */
export function PhoneApp({ run, onRunning }: { run: number; onRunning: (r: boolean) => void }) {
  const { t } = useLang();
  const a = t.app;
  const [tab, setTab] = useState<Tab>("home");
  const [step, setStep] = useState(-1); // -1: demo not showing
  const [demoAlert, setDemoAlert] = useState(false);
  const total = a.sim.steps.length;

  // Start the demo whenever `run` increases.
  useEffect(() => {
    if (run > 0) setStep(0);
  }, [run]);

  // Advance one step at a time until the end.
  useEffect(() => {
    if (step < 0 || step >= total) return;
    const id = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [step, total]);

  useEffect(() => {
    onRunning(step >= 0 && step < total);
  }, [step, total, onRunning]);

  const close = () => {
    setStep(-1);
    setDemoAlert(true);
    setTab("alerts");
  };

  const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: "home", label: a.tabs.home, icon: <IconHome size={22} /> },
    { id: "map", label: a.tabs.map, icon: <IconPin size={22} /> },
    { id: "alerts", label: a.tabs.alerts, icon: <IconSos size={22} /> },
    { id: "calls", label: a.tabs.calls, icon: <IconCalendar size={22} /> },
  ];

  return (
    <div className="mx-auto w-full max-w-[380px] rounded-[52px] bg-night p-3 shadow-lift">
      <div className="relative flex h-[720px] flex-col overflow-hidden rounded-[40px] bg-mist text-ink">
        {/* Status bar */}
        <div
          className={cx(
            "relative z-30 flex h-11 shrink-0 items-center justify-between px-7 text-[13px] font-semibold transition-colors",
            step >= 0 ? "text-white" : "text-ink",
          )}
          aria-hidden="true"
        >
          <span className="nums">9:41</span>
          <span className="absolute left-1/2 top-2.5 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
          <span className="flex items-center gap-1.5">
            <IconSignal size={15} />
            <IconBattery size={18} />
          </span>
        </div>

        {/* App header */}
        <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-1">
          <span className="flex items-center gap-2">
            <LogoMark size={24} />
            <span className="text-[17px] font-bold" lang="en">
              saathi
            </span>
          </span>
          <span className="rounded-pill bg-paper px-2.5 py-1 text-[11px] font-semibold text-ink-2 ring-1 ring-line">{a.page.badge}</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {tab === "home" && <HomeTab />}
          {tab === "map" && <MapTab />}
          {tab === "alerts" && <AlertsTab demoAlert={demoAlert} />}
          {tab === "calls" && <CallsTab />}
        </div>

        {/* Tab bar */}
        <div role="tablist" className="grid shrink-0 grid-cols-4 border-t border-line bg-paper px-2 pb-4 pt-2">
          {tabs.map((x) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={tab === x.id}
              onClick={() => setTab(x.id)}
              className={cx(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold transition-colors",
                tab === x.id ? "text-teal-deep" : "text-ink-2 hover:text-ink",
              )}
            >
              {x.icon}
              {x.label}
            </button>
          ))}
        </div>

        <AnimatePresence>{step >= 0 && <SimScreen step={step} onClose={close} />}</AnimatePresence>
      </div>
    </div>
  );
}
