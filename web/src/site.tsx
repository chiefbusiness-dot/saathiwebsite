// Owner-editable data from the server: text changes, prices, switches, contact details and photos.
// The site works with built-in defaults until (or if) this loads.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type SiteSettings = {
  pilot_open: boolean;
  preview_visible: boolean;
  watch_price: string;
  plan_price: string;
  contact_phone: string;
  contact_email: string;
  contact_whatsapp: string;
  contact_address: string;
};
export type SiteData = {
  settings: SiteSettings;
  content: { en: Record<string, string>; hi: Record<string, string> };
  images: Record<string, string>;
};

export const defaultSite: SiteData = {
  settings: {
    pilot_open: true,
    preview_visible: true,
    watch_price: "₹9,999",
    plan_price: "₹199",
    contact_phone: "",
    contact_email: "",
    contact_whatsapp: "",
    contact_address: "",
  },
  content: { en: {}, hi: {} },
  images: {},
};

const Ctx = createContext<SiteData>(defaultSite);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<SiteData>(defaultSite);
  useEffect(() => {
    let live = true;
    fetch("/api/site")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: SiteData | null) => {
        if (live && d) setSite({ ...defaultSite, ...d, settings: { ...defaultSite.settings, ...d.settings } });
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return <Ctx.Provider value={site}>{children}</Ctx.Provider>;
}

export const useSite = () => useContext(Ctx);

/** URL and srcset for an uploaded photo, or null if none has been uploaded. */
export function useImage(slot: string) {
  const v = useSite().images[slot];
  if (!v) return null;
  const u = (w: number) => `/api/images/${slot}?w=${w}&v=${v}`;
  return { src: u(1600), srcSet: `${u(800)} 800w, ${u(1600)} 1600w` };
}

type Tree = string | number | boolean | Tree[] | { [k: string]: Tree };

/** Applies owner text changes ("hero.lede" → "...") on top of the built-in copy, then fills in prices. */
export function applyContent<T>(base: T, overrides: Record<string, string>, vars: Record<string, string>): T {
  const out = structuredClone(base) as unknown as Tree;
  for (const [path, value] of Object.entries(overrides)) {
    const keys = path.split(".");
    let node: Tree | undefined = out;
    for (const k of keys.slice(0, -1)) node = node && typeof node === "object" ? (node as Record<string, Tree>)[k] : undefined;
    const last = keys[keys.length - 1];
    // Only replace text that exists; unknown or non-text paths are ignored.
    if (node && typeof node === "object" && typeof (node as Record<string, Tree>)[last] === "string") {
      (node as Record<string, Tree>)[last] = value;
    }
  }
  const fill = (n: Tree): Tree => {
    if (typeof n === "string") return n.replace(/\{(watchPrice|planPrice)\}/g, (_m, k: string) => vars[k] ?? "");
    if (Array.isArray(n)) return n.map(fill);
    if (n && typeof n === "object") return Object.fromEntries(Object.entries(n).map(([k, v]) => [k, fill(v)]));
    return n;
  };
  return fill(out) as unknown as T;
}

/** Every editable text in the copy, as "path" → text. Links, icons and data keys are left out. */
export function flattenText(node: unknown, prefix = "", out: Record<string, string> = {}): Record<string, string> {
  if (typeof node === "string") {
    out[prefix] = node;
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => flattenText(v, prefix ? `${prefix}.${i}` : String(i), out));
  } else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k === "to" || k === "icon" || k === "kind") continue;
      flattenText(v, prefix ? `${prefix}.${k}` : k, out);
    }
  }
  return out;
}
