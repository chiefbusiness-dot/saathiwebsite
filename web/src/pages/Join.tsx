// "Join the pilot" sign-up form. Saves to the database through /api/signups.
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { Button, Container, Eyebrow, Pill, cx } from "../components/ui";
import { IconCheck } from "../components/Icons";

type Values = {
  name: string;
  phone: string;
  email: string;
  city: string;
  parentCity: string;
  parentAge: string;
  interest: string;
  message: string;
  consent: boolean;
  website: string; // honeypot: hidden from people, tempting for bots
};
type Field = keyof Values;
type Errors = Partial<Record<Field, "required" | "invalid">>;

const empty: Values = {
  name: "",
  phone: "",
  email: "",
  city: "",
  parentCity: "",
  parentAge: "",
  interest: "pilot",
  message: "",
  consent: false,
  website: "",
};
const order: Field[] = ["name", "phone", "email", "city", "parentCity", "parentAge", "interest", "message", "consent"];

// Mirrors the server's checks so most mistakes are caught before sending.
function check(v: Values): Errors {
  const e: Errors = {};
  const need = (f: "name" | "city" | "parentCity") => {
    const s = v[f].trim();
    if (!s) e[f] = "required";
    else if (s.length < 2 || s.length > 80) e[f] = "invalid";
  };
  need("name");
  need("city");
  need("parentCity");
  const p = v.phone.replace(/[\s\-().]/g, "");
  if (!p) e.phone = "required";
  else if (!(/^\+\d{8,15}$/.test(p) || /^(0|91)?[6-9]\d{9}$/.test(p))) e.phone = "invalid";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "invalid";
  if (!v.parentAge) e.parentAge = "required";
  if (!v.interest) e.interest = "required";
  if (v.message.length > 1000) e.message = "invalid";
  if (!v.consent) e.consent = "required";
  return e;
}

const inputCls = (bad: boolean) =>
  cx(
    "mt-2 block w-full rounded-2xl border bg-paper px-4 text-[17px] text-ink outline-none transition-colors placeholder:text-ink-2/60",
    "focus:border-teal focus:ring-4 focus:ring-teal-soft",
    bad ? "border-coral-deep" : "border-line hover:border-ink-2/50",
  );

function FieldWrap({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-semibold">
        {label}
        {hint && <span className="ml-2 font-normal text-ink-2">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[14px] font-medium text-coral-deep">
          {error}
        </p>
      )}
    </div>
  );
}

function usePilot() {
  const [pilot, setPilot] = useState<{ total: number; left: number; open: boolean } | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/api/pilot")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (live && d) setPilot(d);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return pilot;
}

