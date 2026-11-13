import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useLang, type Lang } from "../i18n";
import { Logo } from "./Logo";
import { Button, Container, cx } from "./ui";
import { IconMenu, IconX } from "./Icons";

function LangSwitch() {
  const { lang, setLang, t } = useLang();
  const opts: { id: Lang; label: string; name: string }[] = [
    { id: "en", label: "EN", name: "English" },
    { id: "hi", label: "हिं", name: "हिन्दी" },
  ];
  return (
    <div role="group" aria-label={t.ui.language} className="flex rounded-pill bg-mist p-1">
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          lang={o.id}
          aria-label={o.name}
          aria-pressed={lang === o.id}
          onClick={() => setLang(o.id)}
          className={cx(
            "h-9 min-w-11 rounded-pill px-3 text-[14px] font-semibold transition-colors",
            lang === o.id ? "bg-paper text-ink shadow-soft" : "text-ink-2 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Nav() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label={t.ui.home}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {t.nav.links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cx("text-[15px] font-medium transition-colors", isActive ? "text-ink" : "text-ink-2 hover:text-ink")
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitch />
          <div className="hidden sm:block">
            <Button to="/join">{t.nav.cta}</Button>
          </div>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-mist lg:hidden"
            aria-label={open ? t.ui.closeMenu : t.ui.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </Container>

      {open && (
        <nav className="border-t border-line bg-paper lg:hidden" aria-label="Mobile">
          <Container className="flex flex-col py-3">
            {[...t.nav.links, ...t.nav.more].map((l) => (
              <Link key={l.to} to={l.to} className="border-b border-line py-4 text-[19px] font-semibold text-ink">
                {l.label}
              </Link>
            ))}
            <Button to="/join" size="lg" className="my-5">
              {t.nav.cta}
            </Button>
          </Container>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const { t } = useLang();
  const f = t.footer;
  return (
    <footer className="bg-mist text-ink">
      <Container className="py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-[15px] text-ink-2">{f.tagline}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-[15px]">
            {[...t.nav.links, ...t.nav.more, ...f.legal].map((l) => (
              <Link key={l.to} to={l.to} className="text-ink-2 hover:text-ink">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-line pt-6 text-[13px] leading-relaxed text-ink-2">
          <p className="max-w-3xl">{f.disclaimer}</p>
          <p className="mt-3">
            © {new Date().getFullYear()} Saathi. {f.made}
          </p>
        </div>
      </Container>
    </footer>
  );
}

export function Layout() {
  const { t } = useLang();
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        {t.ui.skip}
      </a>
      <Nav />
      <motion.main
        id="main"
        key={pathname}
        className="flex-1"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}
