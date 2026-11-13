import { useLang } from "../i18n";
import { Container, Section } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { Cta, PageHero, QaList } from "../components/sections";

export function FaqPage() {
  const p = useLang().t.pages.faq;
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} lede={p.lede} />
      <Section className="!pt-0">
        <Container className="max-w-3xl space-y-14">
          {p.groups.map((g) => (
            <Reveal key={g.title}>
              <h2 className="title mb-4 text-teal-deep">{g.title}</h2>
              <QaList items={g.items} />
            </Reveal>
          ))}
        </Container>
      </Section>
      <Cta />
    </>
  );
}
