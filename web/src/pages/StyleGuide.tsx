// The design system on one page: colours, type, buttons, icons and the watch.
import type { ReactNode } from "react";
import { Button, Card, Container, Eyebrow, Pill, Section } from "../components/ui";
import { Watch } from "../components/Watch";
import { Logo, LogoMark } from "../components/Logo";
import * as Icons from "../components/Icons";

const swatches = [
  { name: "Paper", hex: "#FFFFFF", cls: "bg-paper ring-1 ring-line" },
  { name: "Mist", hex: "#F5F5F7", cls: "bg-mist" },
  { name: "Ink", hex: "#1D1D1F", cls: "bg-ink" },
  { name: "Ink 2", hex: "#6E6E73", cls: "bg-ink-2" },
  { name: "Night", hex: "#0B0B0D", cls: "bg-night" },
  { name: "Teal", hex: "#0A7A6B", cls: "bg-teal" },
  { name: "Teal deep", hex: "#075A50", cls: "bg-teal-deep" },
  { name: "Teal soft", hex: "#E6F4F1", cls: "bg-teal-soft" },
  { name: "Coral (alerts only)", hex: "#FF6B4A", cls: "bg-coral" },
  { name: "Coral soft", hex: "#FFF0EC", cls: "bg-coral-soft" },
];

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-line py-12">
      <Eyebrow>{title}</Eyebrow>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function StyleGuide() {
  return (
    <Section className="!pt-16">
      <Container>
        <h1 className="headline">Saathi design system</h1>
        <p className="lede mt-4 max-w-2xl text-ink-2">Every colour, type size and component the site is built from.</p>

        <div className="mt-12">
          <Block title="Logo">
            <div className="flex flex-wrap items-center gap-8">
              <Logo />
              <div className="rounded-2xl bg-night px-6 py-4">
                <Logo onDark />
              </div>
              <LogoMark size={56} />
            </div>
          </Block>

          <Block title="Colour">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {swatches.map((s) => (
                <div key={s.name}>
                  <div className={`h-20 rounded-2xl ${s.cls}`} />
                  <p className="mt-2 text-[14px] font-semibold">{s.name}</p>
                  <p className="nums text-[13px] text-ink-2">{s.hex}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Type">
            <div className="space-y-6">
              <p className="display">Someone answers.</p>
              <p className="headline">A watch that goes everywhere.</p>
              <p className="title">A real person, every day.</p>
              <p className="lede max-w-2xl text-ink-2">
                Lede: Saathi is a 4G safety watch for your parent, with a real person on the other end of every alert.
              </p>
              <p className="max-w-2xl text-[16px] leading-relaxed text-ink-2">
                Body: The watch senses a hard fall and raises the alert on its own. Charge it once a week.
              </p>
              <p className="headline" lang="hi">
                कोई सच में जवाब देता है।
              </p>
              <p className="nums text-[40px] font-bold tracking-[-0.03em]">₹9,999 · ₹199 · 00:30</p>
            </div>
          </Block>

          <Block title="Buttons and pills">
            <div className="flex flex-wrap items-center gap-4">
              <Button to="#">Primary</Button>
              <Button to="#" size="lg">
                Primary large
              </Button>
              <Button to="#" variant="secondary">
                Secondary
              </Button>
              <Button to="#" variant="ghost">
                Text link <Icons.IconArrow size={18} />
              </Button>
              <span className="rounded-pill bg-night p-3">
                <Button to="#" variant="onDark">
                  On dark
                </Button>
              </span>
              <Pill>Pilot open</Pill>
              <Pill tone="coral">Alert</Pill>
            </div>
          </Block>

          <Block title="Icons">
            <div className="flex flex-wrap gap-4 text-ink">
              {Object.entries(Icons).map(([name, Icon]) => (
                <span key={name} title={name} className="grid h-12 w-12 place-items-center rounded-2xl bg-mist">
                  <Icon />
                </span>
              ))}
            </div>
          </Block>

          <Block title="The watch">
            <div className="grid gap-5 sm:grid-cols-2">
              <Card className="flex flex-col items-center bg-mist">
                <Watch className="h-[380px] w-auto" />
                <p className="mt-4 text-[14px] text-ink-2">Calm face</p>
              </Card>
              <div className="flex flex-col items-center rounded-card bg-night p-8">
                <Watch state="alert" className="h-[380px] w-auto" />
                <p className="mt-4 text-[14px] text-on-night-2">Alert face</p>
              </div>
            </div>
          </Block>
        </div>
      </Container>
    </Section>
  );
}
