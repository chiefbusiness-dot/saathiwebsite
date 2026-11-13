import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { en } from "../content/en";
import { Logo } from "./Logo";
import { Button, Container, cx } from "./ui";
import { IconMenu, IconX } from "./Icons";

function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" aria-label="Saathi home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {en.nav.links.map((l) => (
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

        <div className="flex items-center gap-3">
          <Button to="/join" className="hidden sm:inline-flex">
            {en.nav.cta}
          </Button>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-mist lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
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
            {en.nav.links.map((l) => (
              <Link key={l.to} to={l.to} className="border-b border-line py-4 text-[19px] font-semibold text-ink">
                {l.label}
              </Link>
            ))}
            <Button to="/join" size="lg" className="my-5">
              {en.nav.cta}
            </Button>
          </Container>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const f = en.footer;
  return (
    <footer className="bg-mist text-ink">
      <Container className="py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-[15px] text-ink-2">{f.tagline}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-[15px]">
            {[...en.nav.links, ...f.legal].map((l) => (
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
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
