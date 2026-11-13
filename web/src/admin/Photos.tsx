// Upload or replace the site's photos. The server resizes them so they stay sharp and fast.
import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "./api";
import { Btn, Notice, Panel } from "./kit";

const slots = [
  { id: "story", title: "Story photo", where: "Home page (Our story section) and the top of the Our story page.", tip: "A landscape photo, for example Dehradun or your grandparents' home." },
  { id: "team", title: "Team photo", where: "Our story page, below the story. Hidden until you upload one.", tip: "A landscape photo of the people behind Saathi." },
];

const uploadErrors: Record<string, string> = {
  too_small: "That photo is too small. Please use one at least 400 pixels wide (1600 or more looks best).",
  not_an_image: "That file doesn't look like a photo. Please use a JPG, PNG or WebP image.",
};

function Slot({ id, title, where, tip, version, onChange }: (typeof slots)[number] & { version?: string; onChange: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const upload = async (file: File) => {
    setMsg(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMsg({ kind: "error", text: uploadErrors.not_an_image });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMsg({ kind: "error", text: "That file is larger than 10 MB. Please use a smaller photo." });
      return;
    }
    setBusy(true);
    try {
      await api(`/images/${id}`, { method: "POST", body: file, headers: { "content-type": file.type } });
      setMsg({ kind: "ok", text: "Uploaded. The photo is live on the site." });
      onChange();
    } catch (e) {
      const code = e instanceof ApiError ? (e.data.error ?? "") : "";
      setMsg({ kind: "error", text: uploadErrors[code] ?? "Couldn't upload. Please try again." });
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  const remove = async () => {
    if (!window.confirm(`Remove the ${title.toLowerCase()}? The site will go back to the illustration.`)) return;
    setBusy(true);
    try {
      await api(`/images/${id}`, { method: "DELETE" });
      setMsg({ kind: "ok", text: "Removed." });
      onChange();
    } catch {
      setMsg({ kind: "error", text: "Couldn't remove. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel title={title} intro={where}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-mist ring-1 ring-line">
          {version ? (
            <img src={`/api/images/${id}?w=800&v=${version}`} alt={`Current ${title.toLowerCase()}`} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center px-6 text-center text-[14px] text-ink-2">No photo yet. The site shows a placeholder.</div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-4">
          <p className="text-[14px] leading-relaxed text-ink-2">
            {tip} JPG, PNG or WebP, up to 10 MB. Location and camera details are removed from the file automatically.
          </p>
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            id={`file-${id}`}
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
          <div className="flex flex-wrap gap-3">
            <Btn onClick={() => input.current?.click()} disabled={busy}>
              {busy ? "Working…" : version ? "Replace photo" : "Upload photo"}
            </Btn>
            {version && (
              <Btn kind="danger" onClick={remove} disabled={busy}>
                Remove
              </Btn>
            )}
          </div>
          {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
        </div>
      </div>
    </Panel>
  );
}

export function Photos() {
  const [images, setImages] = useState<Record<string, string>>({});
  const load = () =>
    fetch("/api/site")
      .then((r) => r.json())
      .then((d) => setImages(d.images ?? {}))
      .catch(() => {});
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="space-y-6">
      {slots.map((s) => (
        <Slot key={s.id} {...s} version={images[s.id]} onChange={load} />
      ))}
    </div>
  );
}
