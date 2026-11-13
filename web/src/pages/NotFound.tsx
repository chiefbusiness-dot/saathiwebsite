import { useLang } from "../i18n";
import { Button, Container, Eyebrow, Section } from "../components/ui";

export function NotFound() {
  const { t } = useLang();
  return (
    <Section className="!py-24 sm:!py-32">
      <Container className="max-w-3xl text-center">
        <Eyebrow>Saathi</Eyebrow>
        <h1 className="headline mt-4">{t.ui.notFound.title}</h1>
        <p className="lede mt-5 text-ink-2">{t.ui.notFound.lede}</p>
        <div className="mt-8">
          <Button to="/" variant="secondary">
            {t.ui.back}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
