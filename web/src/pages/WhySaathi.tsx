import { useLang } from "../i18n";
import { Card, Container, Section } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { IconCheck, IconX } from "../components/Icons";
import { CompareTable, Cta, PageHero, SectionHead } from "../components/sections";

export function WhySaathi() {
  const p = useLang().t.pages.why;
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} lede={p.lede} />
      <Section className="!pt-0">
        <Container>
          <CompareTable />
        </Container>
      </Section>

      <Section tone="mist">
        <Container>
          <Reveal>
            <h2 className="headline mx-auto max-w-3xl text-center !text-[clamp(1.75rem,3.6vw,2.75rem)]">{p.tableTitle}</h2>
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
            {p.rows.map((r, i) => (
              <Reveal key={r.name} delay={(i % 2) * 0.08}>
                <Card className="h-full">
                  <h3 className="title">{r.name}</h3>
                  <div className="mt-5 space-y-4 text-[16px] leading-relaxed">
                    <div className="flex gap-3">
                      <IconCheck size={20} className="mt-0.5 shrink-0 text-teal" />
                      <div>
                        <p className="text-[13px] font-semibold text-ink-2">{p.gives}</p>
                        <p>{r.gives}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <IconX size={20} className="mt-0.5 shrink-0 text-coral-deep" />
                      <div>
                        <p className="text-[13px] font-semibold text-ink-2">{p.misses}</p>
                        <p>{r.misses}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead eyebrow={p.edge.eyebrow} title={p.edge.title} />
          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {p.edge.items.map((it, i) => (
              <Reveal key={it.title} delay={i * 0.08} className="h-full rounded-card bg-mist p-8">
                <h3 className="title">{it.title}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{it.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
      <Cta />
    </>
  );
}
