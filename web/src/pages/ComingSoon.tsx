// Placeholder for pages that are built in Phase 2.
import { Button, Container, Eyebrow, Section } from "../components/ui";

export function ComingSoon({ title, lede }: { title: string; lede: string }) {
  return (
    <Section className="!py-24 sm:!py-32">
      <Container className="max-w-3xl text-center">
        <Eyebrow>Saathi</Eyebrow>
        <h1 className="headline mt-4">{title}</h1>
        <p className="lede mt-5 text-ink-2">{lede}</p>
        <p className="mt-8 inline-block rounded-pill bg-mist px-4 py-2 text-[14px] text-ink-2">This page is being built next.</p>
        <div className="mt-8">
          <Button to="/" variant="secondary">
            Back to home
          </Button>
        </div>
      </Container>
    </Section>
  );
}
