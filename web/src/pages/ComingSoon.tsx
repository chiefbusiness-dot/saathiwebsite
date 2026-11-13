// Placeholder for pages that are built in a later phase.
import { useLang } from "../i18n";
import { Button, Container, Eyebrow, Section } from "../components/ui";

export function ComingSoon({ page }: { page: "preview" | "join" | "notFound" }) {
  const { t } = useLang();
  const p = page === "notFound" ? t.ui.notFound : t.pages[page];
  return (
    <Section className="!py-24 sm:!py-32">
      <Container className="max-w-3xl text-center">
        <Eyebrow>Saathi</Eyebrow>
        <h1 className="headline mt-4">{p.title}</h1>
        <p className="lede mt-5 text-ink-2">{p.lede}</p>
        {page !== "notFound" && (
          <p className="mt-8 inline-block rounded-pill bg-mist px-4 py-2 text-[14px] text-ink-2">{t.ui.soon}</p>
        )}
        <div className="mt-8">
          <Button to="/" variant="secondary">
            {t.ui.back}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
