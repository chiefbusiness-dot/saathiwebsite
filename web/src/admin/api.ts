// Small helper for the admin API. Every request carries the header the server requires.
export class AuthError extends Error {}
export class ApiError extends Error {
  constructor(
    public status: number,
    public data: { error?: string; fields?: string[] },
  ) {
    super(data.error ?? `HTTP ${status}`);
  }
}

export async function api<T = unknown>(
  path: string,
  init: { method?: string; json?: unknown; body?: BodyInit; headers?: Record<string, string> } = {},
): Promise<T> {
  const res = await fetch(`/api/admin${path}`, {
    method: init.method ?? "GET",
    credentials: "same-origin",
    headers: {
      "x-saathi-admin": "1",
      ...(init.json !== undefined ? { "content-type": "application/json" } : {}),
      ...init.headers,
    },
    body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
  });
  if (res.status === 401 && path !== "/login") throw new AuthError();
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}

export type Signup = {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  parent_city: string;
  parent_age: string;
  interest: "pilot" | "waitlist";
  message: string;
  lang: string;
  status: "new" | "contacted" | "pilot" | "not_a_fit";
  notes: string;
};

export type Settings = {
  pilot_total: number;
  pilot_left: number;
  pilot_open: boolean;
  preview_visible: boolean;
  watch_price: string;
  plan_price: string;
  contact_phone: string;
  contact_email: string;
  contact_whatsapp: string;
  contact_address: string;
};

export const fmtDate = (s: string) =>
  new Date(s).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
