import { useLang } from "../i18n";
import { Container, Section } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { Cta, PageHero, PricingCards, QaList } from "../components/sections";

export function PricingPage() {
  const p = useLang().t.pages.pricing;
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} lede={p.lede} />
      <Section tone="mist" className="!py-16 sm:!py-20">
        <Container>
          <PricingCards />
        </Container>
      </Section>
      <Section>
        <Container className="max-w-3xl">
          <Reveal>
            <h2 className="headline !text-[clamp(1.75rem,3.4vw,2.5rem)]">{p.qTitle}</h2>
            <div className="mt-8">
              <QaList items={p.items} />
            </div>
          </Reveal>
        </Container>
      </Section>
      <Cta />
    </>
  );
}
