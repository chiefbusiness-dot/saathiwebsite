// The owner's admin page at /admin. Not linked from the public site.
import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { cx } from "../components/ui";
import { LogoMark } from "../components/Logo";
import { api, ApiError, AuthError, fmtDate, type Signup } from "./api";
import { Btn, inputCls, Notice, Panel, statusLabels, statusTone } from "./kit";
import { Signups } from "./Signups";
import { TextEditor } from "./TextEditor";
import { SettingsPage } from "./SettingsPage";
import { Photos } from "./Photos";

/* ---------- Sign in ---------- */

function Login({ onDone }: { onDone: () => void }) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then((d) => setEnabled(Boolean(d.enabled)))
      .catch(() => {});
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!secret) return setError("Please enter the admin password.");
    setBusy(true);
    setError("");
    try {
      await api("/login", { method: "POST", json: { secret } });
      onDone();
    } catch (err) {
      const code = err instanceof ApiError ? err.data.error : "";
      setError(
        code === "wrong_secret"
          ? "That password isn't right."
          : code === "rate_limited"
            ? "Too many attempts. Please wait 15 minutes and try again."
            : "Couldn't sign in. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-mist px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-paper p-8 shadow-lift ring-1 ring-black/5">
        <LogoMark size={40} />
        <h1 className="mt-6 text-[26px] font-bold tracking-[-0.02em]">Saathi admin</h1>
        {enabled ? (
          <>
            <p className="mt-2 text-[15px] text-ink-2">For the owner only.</p>
            <label className="mt-7 block">
              <span className="block text-[14px] font-semibold">Admin password</span>
              <input
                type="password"
                autoComplete="current-password"
                autoFocus
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className={cx(inputCls, "mt-2 h-12")}
              />
            </label>
            {error && (
              <div className="mt-4">
                <Notice kind="error">{error}</Notice>
              </div>
            )}
            <Btn type="submit" disabled={busy} className="mt-6 w-full">
              {busy ? "Signing in…" : "Sign in"}
            </Btn>
          </>
        ) : (
          <div className="mt-6">
            <Notice kind="error">The admin page is switched off because no ADMIN_SECRET is set on the server.</Notice>
          </div>
        )}
        <Link to="/" className="mt-6 block text-center text-[14px] font-medium text-teal-deep hover:underline">
          Back to the website
        </Link>
      </form>
    </div>
  );
}

/* ---------- Overview ---------- */

type Stats = { total: number; pilot: number; waitlist: number; new: number; week: number };

