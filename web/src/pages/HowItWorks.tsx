import { useLang } from "../i18n";
import { Container, Section } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { Cta, Features, Minutes, PageHero, SectionHead, TwoThings } from "../components/sections";

export function HowItWorks() {
  const p = useLang().t.pages.how;
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} lede={p.lede} />
      <TwoThings head={false} />
      <Features />
      <Minutes />
      <Section>
        <Container>
          <SectionHead eyebrow={p.daily.eyebrow} title={p.daily.title} />
          <ol className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {p.daily.items.map((it, i) => (
              <li key={it.title}>
                <Reveal delay={i * 0.08} className="h-full rounded-card bg-mist p-7">
                  <span className="nums grid h-10 w-10 place-items-center rounded-full bg-teal text-[15px] font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-6 text-[19px] font-semibold leading-snug tracking-[-0.01em]">{it.title}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{it.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal className="mx-auto mt-14 max-w-3xl rounded-card border border-line p-8 sm:p-10">
            <h3 className="title">{p.limit.title}</h3>
            <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{p.limit.body}</p>
          </Reveal>
        </Container>
      </Section>
      <Cta />
    </>
  );
}
