// Language switch: English and Hindi. The choice is remembered in the browser.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, type Content } from "./content/en";
import { hi } from "./content/hi";
import { applyContent, useSite } from "./site";

export type Lang = "en" | "hi";
const KEY = "saathi-lang";
const all: Record<Lang, Content> = { en, hi };

function initial(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "hi") return saved;
  } catch {
    // Storage can be blocked; fall back to English.
  }
  return "en";
}

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Content }>({
  lang: "en",
  setLang: () => {},
  t: en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, set] = useState<Lang>(initial);
  const setLang = useCallback((l: Lang) => {
    set(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      // Ignore: the choice just won't be remembered.
    }
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const site = useSite();
  const t = useMemo(
    () =>
      applyContent(all[lang], site.content[lang] ?? {}, {
        watchPrice: site.settings.watch_price,
        planPrice: site.settings.plan_price,
      }),
    [lang, site],
  );
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