function Overview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [latest, setLatest] = useState<Signup[]>([]);
  useEffect(() => {
    api<Stats>("/stats").then(setStats).catch(() => {});
    api<Signup[]>("/signups").then((r) => setLatest(r.slice(0, 5))).catch(() => {});
  }, []);
  const cards: [string, number | undefined, string][] = [
    ["Sign-ups", stats?.total, "everyone on the list"],
    ["Want the pilot", stats?.pilot, "asked for the paid pilot"],
    ["Waitlist", stats?.waitlist, "waiting for launch"],
    ["Not yet called", stats?.new, "status is still New"],
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(([label, n, hint]) => (
          <div key={label} className="rounded-3xl bg-paper p-5 shadow-soft ring-1 ring-black/5">
            <p className="text-[13px] font-semibold text-ink-2">{label}</p>
            <p className="nums mt-2 text-[36px] font-bold leading-none tracking-[-0.03em]">{n ?? "–"}</p>
            <p className="mt-2 text-[13px] text-ink-2">{hint}</p>
          </div>
        ))}
      </div>
      <Panel
        title="Latest sign-ups"
        intro={stats ? `${stats.week} in the last 7 days.` : undefined}
        actions={
          <Link to="/admin/signups" className="text-[15px] font-semibold text-teal-deep hover:underline">
            See all
          </Link>
        }
      >
        {latest.length === 0 ? (
          <p className="text-[15px] text-ink-2">No sign-ups yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {latest.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span className="min-w-0">
                  <span className="block font-semibold">{s.name}</span>
                  <span className="block text-[13px] text-ink-2">
                    {s.interest === "pilot" ? "Pilot" : "Waitlist"} · {s.parent_city} · {fmtDate(s.created_at)}
                  </span>
                </span>
                <span className={cx("rounded-pill px-2.5 py-1 text-[12px] font-semibold", statusTone[s.status])}>{statusLabels[s.status]}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          ["/admin/text", "Edit site text", "Change any words, in English and Hindi."],
          ["/admin/settings", "Prices and pilot", "Prices, places left, contact details."],
          ["/admin/photos", "Photos", "Upload your own photos."],
        ].map(([to, title, body]) => (
          <Link key={to} to={to} className="rounded-3xl bg-paper p-5 shadow-soft ring-1 ring-black/5 transition-shadow hover:shadow-lift">
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-[14px] text-ink-2">{body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------- Activity ---------- */

const actionLabels: Record<string, string> = {
  login: "Signed in",
  login_failed: "Wrong password entered",
  logout_everywhere: "Signed out on all devices",
  settings: "Changed settings",
  content_saved: "Edited site text",
  content_restored: "Restored an earlier version of the text",
  photo_uploaded: "Uploaded a photo",
  photo_removed: "Removed a photo",
  export_csv: "Downloaded the sign-ups spreadsheet",
  signup_status: "Changed a sign-up's status",
  signup_deleted: "Deleted a sign-up",
};

function Activity({ onSignOutAll }: { onSignOutAll: () => void }) {
  const [log, setLog] = useState<{ id: number; at: string; action: string; detail: string }[] | null>(null);
  useEffect(() => {
    api<typeof log>("/log").then(setLog).catch(() => setLog([]));
  }, []);
  return (
    <div className="space-y-6">
      <Panel
        title="Security"
        intro="If you signed in on a shared or lost device, sign out everywhere. You will need the admin password to sign in again."
      >
        <Btn kind="danger" onClick={onSignOutAll}>
          Sign out on all devices
        </Btn>
      </Panel>
      <Panel title="Activity" intro="The last 200 things done in this admin page.">
        {log === null ? (
          <p className="text-ink-2">Loading…</p>
        ) : log.length === 0 ? (
          <p className="text-ink-2">Nothing yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {log.map((l) => (
              <li key={l.id} className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3 text-[14px]">
                <span>
                  <span className={cx("font-medium", l.action === "login_failed" && "text-coral-deep")}>{actionLabels[l.action] ?? l.action}</span>
                  {l.detail && <span className="text-ink-2"> · {l.detail}</span>}
                </span>
                <span className="text-ink-2">{fmtDate(l.at)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

/* ---------- Shell ---------- */

const tabs = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/signups", label: "Sign-ups" },
  { to: "/admin/text", label: "Site text" },
  { to: "/admin/settings", label: "Prices & settings" },
  { to: "/admin/photos", label: "Photos" },
  { to: "/admin/activity", label: "Activity" },
];

function Shell({ children, onSignOut }: { children: ReactNode; onSignOut: () => void }) {
  return (
    <div className="min-h-screen bg-mist text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-paper">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-5 sm:px-8">
          <Link to="/admin" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="whitespace-nowrap text-[18px] font-bold tracking-[-0.02em]">
              saathi <span className="hidden font-medium text-ink-2 sm:inline">admin</span>
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <a href="/" target="_blank" rel="noopener" className="whitespace-nowrap rounded-pill px-3 py-2 text-[14px] font-semibold text-teal-deep hover:bg-mist">
              View site
            </a>
            <Btn kind="ghost" onClick={onSignOut} className="whitespace-nowrap">
              Sign out
            </Btn>
          </div>
        </div>
        <nav aria-label="Admin" className="mx-auto max-w-[1200px] overflow-x-auto px-3 sm:px-6">
          <ul className="flex gap-1 pb-2">
            {tabs.map((t) => (
              <li key={t.to}>
                <NavLink
                  to={t.to}
                  end={t.end}
                  className={({ isActive }) =>
                    cx(
                      "block whitespace-nowrap rounded-pill px-4 py-2 text-[14px] font-semibold transition-colors",
                      isActive ? "bg-ink text-white" : "text-ink-2 hover:bg-mist hover:text-ink",
                    )
                  }
                >
                  {t.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-8 sm:py-8">{children}</main>
    </div>
  );
}

export default function AdminApp() {
  const [state, setState] = useState<"checking" | "out" | "in">("checking");
  const navigate = useNavigate();

  // Keep the admin page out of search engines.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const title = document.title;
    document.title = "Saathi admin";
    return () => {
      meta.remove();
      document.title = title;
    };
  }, []);

  const check = useCallback(() => {
    api("/me")
      .then(() => setState("in"))
      .catch(() => setState("out"));
  }, []);
  useEffect(check, [check]);

  // Any request that finds the session gone sends the owner back to sign-in.
  useEffect(() => {
    const onError = (e: PromiseRejectionEvent) => {
      if (e.reason instanceof AuthError) setState("out");
    };
    window.addEventListener("unhandledrejection", onError);
    return () => window.removeEventListener("unhandledrejection", onError);
  }, []);

  const signOut = async (all = false) => {
    if (all && !window.confirm("Sign out on every device, including this one?")) return;
    await api(all ? "/logout-all" : "/logout", { method: "POST" }).catch(() => {});
    setState("out");
    navigate("/admin");
  };

  if (state === "checking") return <div className="min-h-screen bg-mist" />;
  if (state === "out") return <Login onDone={() => setState("in")} />;

  return (
    <Shell onSignOut={() => signOut(false)}>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="signups" element={<Signups />} />
        <Route path="text" element={<TextEditor />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="photos" element={<Photos />} />
        <Route path="activity" element={<Activity onSignOutAll={() => signOut(true)} />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Shell>
  );
}
