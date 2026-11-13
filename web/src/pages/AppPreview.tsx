import { useCallback, useRef, useState } from "react";
import { useLang } from "../i18n";
import { Container, Eyebrow, Pill, cx } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { IconFall } from "../components/Icons";
import { PhoneApp } from "../components/PhoneApp";
import { Cta } from "../components/sections";

export function AppPreview() {
  const p = useLang().t.app.page;
  const [run, setRun] = useState(0);
  const [running, setRunning] = useState(false);
  const phoneRef = useRef<HTMLDivElement>(null);
  const onRunning = useCallback((r: boolean) => setRunning(r), []);

  const start = () => {
    setRun((n) => n + 1);
    // On a phone the app sits below the button, so bring it into view.
    phoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <section className="bg-paper py-14 sm:py-20">
        <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-10">
          <div>
            <Reveal>
              <Eyebrow>{p.eyebrow}</Eyebrow>
              <h1 className="headline mt-4 !text-[clamp(2.25rem,5vw,3.75rem)]">{p.title}</h1>
              <p className="lede mt-6 max-w-xl text-ink-2">{p.lede}</p>
            </Reveal>
            <Reveal delay={0.1} className="mt-9 rounded-card bg-coral-soft p-6 sm:p-7">
              <button
                type="button"
                onClick={start}
                disabled={running}
                className={cx(
                  "inline-flex h-14 w-full items-center justify-center gap-3 rounded-pill px-8 text-[17px] font-semibold text-white transition-colors sm:w-auto",
                  running ? "cursor-default bg-coral-deep/60" : "bg-coral-deep hover:bg-[#b93a20]",
                )}
              >
                <IconFall size={22} />
                {running ? p.running : p.simulate}
              </button>
              <p className="mt-4 text-[15px] leading-relaxed text-ink">{p.hint}</p>
            </Reveal>
            <ul className="mt-10 space-y-6">
              {p.points.map((x, i) => (
                <li key={x.title}>
                  <Reveal delay={0.1 + i * 0.06} className="flex gap-4">
                    <span className="nums mt-0.5 text-[15px] font-bold text-teal">0{i + 1}</span>
                    <div>
                      <h2 className="text-[18px] font-semibold tracking-[-0.01em]">{x.title}</h2>
                      <p className="mt-1 text-[16px] leading-relaxed text-ink-2">{x.body}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          <div ref={phoneRef} className="relative">
            <div
              className="absolute inset-0 m-auto aspect-square w-[110%] max-w-[620px] -translate-x-[5%] rounded-full"
              style={{ background: "radial-gradient(closest-side, #E6F4F1 0%, #F5F5F7 60%, transparent 100%)" }}
              aria-hidden="true"
            />
            <div className="relative">
              <PhoneApp run={run} onRunning={onRunning} />
              <p className="mx-auto mt-6 max-w-[340px] text-center text-[13px] text-ink-2">
                <Pill>{p.badge}</Pill>
                <span className="mt-3 block">{p.note}</span>
              </p>
            </div>
          </div>
        </Container>
      </section>
      <Cta />
    </>
  );
}
