import { useLang } from "../i18n";
import { Container, Section } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { IconCheck, IconX } from "../components/Icons";
import { Care, Cta, PageHero, PricingCards, SectionHead } from "../components/sections";

export function CarePlan() {
  const { t } = useLang();
  const p = t.pages.care;
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} lede={p.lede} />
      <Care link={false} />

      <Section tone="mist">
        <Container>
          <SectionHead eyebrow={p.day.eyebrow} title={p.day.title} />
          <ol className="relative mx-auto mt-14 max-w-2xl">
            <span className="absolute bottom-8 left-[7px] top-3 w-px bg-line" aria-hidden="true" />
            {p.day.items.map((it) => (
              <li key={it.title} className="pb-6 last:pb-0">
                <Reveal className="relative flex gap-6">
                  <span className="relative z-10 mt-2 h-[15px] w-[15px] shrink-0 rounded-full bg-teal ring-4 ring-mist" />
                  <div className="flex-1 rounded-card bg-paper p-6 shadow-soft ring-1 ring-black/5 sm:p-7">
                    <p className="eyebrow text-teal">{it.time}</p>
                    <h3 className="title mt-2">{it.title}</h3>
                    <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{it.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
            <Reveal className="rounded-card bg-teal-soft p-8 sm:p-10">
              <h2 className="title text-teal-deep">{p.does.title}</h2>
              <ul className="mt-6 space-y-4 text-[16px] leading-relaxed">
                {p.does.items.map((x) => (
                  <li key={x} className="flex gap-3">
                    <IconCheck size={20} className="mt-0.5 shrink-0 text-teal-deep" />
                    {x}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="rounded-card bg-mist p-8 sm:p-10">
              <h2 className="title">{p.doesnt.title}</h2>
              <ul className="mt-6 space-y-4 text-[16px] leading-relaxed">
                {p.doesnt.items.map((x) => (
                  <li key={x} className="flex gap-3">
                    <IconX size={20} className="mt-0.5 shrink-0 text-ink-2" />
                    {x}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="mx-auto mt-5 max-w-5xl rounded-card border border-line p-8 sm:p-10">
            <h2 className="title">{p.without.title}</h2>
            <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-ink-2">{p.without.body}</p>
          </Reveal>
        </Container>
      </Section>

      <Section tone="mist">
        <Container>
          <SectionHead eyebrow={t.pricing.eyebrow} title={t.pricing.title} />
          <div className="mt-14">
            <PricingCards />
          </div>
        </Container>
      </Section>
      <Cta />
    </>
  );
}
