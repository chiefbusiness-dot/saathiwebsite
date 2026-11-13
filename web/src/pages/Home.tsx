import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useLang } from "../i18n";
import { Button, Container, Pill } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { Watch } from "../components/Watch";
import { IconArrow } from "../components/Icons";
import { Care, Compare, Cta, FaqTeaser, Features, Minutes, Pricing, Problem, StoryTeaser, TwoThings } from "../components/sections";

function Hero() {
  const h = useLang().t.hero;
  const reduce = useReducedMotion();
  // The watch tilts and drifts gently as the page scrolls.
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 700], [0, -9]);
  const drift = useTransform(scrollY, [0, 700], [0, 70]);

  return (
    <section className="overflow-hidden bg-paper">
      <Container className="grid grid-cols-1 items-center gap-10 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:pb-24 lg:pt-20">
        <div className="text-center lg:text-left">
          <Reveal>
            <Pill>
              <span className="h-2 w-2 shrink-0 rounded-full bg-teal" />
              {h.pill}
            </Pill>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display mt-6">
              {h.title[0]}
              <br />
              <span className="text-teal">{h.title[1]}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="lede mx-auto mt-6 max-w-xl text-ink-2 lg:mx-0">{h.lede}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button to="/join" size="lg" className="w-full sm:w-auto">
                {h.primary}
              </Button>
              <Button to="/how-it-works" variant="ghost" size="lg">
                {h.secondary} <IconArrow size={20} />
              </Button>
            </div>
            <p className="mt-5 text-[14px] text-ink-2">{h.note}</p>
          </Reveal>
        </div>

        <div className="relative mx-auto w-full max-w-[420px]">
          <div
            className="absolute inset-x-0 top-1/2 mx-auto aspect-square w-[92%] -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(closest-side, #E6F4F1 0%, #F5F5F7 55%, transparent 100%)" }}
          />
          <motion.div
            className="relative"
            initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div style={reduce ? undefined : { rotate, y: drift }}>
              <motion.div
                animate={reduce ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <Watch className="mx-auto h-[400px] w-auto drop-shadow-[0_40px_50px_rgba(0,0,0,0.18)] sm:h-[520px]" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <TwoThings />
      <Features />
      <Minutes />
      <Care />
      <Pricing />
      <Compare />
      <StoryTeaser />
      <FaqTeaser />
      <Cta />
    </>
  );
}
