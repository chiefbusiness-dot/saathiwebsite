// Checks and cleans a sign-up before it is saved. Returns field-level error codes
// ("required" | "invalid") that the website turns into messages in the visitor's language.
import { z } from "zod";

const text = (min: number, max: number) =>
  z
    .string()
    .transform((s) => s.replace(/\s+/g, " ").trim())
    .pipe(z.string().min(min).max(max));

/** Accepts Indian mobiles (with or without +91 / 0) and international numbers starting with +. */
export function normalisePhone(raw: string): string | null {
  const s = raw.replace(/[\s\-().]/g, "");
  if (s.startsWith("+")) {
    const d = s.slice(1);
    if (!/^\d{8,15}$/.test(d)) return null;
    if (d.startsWith("91")) return /^91[6-9]\d{9}$/.test(d) ? `+${d}` : null;
    return `+${d}`;
  }
  if (!/^\d+$/.test(s)) return null;
  const d = s.length === 12 && s.startsWith("91") ? s.slice(2) : s.length === 11 && s.startsWith("0") ? s.slice(1) : s;
  return /^[6-9]\d{9}$/.test(d) ? `+91${d}` : null;
}

const schema = z.object({
  name: text(2, 80),
  phone: z.string().max(30),
  email: z.union([z.literal(""), z.string().trim().toLowerCase().max(120).pipe(z.email())]).default(""),
  city: text(2, 80),
  parentCity: text(2, 80),
  parentAge: z.enum(["under60", "60-69", "70-79", "80plus"]),
  interest: z.enum(["pilot", "waitlist"]),
  message: z
    .string()
    .max(1000)
    .transform((s) => s.trim())
    .default(""),
  lang: z.enum(["en", "hi"]).default("en"),
  consent: z.literal(true),
});

export type Signup = z.infer<typeof schema>;
export type FieldErrors = Record<string, "required" | "invalid">;

export function parseSignup(body: unknown): { ok: true; data: Signup } | { ok: false; errors: FieldErrors } {
  const input = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const result = schema.safeParse(input);
  const errors: FieldErrors = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = String(issue.path[0] ?? "form");
      const v = input[field];
      const empty = v === undefined || v === null || v === false || (typeof v === "string" && v.trim() === "");
      errors[field] ??= empty ? "required" : "invalid";
    }
  }
  const phone = typeof input.phone === "string" ? normalisePhone(input.phone) : null;
  if (!phone) errors.phone ??= typeof input.phone === "string" && input.phone.trim() ? "invalid" : "required";
  if (!result.success || !phone) return { ok: false, errors };
  return { ok: true, data: { ...result.data, phone } };
}
