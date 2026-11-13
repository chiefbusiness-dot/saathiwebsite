import { useLang } from "../i18n";
import { Button, Card, Container, Section } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { IconArrow } from "../components/Icons";
import { PageHero } from "../components/sections";

export function Contact() {
  const p = useLang().t.pages.contact;
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} lede={p.lede} />
      <Section tone="mist" className="!py-16 sm:!py-20">
        <Container className="max-w-4xl">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {p.cards.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <Card className="flex h-full flex-col">
                  <h2 className="title">{c.title}</h2>
                  <p className="mt-3 flex-1 text-[16px] leading-relaxed text-ink-2">{c.body}</p>
                  <div className="mt-7">
                    <Button to={c.to} variant={i === 0 ? "primary" : "secondary"}>
                      {c.cta} <IconArrow size={18} />
                    </Button>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-center text-[15px] text-ink-2">{p.emergency}</p>
        </Container>
      </Section>
    </>
  );
}