export function Join() {
  const { t, lang } = useLang();
  const j = t.join;
  const pilot = usePilot();
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [problem, setProblem] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  const set = <K extends Field>(k: K, val: Values[K]) => {
    setV((old) => ({ ...old, [k]: val }));
    if (errors[k]) setErrors((old) => ({ ...old, [k]: undefined }));
  };

  const msg = (f: Field): string | undefined => {
    const code = errors[f];
    if (!code) return undefined;
    if (code === "invalid" && (f === "phone" || f === "email")) return j.errors[f];
    if (f === "consent" || f === "interest" || f === "parentAge") return j.errors[f];
    return j.errors[code];
  };

  const showErrors = (e: Errors) => {
    setErrors(e);
    setProblem(j.errors.summary);
    const first = order.find((f) => e[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (state === "sending") return;
    const e = check(v);
    if (Object.keys(e).length) return showErrors(e);
    setProblem("");
    setState("sending");
    try {
      const res = await fetch("/api/signups", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...v, lang }),
      });
      if (res.ok) {
        setState("done");
        return;
      }
      setState("idle");
      if (res.status === 429) return setProblem(j.errors.rate);
      const body = await res.json().catch(() => null);
      if (res.status === 400 && body?.errors) return showErrors(body.errors as Errors);
      setProblem(j.errors.network);
    } catch {
      setState("idle");
      setProblem(j.errors.network);
    }
  };

  // When the pilot is full or closed, only the waitlist is offered.
  const pilotClosed = pilot !== null && !pilot.open;
  useEffect(() => {
    if (pilotClosed) setV((old) => (old.interest === "pilot" ? { ...old, interest: "waitlist" } : old));
  }, [pilotClosed]);

  useEffect(() => {
    if (state === "done") {
      window.scrollTo(0, 0);
      doneRef.current?.focus();
    }
  }, [state]);

  if (state === "done") {
    return (
      <section className="bg-paper py-20 sm:py-28">
        <Container className="max-w-2xl text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal text-white">
            <IconCheck size={32} strokeWidth={2.5} />
          </span>
          <h1 ref={doneRef} tabIndex={-1} className="headline mt-8 outline-none">
            {j.done.title}
          </h1>
          <p className="lede mt-5 text-ink-2">{j.done.body.replace("{phone}", v.phone.trim())}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button to="/app-preview" size="lg">
              {j.done.preview}
            </Button>
            <Button to="/" variant="secondary" size="lg">
              {j.done.again}
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  const seats =
    pilot &&
    (pilot.open ? j.seatsLeft.replace("{left}", String(pilot.left)).replace("{total}", String(pilot.total)) : j.seatsFull);
  const f = j.fields;

  return (
    <section className="bg-paper py-12 sm:py-20">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>{j.eyebrow}</Eyebrow>
          <h1 className="headline mt-4 !text-[clamp(2rem,4.4vw,3.25rem)]">{j.title}</h1>
          <p className="lede mt-5 text-ink-2">{j.lede}</p>
          {seats && (
            <div className="mt-6">
              <Pill tone={pilot?.open ? "teal" : "coral"}>
                <span className={cx("h-2 w-2 shrink-0 rounded-full", pilot?.open ? "bg-teal" : "bg-coral-deep")} />
                <span className="nums">{seats}</span>
              </Pill>
            </div>
          )}
          <ol className="mt-10 space-y-6">
            {j.steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="nums grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-soft text-[15px] font-bold text-teal-deep">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[17px] font-semibold">{s.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <form ref={formRef} onSubmit={submit} noValidate className="rounded-card bg-mist p-6 sm:p-10">
          <fieldset className="space-y-6">
            <legend className="title mb-6">{j.about}</legend>
            <FieldWrap id="name" label={f.name.label} error={msg("name")}>
              <input
                id="name"
                name="name"
                autoComplete="name"
                value={v.name}
                onChange={(e) => set("name", e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={cx(inputCls(!!errors.name), "h-14")}
              />
            </FieldWrap>
            <FieldWrap id="phone" label={f.phone.label} error={msg("phone")}>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="98765 43210"
                value={v.phone}
                onChange={(e) => set("phone", e.target.value)}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
                className={cx(inputCls(!!errors.phone), "nums h-14")}
              />
              {!errors.phone && (
                <p id="phone-hint" className="mt-2 text-[14px] text-ink-2">
                  {f.phone.hint}
                </p>
              )}
            </FieldWrap>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FieldWrap id="email" label={f.email.label} hint={f.email.hint} error={msg("email")}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={v.email}
                  onChange={(e) => set("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={cx(inputCls(!!errors.email), "h-14")}
                />
              </FieldWrap>
              <FieldWrap id="city" label={f.city.label} error={msg("city")}>
                <input
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  value={v.city}
                  onChange={(e) => set("city", e.target.value)}
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? "city-error" : undefined}
                  className={cx(inputCls(!!errors.city), "h-14")}
                />
              </FieldWrap>
            </div>
          </fieldset>

          <fieldset className="mt-12 space-y-6">
            <legend className="title mb-6">{j.parent}</legend>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FieldWrap id="parentCity" label={f.parentCity.label} error={msg("parentCity")}>
                <input
                  id="parentCity"
                  name="parentCity"
                  value={v.parentCity}
                  onChange={(e) => set("parentCity", e.target.value)}
                  aria-invalid={!!errors.parentCity}
                  aria-describedby={errors.parentCity ? "parentCity-error" : undefined}
                  className={cx(inputCls(!!errors.parentCity), "h-14")}
                />
              </FieldWrap>
              <FieldWrap id="parentAge" label={f.parentAge.label} error={msg("parentAge")}>
                <select
                  id="parentAge"
                  name="parentAge"
                  value={v.parentAge}
                  onChange={(e) => set("parentAge", e.target.value)}
                  aria-invalid={!!errors.parentAge}
                  aria-describedby={errors.parentAge ? "parentAge-error" : undefined}
                  className={cx(inputCls(!!errors.parentAge), "h-14 appearance-none bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-12")}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236E6E73' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                  }}
                >
                  <option value="">—</option>
                  {Object.entries(j.ages).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </FieldWrap>
            </div>

            <div role="radiogroup" aria-labelledby="interest-label">
              <p id="interest-label" className="text-[15px] font-semibold">
                {f.interest.label}
              </p>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(pilotClosed ? (["waitlist"] as const) : (["pilot", "waitlist"] as const)).map((k) => {
                  const on = v.interest === k;
                  return (
                    <label
                      key={k}
                      className={cx(
                        "relative flex cursor-pointer gap-3 rounded-2xl border bg-paper p-4 transition-colors",
                        "has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-teal-soft",
                        on ? "border-teal ring-1 ring-teal" : "border-line hover:border-ink-2/50",
                      )}
                    >
                      <input
                        type="radio"
                        name="interest"
                        value={k}
                        checked={on}
                        onChange={() => set("interest", k)}
                        className="sr-only"
                      />
                      <span
                        className={cx(
                          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
                          on ? "border-teal bg-teal" : "border-ink-2/50",
                        )}
                        aria-hidden="true"
                      >
                        {on && <span className="h-2 w-2 rounded-full bg-white" />}
                      </span>
                      <span>
                        <span className="block text-[16px] font-semibold">{j.interests[k].title}</span>
                        <span className="mt-1 block text-[14px] leading-snug text-ink-2">{j.interests[k].body}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <FieldWrap id="message" label={f.message.label} error={msg("message")}>
              <textarea
                id="message"
                name="message"
                rows={4}
                maxLength={1000}
                placeholder={f.message.hint}
                value={v.message}
                onChange={(e) => set("message", e.target.value)}
                className={cx(inputCls(!!errors.message), "py-3.5 leading-relaxed")}
              />
            </FieldWrap>
          </fieldset>

          {/* Honeypot: hidden from people and screen readers. */}
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} />
            </label>
          </div>

          <div className="mt-10">
            <label className="flex cursor-pointer gap-3">
              <input
                type="checkbox"
                name="consent"
                checked={v.consent}
                onChange={(e) => set("consent", e.target.checked)}
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? "consent-error" : undefined}
                className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer rounded-md accent-teal"
              />
              <span className="text-[15px] leading-relaxed">{j.consent}</span>
            </label>
            {errors.consent && (
              <p id="consent-error" className="mt-2 pl-9 text-[14px] font-medium text-coral-deep">
                {msg("consent")}
              </p>
            )}
            <p className="mt-2 pl-9 text-[14px]">
              <Link to="/privacy" className="font-medium text-teal-deep underline underline-offset-4 hover:text-teal">
                {j.privacy}
              </Link>
            </p>
          </div>

          <div aria-live="polite" className="mt-8">
            {problem && <p className="rounded-2xl bg-coral-soft px-4 py-3 text-[15px] font-medium text-coral-deep">{problem}</p>}
          </div>

          <button
            type="submit"
            disabled={state === "sending"}
            className={cx(
              "mt-4 inline-flex h-14 w-full items-center justify-center rounded-pill px-8 text-[17px] font-semibold text-white transition-colors",
              state === "sending" ? "cursor-default bg-teal/60" : "bg-teal hover:bg-teal-deep",
            )}
          >
            {state === "sending" ? j.sending : j.submit}
          </button>
          <p className="mt-4 text-center text-[13px] text-ink-2">{t.hero.note}</p>
        </form>
      </Container>
    </section>
  );
}
