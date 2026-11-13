# Saathi Website — Build Plan

Saathi is a safety service for a parent who lives alone, sold to their adult child: a 4G safety watch (₹9,999 one-time) plus an optional ₹199/month care plan that puts a real person on the other end of every alert.

**One-line pitch:** the only elder-safety product in India that doesn't just beep — someone actually answers.

This document is the brief the website is built from. It is written so it can be changed: edit it, and the build follows.

---

## 0. Non-negotiable rules

- **No selling yet.** The watch cannot legally be sold in India until WPC/BIS certification (target: May 2027). The site takes **waitlist and pilot sign-ups only**: no cart, no payments, no "Buy now". There is no pre-order or buy button until certification.
- **Never a medical claim.** Copy always says Saathi "alerts your family and gets help". Never "diagnoses", "monitors your health", "medical device", or "guarantees rescue". The footer says: *"Saathi alerts your family and coordinates help. It is not a medical device and does not replace emergency services. In an emergency, call 112."*
- **Privacy first.** Sign-up data (names, phone numbers, parents' city) is visible only in the admin page. No third-party trackers or ad pixels. Simple, honest privacy policy page.
- **The family-app preview uses sample data only**, clearly labelled "Preview — sample data". It never connects to a real watch or shows a real person.
- **Everything the owner might want to change is editable in the admin page** without touching code: text (both languages), prices, FAQs, photos, contact details, WhatsApp/phone/email, the pilot seat count, and the on/off switches.
- Work in phases (section 9). After each phase: run the tests, fix failures, give a short plain-English summary before continuing.

## 1. Tech stack

- **Frontend:** React + Vite + TypeScript, React Router, Framer Motion for animation, Tailwind CSS.
- **Backend:** Node.js + TypeScript + Express. One single Node service serves the API and the built frontend.
- **Database:** PostgreSQL. In production, Supabase (free tier) via `DATABASE_URL`. Locally, embedded Postgres (PGlite) starts automatically when `DATABASE_URL` is not set, so it runs with zero setup.
- **Images uploaded in admin:** resized on upload (WebP, several sizes) and stored in the database, so nothing is lost when Render restarts.
- **Hosting:** Render.com free web service, with a `render.yaml`.
- **Cost:** everything has a free tier. The only optional cost is a custom domain (e.g. `saathi.in`, roughly ₹800–1,500/year).

## 2. Audience and message

| | The buyer (who visits the site) | The user (who wears the watch) |
|---|---|---|
| Who | Son or daughter, 30–50, in a metro | Parent, 60–85, living alone or alone in the daytime |
| Fear | "I won't know if something happens to them" | "I don't want to be a burden or be watched" |
| Wants | Proof the parent is fine, and fast help if not | No fuss, nothing to learn, charge once a week |

The site speaks to the **buyer**, but always respects the **parent**: dignity, not surveillance. The watch is worn openly, by choice.

**Story arc of the home page:** the fear → why existing products fail ("they beep, and then nothing happens") → Saathi: a watch *and* a person → what happens in the first minutes after a fall → the care plan → simple pricing → founder story (Dehradun, built for our own grandparents) → FAQ → join the pilot.

## 3. Design — modern tech, Apple-style product site

Clean, confident, lots of white space, the watch as the hero object. Warm rather than cold: this is about family.

**Palette**
- Background: pure white `#FFFFFF` and soft grey `#F5F5F7`; dark sections in near-black `#0B0B0D`.
- Text: `#1D1D1F` primary, `#6E6E73` secondary.
- Accent: Saathi teal `#0E8F7E` (trust, calm) with a warm signal coral `#FF6B4A` used **only** for SOS/alert moments.
- All text meets WCAG AA contrast.

**Typography**
- Headings and UI: Inter (variable), tight tracking on big headlines, tabular figures for prices and stats.
- Hindi: Noto Sans Devanagari, matched in weight and size.

**Signature visuals**
- The watch drawn as crisp vector/3D-style SVG renders (no blurry images), slowly rotating on scroll in the hero.
- **"The first five minutes"** scroll story: a timeline that plays as you scroll — fall detected (00:00) → Saathi calls the parent (00:30) → no answer, calls the neighbour (02:00) → ambulance called, family updated on WhatsApp (03:00) → someone stays on the line until help arrives.
- An animated phone mock-up showing the family app preview.
- Sticky, frosted-free navigation bar (solid, sharp text). Scroll-triggered fades and slides, 60fps, transform/opacity only.
- Respects "prefers-reduced-motion".

**Responsive:** mobile-first; tested at 375px, 414px, 768px, 1280px and 1920px.

## 4. Pages (public)

1. **Home** — the story arc above, ending in the sign-up form.
2. **How it works** — the watch (fall detection, SOS, GPS, two-way calling, ~1 week battery) and the response team, step by step.
3. **Care plan** — what ₹199/month gets: real person answers every alert, daily check-in call, small errands (e.g. placing a Blinkit order). Clear "what we do / what we don't promise".
4. **Pricing** — watch ₹9,999 one-time (works without any subscription; alerts go to the family's phone free), care plan ₹199/month optional. Labelled "Launching 2027 — join the waitlist".
5. **Why Saathi** — honest comparison: health rings, fall-detection watches, SOS pendants, room radar vs Saathi.
6. **Our story** — Dehradun, built first for our own grandparents.
7. **Family app preview** (section 5).
8. **FAQ** — charging, signal, privacy, what if there's a false alarm, which cities, when it launches.
9. **Join the pilot / waitlist** — form.
10. **Contact** — form, phone, email, WhatsApp link (all editable).
11. **Privacy policy** and **Terms** — plain-English, including "we alert and coordinate; we do not guarantee rescue".

Every page has an English / हिन्दी switch in the header; the choice is remembered.

## 5. Family app preview (sample data)

An interactive demo, inside a phone frame on desktop and full-screen on mobile, of what the adult child will see:

- **Home:** parent's card — "Maa is OK", last check-in, watch battery, signal.
- **Live location:** map with the watch's position (stylised map, sample location in Dehradun).
- **Alerts:** a timeline of past alerts — one real-looking fall alert with the full response log (who called whom, when, outcome) and one false alarm cancelled by the parent.
- **Daily check-ins:** the care team's daily call notes.
- **"Simulate a fall" button:** plays the full alert sequence in the demo, with the coral alert screen and the step-by-step response.

Clearly marked "Preview — sample data. The real app launches with the watch."

## 6. Sign-ups

**Form fields:** your name, your phone (WhatsApp), your email (optional), your city, your parent's city, parent's age range, "I'm interested in": waitlist / 20-family paid pilot, a free-text "anything we should know", consent checkbox.

- Validation, spam protection (honeypot + rate limit), friendly confirmation screen in the chosen language.
- **Pilot seat counter** ("12 of 20 pilot places left"), editable in admin.
- Every sign-up is saved and shown in the admin page; downloadable as a CSV spreadsheet.

## 7. Admin page (owner only)

- Hidden login route; owner signs in with `ADMIN_SECRET` (an environment variable). Secure httpOnly session cookie, stored hashed; stays logged in across browser restarts; "log out everywhere" button.
- **Sign-ups:** table with search and filter (waitlist/pilot, city, date), status (new / contacted / pilot / not a fit), private notes, CSV download.
- **Content editor:** every headline, paragraph, FAQ and button label, side-by-side English and Hindi, with a live preview. Changes go live immediately; a history lets you undo.
- **Prices and numbers:** watch price, care-plan price, pilot seats left, launch date text.
- **Photos:** upload/replace hero, story and team photos (auto-resized and sharp on every screen).
- **Contact settings:** phone, email, WhatsApp number, address.
- **Switches:** show/hide the family-app preview, open/close pilot sign-ups. (A pre-order switch is left out until there is something legal to sell; it belongs with the 2027 sales work.)
- Security: rate-limited login, helmet headers, input validation everywhere, CORS locked to the site's own domain.

## 8. Data to store

Sign-ups (with status and notes), site content (both languages, with version history), settings (prices, switches, contact), uploaded images, admin sessions, admin action log.

## 9. Phases

1. **Project setup + design system** — colours, type, components, the watch SVG, page layouts with real copy (English), static.
2. **All public pages** + Hindi translation + language switch + scroll animations + "first five minutes" story.
3. **Family app preview** with sample data and "simulate a fall".
4. **Backend + database** — sign-up form saved to the database, validation, spam protection, pilot counter.
5. **Admin page** — login, sign-ups table + CSV, content editor, prices, photos, settings, switches.
6. **Testing** — automated tests for the API and forms; Playwright screenshots at phone/tablet/desktop sizes in both languages; fix visual problems; Lighthouse check for speed and accessibility.
7. **Deployment** — GitHub upload, Supabase database, Render web service, and `DEPLOY_GUIDE.md`.

## 10. Deployment guide for the owner (non-technical)

At the end, write `DEPLOY_GUIDE.md` and explain it step by step in chat, assuming no experience:

- Running it on the Mac with one command.
- Signing in to GitHub on this Mac and uploading the project.
- Creating a free Supabase project and copying the database connection string.
- Creating a free Render web service from GitHub, and exactly which environment variables to paste (`DATABASE_URL`, `ADMIN_SECRET`; `NODE_ENV=production` is set by `render.yaml`).
- First admin login: editing text, checking sign-ups, downloading the spreadsheet.
- Optional: connecting a custom domain.
- Free-tier limits in plain words (Render sleeps after ~15 minutes idle and takes ~50 seconds to wake; Supabase pauses after a week without use and how to un-pause).
- What to do if something breaks.
