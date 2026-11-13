// Edit any text on the site, English and Hindi side by side. Saving publishes immediately;
// every save is kept as a version that can be restored.
import { useEffect, useMemo, useState } from "react";
import { cx } from "../components/ui";
import { en } from "../content/en";
import { hi } from "../content/hi";
import { flattenText } from "../site";
import { api, fmtDate } from "./api";
import { Btn, inputCls, Notice, Panel } from "./kit";

type Overrides = { en: Record<string, string>; hi: Record<string, string> };
type Version = { id: number; at: string; note: string; changes: number };

const baseEn = flattenText(en);
const baseHi = flattenText(hi);
const paths = Object.keys(baseEn);

const sectionNames: Record<string, string> = {
  hero: "Home · top of page",
  problem: "Home · the gap",
  two: "Home · watch and person",
  features: "Watch features",
  minutes: "The first five minutes",
  care: "Care plan section",
  pricing: "Prices and pricing cards",
  compare: "Comparison table",
  story: "Home · our story",
  faq: "Home · questions",
  cta: "Join banner (bottom of pages)",
  nav: "Menu",
  footer: "Footer",
  watch: "Text on the watch drawing",
  ui: "Small labels and buttons",
  join: "Join the pilot form",
  "pages.how": "How it works page",
  "pages.care": "Care plan page",
  "pages.pricing": "Pricing page",
  "pages.why": "Why Saathi page",
  "pages.story": "Our story page",
  "pages.faq": "FAQ page",
  "pages.contact": "Contact page",
  "pages.privacy": "Privacy page",
  "pages.terms": "Terms page",
  "app.page": "App preview page",
  "app.teaser": "App preview teaser (home)",
};
const sectionOf = (p: string) => {
  const parts = p.split(".");
  return parts[0] === "pages" || parts[0] === "app" ? `${parts[0]}.${parts[1]}` : parts[0];
};
const sectionName = (s: string) => sectionNames[s] ?? (s.startsWith("app.") ? `App preview · ${s.slice(4)}` : s);
const sections = [...new Set(paths.map(sectionOf))].sort((a, b) => {
  const order = Object.keys(sectionNames);
  const ia = order.indexOf(a);
  const ib = order.indexOf(b);
  return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
});

/** "items.0.title" → "Item 1 · title" */
function fieldLabel(path: string, section: string) {
  return path
    .slice(section.length + 1)
    .split(".")
    .map((p) => (/^\d+$/.test(p) ? `#${Number(p) + 1}` : p.replace(/([A-Z])/g, " $1").toLowerCase()))
    .join(" · ");
}

const placeholders = (s: string) => s.match(/\{[a-zA-Z]+\}/g) ?? [];

function TextBox({ value, base, onChange, lang }: { value: string; base: string; onChange: (v: string) => void; lang: "en" | "hi" }) {
  const missing = placeholders(base).filter((p) => !value.includes(p));
  const changed = value !== base;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[12px] font-semibold text-ink-2">{lang === "en" ? "English" : "हिन्दी"}</span>
        {changed && (
          <button type="button" onClick={() => onChange(base)} className="text-[12px] font-semibold text-teal-deep hover:underline">
            Reset to original
          </button>
        )}
      </div>
      <textarea
        lang={lang}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(8, Math.max(1, Math.ceil(value.length / 60)))}
        className={cx(inputCls, "resize-y leading-relaxed", changed && "border-teal bg-teal-soft/40")}
      />
      {missing.length > 0 && (
        <p className="mt-1 text-[12px] font-medium text-coral-deep">Keep {missing.join(" and ")} in the text; it is filled in automatically.</p>
      )}
    </div>
  );
}

