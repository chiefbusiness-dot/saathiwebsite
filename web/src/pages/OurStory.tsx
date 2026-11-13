import { useLang } from "../i18n";
import { useImage } from "../site";
import { Container, Section } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { Cta, PageHero, PlacePhoto, SectionHead } from "../components/sections";

export function OurStory() {
  const p = useLang().t.pages.story;
  const team = useImage("team");
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} />
      <Section className="!pt-0">
        <Container className="max-w-3xl">
          <Reveal>
            <PlacePhoto className="!aspect-[16/9]" />
          </Reveal>
          <div className="mt-12 space-y-6">
            {p.paragraphs.map((x, i) => (
              <Reveal key={x}>
                <p className={i === 0 ? "lede text-ink" : "text-[18px] leading-[1.75] text-ink-2"}>{x}</p>
              </Reveal>
            ))}
          </div>
          {team && (
            <Reveal className="mt-12">
              <img
                src={team.src}
                srcSet={team.srcSet}
                sizes="(min-width: 768px) 720px, 100vw"
                alt={p.teamAlt}
                className="aspect-[3/2] w-full rounded-card object-cover"
              />
            </Reveal>
          )}
        </Container>
      </Section>
      <Section tone="mist">
        <Container>
          <SectionHead eyebrow={p.values.eyebrow} title={p.values.title} />
          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {p.values.items.map((it, i) => (
              <Reveal key={it.title} delay={i * 0.08} className="h-full rounded-card bg-paper p-8 shadow-soft ring-1 ring-black/5">
                <span className="nums text-[15px] font-bold text-teal">0{i + 1}</span>
                <h3 className="title mt-4">{it.title}</h3>
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
