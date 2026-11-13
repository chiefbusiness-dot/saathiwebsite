// Prices, the pilot counter, contact details and on/off switches.
import { useEffect, useState, type FormEvent } from "react";
import { api, ApiError, type Settings } from "./api";
import { Btn, Field, inputCls, Notice, Panel, Toggle } from "./kit";

const fieldErrors: Record<string, string> = {
  pilot_total: "Enter a whole number from 0 to 1000.",
  pilot_left: "Places left must be a whole number, and not more than the total.",
  watch_price: "Enter a price, for example ₹9,999.",
  plan_price: "Enter a price, for example ₹199.",
  contact_phone: "Keep this under 30 characters.",
  contact_email: "Enter a valid email address, or leave it empty.",
  contact_whatsapp: "Use only digits, spaces and an optional + at the start.",
  contact_address: "Keep this under 200 characters.",
};

export function SettingsPage() {
  const [saved, setSaved] = useState<Settings | null>(null);
  const [v, setV] = useState<Settings | null>(null);
  const [bad, setBad] = useState<string[]>([]);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Settings>("/settings")
      .then((s) => {
        setSaved(s);
        setV(s);
      })
      .catch(() => setMsg({ kind: "error", text: "Couldn't load settings." }));
  }, []);

  if (!v || !saved) return <Panel title="Prices and settings">{msg ? <Notice kind={msg.kind}>{msg.text}</Notice> : <p className="text-ink-2">Loading…</p>}</Panel>;

  const set = <K extends keyof Settings>(k: K, val: Settings[K]) => {
    setV({ ...v, [k]: val });
    setBad((b) => b.filter((x) => x !== k));
    setMsg(null);
  };
  const num = (s: string) => (s === "" ? Number.NaN : Number(s));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const changed = Object.fromEntries(Object.entries(v).filter(([k, val]) => saved[k as keyof Settings] !== val));
    if (!Object.keys(changed).length) {
      setMsg({ kind: "ok", text: "Nothing has changed." });
      return;
    }
    setBusy(true);
    try {
      const s = await api<Settings>("/settings", { method: "PUT", json: changed });
      setSaved(s);
      setV(s);
      setBad([]);
      setMsg({ kind: "ok", text: "Saved. The site is updated." });
    } catch (err) {
      const fields = err instanceof ApiError ? (err.data.fields ?? []) : [];
      setBad(fields);
      setMsg({ kind: "error", text: fields.length ? "Please fix the highlighted fields." : "Couldn't save. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const err = (k: string) => (bad.includes(k) ? fieldErrors[k] : undefined);
  const dirty = JSON.stringify(v) !== JSON.stringify(saved);

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <Panel title="The pilot" intro="The Join page shows how many places are left. When the pilot is closed or full, new families can only join the waitlist.">
        <div className="space-y-6">
          <Toggle checked={v.pilot_open} onChange={(x) => set("pilot_open", x)} label="Pilot sign-ups open" hint="Turn off to accept waitlist sign-ups only." />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Total pilot places" error={err("pilot_total")}>
              <input
                type="number"
                min={0}
                max={1000}
                inputMode="numeric"
                value={Number.isNaN(v.pilot_total) ? "" : v.pilot_total}
                onChange={(e) => set("pilot_total", num(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="Places left" hint="Lower this as families join the pilot." error={err("pilot_left")}>
              <input
                type="number"
                min={0}
                max={1000}
                inputMode="numeric"
                value={Number.isNaN(v.pilot_left) ? "" : v.pilot_left}
                onChange={(e) => set("pilot_left", num(e.target.value))}
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </Panel>

      <Panel title="Prices" intro="Used everywhere a price appears: the pricing cards, the care plan page and the FAQ, in both languages.">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Watch price (one-time)" error={err("watch_price")}>
            <input value={v.watch_price} onChange={(e) => set("watch_price", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Care plan price (per month)" error={err("plan_price")}>
            <input value={v.plan_price} onChange={(e) => set("plan_price", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Panel>

      <Panel title="Contact details" intro="Shown on the Contact page. Leave a field empty to hide it.">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Phone" error={err("contact_phone")}>
            <input type="tel" value={v.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} className={inputCls} placeholder="+91 98765 43210" />
          </Field>
          <Field label="WhatsApp number" hint="Adds a 'Chat on WhatsApp' button." error={err("contact_whatsapp")}>
            <input type="tel" value={v.contact_whatsapp} onChange={(e) => set("contact_whatsapp", e.target.value)} className={inputCls} placeholder="+91 98765 43210" />
          </Field>
          <Field label="Email" error={err("contact_email")}>
            <input type="email" value={v.contact_email} onChange={(e) => set("contact_email", e.target.value)} className={inputCls} placeholder="hello@example.com" />
          </Field>
          <Field label="Address" error={err("contact_address")}>
            <input value={v.contact_address} onChange={(e) => set("contact_address", e.target.value)} className={inputCls} placeholder="Dehradun, Uttarakhand" />
          </Field>
        </div>
      </Panel>

      <Panel title="Switches">
        <Toggle
          checked={v.preview_visible}
          onChange={(x) => set("preview_visible", x)}
          label="Show the family app preview"
          hint="Turn off to hide the app preview page, its menu link and the teaser on the home page."
        />
      </Panel>

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-night px-5 py-4 text-on-night shadow-lift">
        <span className="text-[15px]" role="status">
          {msg?.text ?? (dirty ? "You have unsaved changes." : "All changes saved.")}
        </span>
        <span className="flex gap-2">
          {dirty && (
            <Btn kind="ghost" className="!text-on-night-2 hover:!bg-night-2" onClick={() => { setV(saved); setBad([]); setMsg(null); }}>
              Discard
            </Btn>
          )}
          <Btn type="submit" disabled={busy || !dirty}>
            {busy ? "Saving…" : "Save"}
          </Btn>
        </span>
      </div>
    </form>
  );
}
