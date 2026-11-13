import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { en } from "../content/en";
import { Button, Card, Container, Eyebrow, Pill, Section, cx } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { Watch } from "../components/Watch";
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
} from "../components/Icons";

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

function IconTile({ name, tone = "teal" }: { name: string; tone?: "teal" | "night" }) {
  return (
    <span
      className={cx(
        "grid h-12 w-12 place-items-center rounded-2xl",
        tone === "teal" ? "bg-teal-soft text-teal-deep" : "bg-night-2 text-teal-bright ring-1 ring-night-line",
      )}
    >
      {icons[name]}
    </span>
  );
}

function Hero() {
  const h = en.hero;
  const reduce = useReducedMotion();
  return (
    <section className="overflow-hidden bg-paper">
      <Container className="grid grid-cols-1 items-center gap-10 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:pb-24 lg:pt-20">
        <div className="text-center lg:text-left">
          <Reveal>
            <Pill>
              <span className="h-2 w-2 rounded-full bg-teal" />
              {h.pill}
            </Pill>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display mt-6">
              {h.title[0]}
              <br />
              <span className="text-teal">{h.title[1]}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="lede mx-auto mt-6 max-w-xl text-ink-2 lg:mx-0">{h.lede}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button to="/join" size="lg" className="w-full sm:w-auto">
                {h.primary}
              </Button>
              <Button to="/how-it-works" variant="ghost" size="lg">
                {h.secondary} <IconArrow size={20} />
              </Button>
            </div>
            <p className="mt-5 text-[14px] text-ink-2">{h.note}</p>
          </Reveal>
        </div>

        <div className="relative mx-auto w-full max-w-[420px]">
          <div
            className="absolute inset-x-0 top-1/2 mx-auto aspect-square w-[92%] -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(closest-side, #E6F4F1 0%, #F5F5F7 55%, transparent 100%)" }}
          />
          <motion.div
            className="relative"
            initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <Watch className="mx-auto h-[400px] w-auto drop-shadow-[0_40px_50px_rgba(0,0,0,0.18)] sm:h-[520px]" />
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function SectionHead({
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

function Problem() {
  const p = en.problem;
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

function TwoThings() {
  const t = en.two;
  return (
    <Section>
      <Container>
        <SectionHead eyebrow={t.eyebrow} title={t.title} />
        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
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
              <div className="mt-auto px-8 pb-8 sm:px-10 sm:pb-10">
                <CallCard />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

// A small illustration of the response team calling back.
function CallCard() {
  return (
    <div className="rounded-3xl bg-night-2 p-5 ring-1 ring-night-line">
      <div className="flex items-center gap-4">
        <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-teal text-white">
          <IconHeadset size={26} />
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-teal-bright ring-4 ring-night-2" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] text-on-night-2">Saathi response team</p>
          <p className="truncate text-[17px] font-semibold">Calling Maa on her watch…</p>
        </div>
        <span className="nums ml-auto text-[15px] text-on-night-2">00:30</span>
      </div>
      <div className="mt-5 space-y-2.5 text-[14px]">
        {["Fall alert received", "Family notified on WhatsApp", "Neighbour on standby"].map((s) => (
          <div key={s} className="flex items-center gap-3 text-on-night-2">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-teal/25 text-teal-bright">
              <IconCheck size={13} strokeWidth={2.5} />
            </span>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function Features() {
  const f = en.features;
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

function Minutes() {
  const m = en.minutes;
  return (
    <Section tone="dark" id="first-five-minutes">
      <Container className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead eyebrow={m.eyebrow} title={m.title} lede={m.lede} center={false} dark />
          <Reveal>
            <Watch state="alert" className="mx-auto mt-10 hidden h-[360px] w-auto lg:block" />
          </Reveal>
        </div>

        <div>
          <ol className="relative">
          <span className="absolute bottom-6 left-[19px] top-6 w-px bg-night-line" aria-hidden="true" />
          {m.steps.map((s, i) => (
            <li key={s.title} className="pb-10 last:pb-0">
              <Reveal delay={0.05} className="relative flex gap-6">
                <span
                  className={cx(
                    "nums relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full text-[15px] font-bold",
                    i === 0 ? "bg-coral text-white" : "bg-night-2 text-teal-bright ring-1 ring-night-line",
                  )}
                >
                  {i + 1}
                </span>
                <div className="pt-1">
                  <p className={cx("nums eyebrow", i === 0 ? "text-coral" : "text-teal-bright")}>{s.time}</p>
                  <h3 className="title mt-2">{s.title}</h3>
                  <p className="mt-2 max-w-md text-[16px] leading-relaxed text-on-night-2">{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
          </ol>
          <p className="mt-10 pl-16 text-[13px] text-on-night-2">{m.note}</p>
        </div>
      </Container>
    </Section>
  );
}

function Care() {
  const c = en.care;
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
      <div className="flex items-center justify-between gap-3">
        <h3 className="title">{name}</h3>
        {badge && <Pill tone="night">{badge}</Pill>}
      </div>
      <p className="mt-6 flex items-baseline gap-3">
        <span className="nums text-[56px] font-bold leading-none tracking-[-0.04em]">{price}</span>
        <span className={featured ? "text-on-night-2" : "text-ink-2"}>{unit}</span>
      </p>
      <ul className="mt-8 space-y-3.5 text-[16px]">
        {points.map((p) => (
          <li key={p} className="flex gap-3">
            <IconCheck size={20} className={cx("mt-0.5 shrink-0", featured ? "text-teal-bright" : "text-teal")} />
            <span className={featured ? "text-on-night" : "text-ink"}>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pricing() {
  const p = en.pricing;
  return (
    <Section tone="mist" id="pricing">
      <Container>
        <SectionHead eyebrow={p.eyebrow} title={p.title} />
        <div className="relative mx-auto mt-14 grid grid-cols-1 max-w-4xl gap-5 md:grid-cols-2">
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
      </Container>
    </Section>
  );
}

function Compare() {
  const c = en.compare;
  return (
    <Section>
      <Container>
        <SectionHead eyebrow={c.eyebrow} title={c.title} />
        <Reveal className="mx-auto mt-14 max-w-4xl">
          <div className="overflow-hidden rounded-card ring-1 ring-line">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-mist text-[12px] text-ink-2 sm:text-[14px]">
                  <th className="p-3 font-medium sm:p-5">
                    <span className="sr-only">Product</span>
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
                      className={cx(
                        "p-3 text-[14px] sm:p-5 sm:text-[17px]",
                        r.highlight ? "font-bold text-teal-deep" : "font-medium",
                      )}
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
                          <span className="sr-only">{ok ? "Yes" : "No"}</span>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

function Story() {
  const s = en.story;
  return (
    <Section tone="mist">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          {/* Photo slot: replaced from the admin page later. */}
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-card"
            style={{ background: "linear-gradient(160deg, #0E8F7E 0%, #0A6B5F 55%, #073F39 100%)" }}
          >
            <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
              <path d="M0 220 80 150l50 40 70-90 60 70 50-45 90 95v80H0Z" fill="#fff" opacity="0.1" />
              <path d="M0 250 60 205l70 35 80-70 70 55 60-30 60 50v55H0Z" fill="#fff" opacity="0.14" />
              <circle cx="310" cy="70" r="26" fill="#fff" opacity="0.18" />
            </svg>
            <p className="absolute bottom-6 left-7 text-[14px] font-medium text-white/85">Dehradun, Uttarakhand</p>
          </div>
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

function Faq() {
  const f = en.faq;
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
          <div className="divide-y divide-line border-y border-line">
            {f.items.map((it) => (
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
        </Reveal>
      </Container>
    </Section>
  );
}

function Cta() {
  const c = en.cta;
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

export function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <TwoThings />
      <Features />
      <Minutes />
      <Care />
      <Pricing />
      <Compare />
      <Story />
      <Faq />
      <Cta />
    </>
  );
}
