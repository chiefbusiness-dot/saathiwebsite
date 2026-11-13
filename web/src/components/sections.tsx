// Shared page sections. Each reads its copy from the current language.
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLang } from "../i18n";
import { Button, Card, Container, Eyebrow, Pill, Section, cx } from "./ui";
import { Reveal } from "./Reveal";
import { Watch } from "./Watch";
import {
  IconArrow,
  IconBag,
  IconBattery,
  IconCalendar,
  IconCheck,
  IconFall,
  IconHeadset,
  IconPhone,
  IconPin,
  IconPlus,
  IconSignal,
  IconSos,
  IconX,
} from "./Icons";

const icons: Record<string, ReactNode> = {
  fall: <IconFall />,
  sos: <IconSos />,
  pin: <IconPin />,
  phone: <IconPhone />,
  battery: <IconBattery />,
  signal: <IconSignal />,
  headset: <IconHeadset />,
  calendar: <IconCalendar />,
  bag: <IconBag />,
};

export function IconTile({ name }: { name: string }) {
  return <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-soft text-teal-deep">{icons[name]}</span>;
}

export function SectionHead({
  eyebrow,
  title,
  lede,
  center = true,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <Reveal className={cx("max-w-3xl", center && "mx-auto text-center")}>
      <Eyebrow className={dark ? "!text-teal-bright" : undefined}>{eyebrow}</Eyebrow>
      <h2 className="headline mt-4">{title}</h2>
      {lede && <p className={cx("lede mt-5", dark ? "text-on-night-2" : "text-ink-2")}>{lede}</p>}
    </Reveal>
  );
}

/** Top of every inner page. */
export function PageHero({ eyebrow, title, lede, children }: { eyebrow: string; title: string; lede?: string; children?: ReactNode }) {
  return (
    <section className="bg-paper pb-14 pt-14 sm:pb-20 sm:pt-20">
      <Container className="max-w-4xl text-center">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="headline mt-4 !text-[clamp(2.25rem,5.6vw,4.25rem)]">{title}</h1>
        {lede && <p className="lede mx-auto mt-6 max-w-2xl text-ink-2">{lede}</p>}
        {children}
      </Container>
    </section>
  );
}

