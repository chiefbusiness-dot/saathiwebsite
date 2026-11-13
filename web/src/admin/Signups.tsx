// Sign-ups: search, filter, update status and notes, delete, download as a spreadsheet.
import { useCallback, useEffect, useMemo, useState } from "react";
import { cx } from "../components/ui";
import { api, fmtDate, type Signup } from "./api";
import { ageLabels, Btn, inputCls, Notice, Panel, statusLabels, statusTone } from "./kit";

function Row({ s, onChange, onDelete }: { s: Signup; onChange: (s: Signup) => void; onDelete: (id: number) => void }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(s.notes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const patch = async (body: Partial<Pick<Signup, "status" | "notes">>) => {
    setSaving(true);
    setError("");
    try {
      onChange(await api<Signup>(`/signups/${s.id}`, { method: "PATCH", json: body }));
    } catch {
      setError("Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${s.name}'s sign-up? This cannot be undone.`)) return;
    try {
      await api(`/signups/${s.id}`, { method: "DELETE" });
      onDelete(s.id);
    } catch {
      setError("Couldn't delete. Please try again.");
    }
  };

  const wa = s.phone.replace(/\D/g, "");
  return (
    <li className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-1 py-4 text-left hover:bg-mist/60 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:px-3"
      >
        <span className="min-w-0">
          <span className="block truncate text-[16px] font-semibold">{s.name}</span>
          <span className="nums block text-[13px] text-ink-2">{s.phone}</span>
        </span>
        <span className={cx("justify-self-end rounded-pill px-2.5 py-1 text-[12px] font-semibold sm:order-last", statusTone[s.status])}>
          {statusLabels[s.status]}
        </span>
        <span className="text-[14px] text-ink-2">
          {s.interest === "pilot" ? "Pilot" : "Waitlist"} · {s.parent_city}
        </span>
        <span className="hidden text-[13px] text-ink-2 sm:block">{fmtDate(s.created_at)}</span>
      </button>

      {open && (
        <div className="grid grid-cols-1 gap-6 px-1 pb-6 sm:px-3 lg:grid-cols-2">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[14px]">
            {[
              ["Signed up", fmtDate(s.created_at)],
              ["Email", s.email || "—"],
              ["Their city", s.city],
              ["Parent's city", s.parent_city],
              ["Parent's age", ageLabels[s.parent_age] ?? s.parent_age],
              ["Language", s.lang === "hi" ? "Hindi" : "English"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[12px] font-semibold text-ink-2">{k}</dt>
                <dd className="break-words">{v}</dd>
              </div>
            ))}
            <div className="col-span-2">
              <dt className="text-[12px] font-semibold text-ink-2">Their message</dt>
              <dd className="whitespace-pre-wrap break-words">{s.message || "—"}</dd>
            </div>
            <div className="col-span-2 flex flex-wrap gap-2 pt-1">
              <a href={`tel:${s.phone}`} className="rounded-pill bg-mist px-4 py-2 text-[14px] font-semibold hover:bg-line">
                Call
              </a>
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-pill bg-mist px-4 py-2 text-[14px] font-semibold hover:bg-line"
              >
                WhatsApp
              </a>
              {s.email && (
                <a href={`mailto:${s.email}`} className="rounded-pill bg-mist px-4 py-2 text-[14px] font-semibold hover:bg-line">
                  Email
                </a>
              )}
            </div>
          </dl>

          <div className="space-y-4">
            <label className="block">
              <span className="block text-[13px] font-semibold">Status</span>
              <select
                value={s.status}
                aria-label={`Status for ${s.name}`}
                disabled={saving}
                onChange={(e) => patch({ status: e.target.value as Signup["status"] })}
                className={cx(inputCls, "mt-1.5")}
              >
                {Object.entries(statusLabels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-[13px] font-semibold">Private notes</span>
              <textarea
                rows={4}
                aria-label={`Private notes for ${s.name}`}
                value={notes}
                maxLength={5000}
                onChange={(e) => setNotes(e.target.value)}
                className={cx(inputCls, "mt-1.5 leading-relaxed")}
                placeholder="Only you can see these."
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <Btn onClick={() => patch({ notes })} disabled={saving || notes === s.notes}>
                {saving ? "Saving…" : "Save notes"}
              </Btn>
              <Btn kind="danger" onClick={remove}>
                Delete
              </Btn>
            </div>
            {error && <Notice kind="error">{error}</Notice>}
          </div>
        </div>
      )}
    </li>
  );
}

export function Signups() {
  const [rows, setRows] = useState<Signup[] | null>(null);
  const [q, setQ] = useState("");
  const [interest, setInterest] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (interest) p.set("interest", interest);
    if (status) p.set("status", status);
    return p.toString();
  }, [q, interest, status]);

  const load = useCallback(async () => {
    try {
      setRows(await api<Signup[]>(`/signups${params ? `?${params}` : ""}`));
      setError("");
    } catch {
      setError("Couldn't load sign-ups.");
    }
  }, [params]);

  useEffect(() => {
    const id = setTimeout(load, 200); // wait for typing to pause
    return () => clearTimeout(id);
  }, [load]);

  return (
    <Panel
      title="Sign-ups"
      intro="Everyone who filled in the Join the pilot form. Click a name to see details, set a status or add private notes."
      actions={
        <a
          href={`/api/admin/signups.csv${params ? `?${params}` : ""}`}
          className="inline-flex h-11 items-center rounded-pill bg-mist px-5 text-[15px] font-semibold hover:bg-line"
        >
          Download spreadsheet
        </a>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_minmax(11rem,auto)_minmax(10rem,auto)]">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, phone, email or city"
          aria-label="Search sign-ups"
          className={inputCls}
        />
        <select value={interest} onChange={(e) => setInterest(e.target.value)} aria-label="Filter by interest" className={inputCls}>
          <option value="">Pilot and waitlist</option>
          <option value="pilot">Pilot only</option>
          <option value="waitlist">Waitlist only</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className={inputCls}>
          <option value="">Any status</option>
          {Object.entries(statusLabels).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mt-4">
          <Notice kind="error">{error}</Notice>
        </div>
      )}
      {rows === null ? (
        <p className="mt-8 text-[15px] text-ink-2">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-mist px-5 py-8 text-center text-[15px] text-ink-2">
          {params ? "No sign-ups match these filters." : "No sign-ups yet. They will appear here as soon as someone joins."}
        </p>
      ) : (
        <>
          <p className="mt-5 text-[13px] text-ink-2">
            {rows.length} {rows.length === 1 ? "sign-up" : "sign-ups"}
          </p>
          <ul className="mt-2 border-t border-line">
            {rows.map((s) => (
              <Row
                key={s.id}
                s={s}
                onChange={(n) => setRows((old) => old?.map((x) => (x.id === n.id ? n : x)) ?? null)}
                onDelete={(id) => setRows((old) => old?.filter((x) => x.id !== id) ?? null)}
              />
            ))}
          </ul>
        </>
      )}
    </Panel>
  );
}