export function TextEditor() {
  const [saved, setSaved] = useState<Overrides | null>(null);
  const [draft, setDraft] = useState<Overrides>({ en: {}, hi: {} });
  const [versions, setVersions] = useState<Version[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const d = await api<Overrides & { versions: Version[] }>("/content");
    const o = { en: d.en ?? {}, hi: d.hi ?? {} };
    setSaved(o);
    setDraft(structuredClone(o));
    setVersions(d.versions);
  };
  useEffect(() => {
    load().catch(() => setMsg({ kind: "error", text: "Couldn't load the text." }));
  }, []);

  const dirty = saved !== null && JSON.stringify(saved) !== JSON.stringify(draft);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (lang: "en" | "hi", path: string, value: string) => {
    const base = lang === "en" ? baseEn[path] : baseHi[path];
    setDraft((d) => {
      const next = { ...d, [lang]: { ...d[lang] } };
      if (value === base) delete next[lang][path];
      else next[lang][path] = value;
      return next;
    });
  };

  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await api("/content", { method: "PUT", json: draft });
      await load();
      setMsg({ kind: "ok", text: "Saved. The changes are live on the site now." });
    } catch {
      setMsg({ kind: "error", text: "Couldn't save. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const restore = async (v: Version) => {
    if (dirty && !window.confirm("You have unsaved changes. Restoring will discard them. Continue?")) return;
    if (!window.confirm(`Restore the text as it was on ${fmtDate(v.at)}?`)) return;
    setBusy(true);
    try {
      await api(`/content/restore/${v.id}`, { method: "POST" });
      await load();
      setMsg({ kind: "ok", text: "Restored. The site now shows that version." });
    } catch {
      setMsg({ kind: "error", text: "Couldn't restore that version." });
    } finally {
      setBusy(false);
    }
  };

  const term = q.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!term) return null;
    return paths.filter((p) => {
      const vals = [draft.en[p] ?? baseEn[p], draft.hi[p] ?? baseHi[p], p];
      return vals.some((v) => v?.toLowerCase().includes(term));
    });
  }, [term, draft]);

  const changedIn = (s: string) => paths.filter((p) => sectionOf(p) === s && (p in draft.en || p in draft.hi)).length;

  const rows = (list: string[]) =>
    list.map((p) => (
      <div key={p} className="border-t border-line py-5 first:border-t-0">
        <p className="mb-2 text-[13px] font-semibold text-ink">{fieldLabel(p, sectionOf(p))}</p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TextBox lang="en" value={draft.en[p] ?? baseEn[p]} base={baseEn[p]} onChange={(v) => set("en", p, v)} />
          <TextBox lang="hi" value={draft.hi[p] ?? baseHi[p] ?? ""} base={baseHi[p] ?? ""} onChange={(v) => set("hi", p, v)} />
        </div>
      </div>
    ));

  if (!saved) return <Panel title="Site text">{msg ? <Notice kind={msg.kind}>{msg.text}</Notice> : <p className="text-ink-2">Loading…</p>}</Panel>;

  return (
    <div className="space-y-6">
      <Panel
        title="Site text"
        intro="Change any words on the site. Each section shows English and Hindi side by side. Changed text is highlighted in teal. Nothing goes live until you press Save."
      >
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Find text, for example: Someone actually answers"
          aria-label="Find text"
          className={inputCls}
        />

        <div className="mt-5">
          {matches ? (
            matches.length ? (
              <>
                <p className="text-[13px] text-ink-2">
                  {matches.length} {matches.length === 1 ? "match" : "matches"}
                  {matches.length > 40 ? " (showing the first 40; type more to narrow it down)" : ""}
                </p>
                <div className="mt-2">
                  {matches.slice(0, 40).map((p) => (
                    <div key={p}>
                      <p className="mt-4 text-[12px] font-semibold uppercase tracking-wide text-teal-deep">{sectionName(sectionOf(p))}</p>
                      {rows([p])}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="rounded-2xl bg-mist px-5 py-6 text-center text-[15px] text-ink-2">No text matches “{q}”.</p>
            )
          ) : (
            <ul className="divide-y divide-line rounded-2xl ring-1 ring-line">
              {sections.map((s) => {
                const list = paths.filter((p) => sectionOf(p) === s);
                const n = changedIn(s);
                const isOpen = open === s;
                return (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : s)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left hover:bg-mist/60 sm:px-5"
                    >
                      <span className="text-[15px] font-semibold">{sectionName(s)}</span>
                      <span className="flex shrink-0 items-center gap-3 text-[13px] text-ink-2">
                        {n > 0 && <span className="rounded-pill bg-teal-soft px-2.5 py-0.5 font-semibold text-teal-deep">{n} changed</span>}
                        {list.length} texts
                        <span className={cx("transition-transform", isOpen && "rotate-90")} aria-hidden="true">
                          ›
                        </span>
                      </span>
                    </button>
                    {isOpen && <div className="px-4 pb-4 sm:px-5">{rows(list)}</div>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Panel>

      <Panel title="Earlier versions" intro="Every save is kept. Restore one to put the site text back exactly as it was then.">
        {versions.length === 0 ? (
          <p className="text-[15px] text-ink-2">No saved changes yet. The site is showing the original text.</p>
        ) : (
          <ul className="divide-y divide-line">
            {versions.map((v, i) => (
              <li key={v.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span>
                  <span className="block text-[15px] font-medium">
                    {fmtDate(v.at)} {i === 0 && <span className="ml-2 rounded-pill bg-teal-soft px-2 py-0.5 text-[12px] font-semibold text-teal-deep">Live now</span>}
                  </span>
                  <span className="block text-[13px] text-ink-2">
                    {v.note} · {v.changes} {v.changes === 1 ? "text differs" : "texts differ"} from the original
                  </span>
                </span>
                {i > 0 && (
                  <Btn kind="secondary" onClick={() => restore(v)} disabled={busy}>
                    Restore
                  </Btn>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {(dirty || msg) && (
        <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-night px-5 py-4 text-on-night shadow-lift">
          <span className="text-[15px]">{dirty ? "You have unsaved changes." : msg?.text}</span>
          <span className="flex gap-2">
            {dirty && (
              <>
                <Btn kind="ghost" className="!text-on-night-2 hover:!bg-night-2" onClick={() => setDraft(structuredClone(saved))} disabled={busy}>
                  Discard
                </Btn>
                <Btn onClick={save} disabled={busy}>
                  {busy ? "Saving…" : "Save and publish"}
                </Btn>
              </>
            )}
            {!dirty && msg && (
              <Btn kind="ghost" className="!text-on-night-2 hover:!bg-night-2" onClick={() => setMsg(null)}>
                Close
              </Btn>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