export function Problem() {
  const p = useLang().t.problem;
  return (
    <Section tone="mist">
      <Container>
        <SectionHead eyebrow={p.eyebrow} title={p.title} lede={p.lede} />
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {p.cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <Card className="h-full">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-coral-soft text-coral-deep">
                  <IconX size={20} />
                </span>
                <h3 className="title mt-6">{c.title}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{c.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="title mx-auto mt-14 max-w-2xl text-center">{p.close}</p>
        </Reveal>
      </Container>
    </Section>
  );
}

function CallCard() {
  const c = useLang().t.two.call;
  return (
    <div className="rounded-3xl bg-night-2 p-5 ring-1 ring-night-line">
      <div className="flex items-center gap-4">
        <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-teal text-white">
          <IconHeadset size={26} />
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-teal-bright ring-4 ring-night-2" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] text-on-night-2">{c.team}</p>
          <p className="text-[17px] font-semibold leading-snug">{c.calling}</p>
        </div>
        <span className="nums ml-auto text-[15px] text-on-night-2">00:30</span>
      </div>
      <div className="mt-5 space-y-2.5 text-[14px]">
        {c.steps.map((s) => (
          <div key={s} className="flex items-center gap-3 text-on-night-2">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal/25 text-teal-bright">
              <IconCheck size={13} strokeWidth={2.5} />
            </span>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TwoThings({ head = true }: { head?: boolean }) {
  const t = useLang().t.two;
  return (
    <Section className={head ? undefined : "!pt-0"}>
      <Container>
        {head && <SectionHead eyebrow={t.eyebrow} title={t.title} />}
        <div className={cx("grid grid-cols-1 gap-5 lg:grid-cols-2", head && "mt-14")}>
          <Reveal>
            <div className="flex h-full flex-col overflow-hidden rounded-card bg-mist">
              <div className="p-8 sm:p-10">
                <h3 className="headline !text-[clamp(1.75rem,3vw,2.5rem)]">{t.watch.title}</h3>
                <p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink-2">{t.watch.body}</p>
              </div>
              <div className="mt-auto flex justify-center px-8">
                <Watch className="-mb-24 h-[340px] w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.16)]" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col overflow-hidden rounded-card bg-night text-on-night">
              <div className="p-8 sm:p-10">
                <h3 className="headline !text-[clamp(1.75rem,3vw,2.5rem)]">{t.person.title}</h3>
                <p className="mt-4 max-w-md text-[17px] leading-relaxed text-on-night-2">{t.person.body}</p>
              </div>
              <div className="mt-auto px-6 pb-6 sm:px-10 sm:pb-10">
                <CallCard />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export function Features() {
  const f = useLang().t.features;
  return (
    <Section tone="mist">
      <Container>
        <SectionHead eyebrow={f.eyebrow} title={f.title} />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {f.items.map((it, i) => (
            <Reveal key={it.title} delay={(i % 3) * 0.08}>
              <Card className="h-full">
                <IconTile name={it.icon} />
                <h3 className="mt-6 text-[19px] font-semibold tracking-[-0.01em]">{it.title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{it.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ---------- The first five minutes: a scroll-driven story ---------- */

function MinuteStep({
  index,
  active,
  onEnter,
  time,
  title,
  body,
}: {
  index: number;
  active: number;
  onEnter: (i: number) => void;
  time: string;
  title: string;
  body: string;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  // A step becomes current when it crosses the middle band of the screen.
  const inBand = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inBand) onEnter(index);
  }, [inBand, index, onEnter]);

  const reached = reduce || index <= active;
  const current = index === active;
  return (
    <motion.li
      ref={ref}
      className="relative flex gap-6 pb-12 last:pb-0"
      animate={{ opacity: reached ? 1 : 0.38 }}
      transition={{ duration: 0.4 }}
    >
      <span
        className={cx(
          "nums relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full text-[15px] font-bold transition-colors duration-300",
          index === 0
            ? "bg-coral text-white"
            : current
              ? "bg-teal-bright text-night"
              : "bg-night-2 text-teal-bright ring-1 ring-night-line",
        )}
      >
        {index + 1}
      </span>
      <div className="pt-1">
        <p className={cx("nums eyebrow", index === 0 ? "text-coral" : "text-teal-bright")}>{time}</p>
        <h3 className="title mt-2">{title}</h3>
        <p className="mt-2 max-w-md text-[16px] leading-relaxed text-on-night-2">{body}</p>
      </div>
    </motion.li>
  );
}

export function Minutes() {
  const m = useLang().t.minutes;
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 55%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const step = m.steps[active];

  return (
    <Section tone="dark" id="first-five-minutes">
      <Container className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHead eyebrow={m.eyebrow} title={m.title} lede={m.lede} center={false} dark />
          <div className="mt-10 hidden items-center gap-6 lg:flex">
            <Watch state="alert" className="h-[300px] w-auto shrink-0" />
            <div className="min-h-[92px] flex-1 rounded-3xl bg-night-2 p-5 ring-1 ring-night-line" aria-hidden="true">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className={cx("nums eyebrow", active === 0 ? "text-coral" : "text-teal-bright")}>{step.time}</p>
                  <p className="mt-2 text-[17px] font-semibold leading-snug">{step.title}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div>
          <ol ref={listRef} className="relative">
            <span className="absolute bottom-6 left-[19.5px] top-6 w-px bg-night-line" aria-hidden="true" />
            {!reduce && (
              <motion.span
                className="absolute bottom-6 left-[19px] top-6 w-0.5 origin-top bg-teal-bright"
                style={{ scaleY: fill }}
                aria-hidden="true"
              />
            )}
            {m.steps.map((s, i) => (
              <MinuteStep key={s.title} index={i} active={active} onEnter={setActive} {...s} />
            ))}
          </ol>
          <p className="mt-10 pl-16 text-[13px] text-on-night-2">{m.note}</p>
        </div>
      </Container>
    </Section>
  );
}

export function AppTeaser() {
  const a = useLang().t.app.teaser;
  return (
    <Section tone="mist">
      <Container>
        <Reveal className="mx-auto flex max-w-5xl flex-col items-start gap-8 rounded-card bg-paper p-8 shadow-soft ring-1 ring-black/5 sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <Eyebrow>{a.eyebrow}</Eyebrow>
            <h2 className="headline mt-4 !text-[clamp(1.75rem,3.4vw,2.5rem)]">{a.title}</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-2">{a.body}</p>
          </div>
          <Button to="/app-preview" size="lg" className="shrink-0">
            {a.cta} <IconArrow size={20} />
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}

export function Care({ link = true }: { link?: boolean }) {
  const c = useLang().t.care;
  return (
    <Section>
      <Container>
        <SectionHead eyebrow={c.eyebrow} title={c.title} lede={c.lede} />
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {c.items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.08}>
              <div className="h-full rounded-card bg-mist p-8">
                <IconTile name={it.icon} />
                <h3 className="title mt-6">{it.title}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        {link && (
          <Reveal className="mt-10 text-center">
            <Button to="/care-plan" variant="ghost">
              {c.link} <IconArrow size={18} />
            </Button>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

function PriceCard({
  name,
  price,
  unit,
  points,
  badge,
  featured = false,
}: {
  name: string;
  price: string;
  unit: string;
  points: string[];
  badge?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={cx(
        "flex h-full flex-col rounded-card p-8 sm:p-10",
        featured ? "bg-night text-on-night" : "bg-paper shadow-soft ring-1 ring-black/5",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="title">{name}</h3>
        {badge && <Pill tone="night">{badge}</Pill>}
      </div>
      <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="nums text-[56px] font-bold leading-none tracking-[-0.04em]">{price}</span>
        <span className={featured ? "text-on-night-2" : "text-ink-2"}>{unit}</span>
      </p>
      <ul className="mt-8 space-y-3.5 text-[16px]">
        {points.map((p) => (
          <li key={p} className="flex gap-3">
            <IconCheck size={20} className={cx("mt-0.5 shrink-0", featured ? "text-teal-bright" : "text-teal")} />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PricingCards() {
  const p = useLang().t.pricing;
  return (
    <>
      <div className="relative mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
        <Reveal>
          <PriceCard {...p.watch} />
        </Reveal>
        <span
          className="absolute left-1/2 top-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-soft ring-1 ring-black/5 md:grid"
          aria-hidden="true"
        >
          <IconPlus size={20} />
        </span>
        <Reveal delay={0.1}>
          <PriceCard {...p.plan} featured />
        </Reveal>
      </div>
      <Reveal className="mt-10 flex flex-col items-center gap-6 text-center">
        <p className="max-w-xl text-[14px] text-ink-2">{p.note}</p>
        <Button to="/join" size="lg">
          {p.cta}
        </Button>
      </Reveal>
    </>
  );
}

export function Pricing() {
  const p = useLang().t.pricing;
  return (
    <Section tone="mist" id="pricing">
      <Container>
        <SectionHead eyebrow={p.eyebrow} title={p.title} />
        <div className="mt-14">
          <PricingCards />
        </div>
      </Container>
    </Section>
  );
}

export function CompareTable() {
  const { t } = useLang();
  const c = t.compare;
  return (
    <Reveal className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-card ring-1 ring-line">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-mist text-[12px] text-ink-2 sm:text-[14px]">
              <th className="p-3 font-medium sm:p-5">
                <span className="sr-only">{t.ui.product}</span>
              </th>
              {c.cols.map((col) => (
                <th key={col} className="w-[21%] p-2 text-center font-medium leading-tight sm:p-5">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r) => (
              <tr key={r.name} className={cx("border-t border-line", r.highlight && "bg-teal-soft")}>
                <th
                  scope="row"
                  className={cx("p-3 text-[14px] sm:p-5 sm:text-[17px]", r.highlight ? "font-bold text-teal-deep" : "font-medium")}
                >
                  {r.name}
                </th>
                {r.cells.map((ok, i) => (
                  <td key={i} className="p-2 text-center sm:p-5">
                    <span
                      className={cx(
                        "inline-grid h-8 w-8 place-items-center rounded-full",
                        ok ? (r.highlight ? "bg-teal text-white" : "bg-teal-soft text-teal-deep") : "bg-mist text-ink-2",
                      )}
                    >
                      {ok ? <IconCheck size={17} strokeWidth={2.5} /> : <IconX size={15} />}
                      <span className="sr-only">{ok ? t.ui.yes : t.ui.no}</span>
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}

export function Compare() {
  const c = useLang().t.compare;
  return (
    <Section>
      <Container>
        <SectionHead eyebrow={c.eyebrow} title={c.title} />
        <div className="mt-14">
          <CompareTable />
        </div>
        <Reveal className="mt-10 text-center">
          <Button to="/why-saathi" variant="ghost">
            {c.link} <IconArrow size={18} />
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}

/** Photo slot: replaced from the admin page later. */
export function PlacePhoto({ className }: { className?: string }) {
  const place = useLang().t.story.place;
  return (
    <div
      className={cx("relative aspect-[4/3] overflow-hidden rounded-card", className)}
      style={{ background: "linear-gradient(160deg, #0E8F7E 0%, #0A6B5F 55%, #073F39 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <path d="M0 220 80 150l50 40 70-90 60 70 50-45 90 95v80H0Z" fill="#fff" opacity="0.1" />
        <path d="M0 250 60 205l70 35 80-70 70 55 60-30 60 50v55H0Z" fill="#fff" opacity="0.14" />
        <circle cx="310" cy="70" r="26" fill="#fff" opacity="0.18" />
      </svg>
      <p className="absolute bottom-6 left-7 text-[14px] font-medium text-white">{place}</p>
    </div>
  );
}

export function StoryTeaser() {
  const s = useLang().t.story;
  return (
    <Section tone="mist">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <PlacePhoto />
        </Reveal>
        <Reveal delay={0.1}>
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <h2 className="headline mt-4">{s.title}</h2>
          {s.body.map((b) => (
            <p key={b} className="mt-5 text-[17px] leading-relaxed text-ink-2">
              {b}
            </p>
          ))}
          <Button to="/our-story" variant="ghost" className="mt-7">
            {s.link} <IconArrow size={18} />
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}

export function QaList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it) => (
        <details key={it.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[18px] font-semibold tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
            {it.q}
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mist text-ink transition-transform duration-300 group-open:rotate-45">
              <IconPlus size={17} />
            </span>
          </summary>
          <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-ink-2">{it.a}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqTeaser() {
  const f = useLang().t.faq;
  return (
    <Section>
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <SectionHead eyebrow={f.eyebrow} title={f.title} center={false} />
          <Button to="/faq" variant="ghost" className="mt-7">
            {f.link} <IconArrow size={18} />
          </Button>
        </div>
        <Reveal>
          <QaList items={f.items} />
        </Reveal>
      </Container>
    </Section>
  );
}

export function Cta() {
  const c = useLang().t.cta;
  return (
    <Section tone="dark">
      <Container className="text-center">
        <Reveal>
          <h2 className="headline mx-auto max-w-3xl">{c.title}</h2>
          <p className="lede mx-auto mt-5 max-w-xl text-on-night-2">{c.lede}</p>
          <Button to="/join" variant="onDark" size="lg" className="mt-9">
            {c.button}
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
