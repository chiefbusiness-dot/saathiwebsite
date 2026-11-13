import { useLang } from "../i18n";
import { Container, Section } from "../components/ui";

export function Legal({ doc }: { doc: "privacy" | "terms" }) {
  const p = useLang().t.pages[doc];
  return (
    <Section className="!pt-14 sm:!pt-20">
      <Container className="max-w-3xl">
        <h1 className="headline">{p.title}</h1>
        <p className="mt-4 text-[14px] text-ink-2">{p.updated}</p>
        <p className="lede mt-8">{p.intro}</p>
        {p.sections.map((s) => (
          <section key={s.h} className="mt-12">
            <h2 className="title">{s.h}</h2>
            {s.p.map((x) => (
              <p key={x} className="mt-4 text-[17px] leading-[1.75] text-ink-2">
                {x}
              </p>
            ))}
          </section>
        ))}
      </Container>
    </Section>
  );
}
