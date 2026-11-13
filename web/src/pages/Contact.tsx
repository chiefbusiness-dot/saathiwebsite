import type React from "react";
import { useLang } from "../i18n";
import { useSite } from "../site";
import { Button, Card, Container, Section } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { IconArrow, IconHome, IconPhone, IconWhatsapp } from "../components/Icons";
import { PageHero } from "../components/sections";

function ContactDetails() {
  const d = useLang().t.pages.contact.details;
  const s = useSite().settings;
  const wa = s.contact_whatsapp.replace(/\D/g, "");
  const rows = [
    s.contact_phone && { icon: <IconPhone />, label: d.phone, value: s.contact_phone, href: `tel:${s.contact_phone.replace(/[^\d+]/g, "")}` },
    wa && { icon: <IconWhatsapp />, label: d.whatsapp, value: s.contact_whatsapp, href: `https://wa.me/${wa}` },
    s.contact_email && { icon: <IconArrow />, label: d.email, value: s.contact_email, href: `mailto:${s.contact_email}` },
    s.contact_address && { icon: <IconHome />, label: d.address, value: s.contact_address, href: "" },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href: string }[];
  if (!rows.length) return null;
  return (
    <Reveal className="mt-5">
      <Card>
        <h2 className="title">{d.title}</h2>
        <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.label} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-soft text-teal-deep">{r.icon}</span>
              <div className="min-w-0">
                <dt className="text-[13px] font-semibold text-ink-2">{r.label}</dt>
                <dd className="mt-0.5 break-words text-[17px] font-medium">
                  {r.href ? (
                    <a
                      href={r.href}
                      className="text-teal-deep underline-offset-4 hover:underline"
                      {...(r.href.startsWith("https") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {r.value}
                    </a>
                  ) : (
                    r.value
                  )}
                </dd>
              </div>
            </div>
          ))}
        </dl>
        {wa && (
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-pill bg-[#1f7a4d] px-6 text-[15px] font-semibold text-white hover:bg-[#17603c]"
          >
            <IconWhatsapp size={20} /> {d.chat}
          </a>
        )}
      </Card>
    </Reveal>
  );
}

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
          <ContactDetails />
          <p className="mt-10 text-center text-[15px] text-ink-2">{p.emergency}</p>
        </Container>
      </Section>
    </>
  );
}
