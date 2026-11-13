# Saathi — Deploy guide

This guide takes the Saathi website from your Mac to a real web address that anyone can open. No technical knowledge is needed. Do the parts in order. Each part takes 5 to 15 minutes.

**What it costs:** nothing. GitHub, Supabase and Render all have free plans, and Saathi fits inside them. The only optional cost is your own web address (like `saathi.in`), about ₹800–1,500 a year. See Part 7.

**The three services, in plain words:**

| Service | What it does for Saathi |
|---|---|
| **GitHub** | Keeps a safe copy of the website's code online. Render reads the code from here. |
| **Supabase** | The database. Stores sign-ups, your text changes, settings and photos. |
| **Render** | The computer that runs the website, 24 hours a day, at a public address. |

---

## Part 1 — Run it on your own Mac (optional check)

You already have everything installed. To see the site on your Mac:

1. Open the **Terminal** app (press `⌘ Space`, type `Terminal`, press Enter).
2. Paste these lines one at a time, pressing Enter after each:
   ```bash
   cd ~/Documents/saathiwebsite
   npm install
   npm run build
   npm start
   ```
3. Open **http://localhost:3000** in your browser.
4. The admin page is at **http://localhost:3000/admin**. The password for your Mac is in a file. To see it, open a second Terminal window and paste:
   ```bash
   cat ~/Documents/saathiwebsite/.admin-secret
   ```
5. To stop the site, go back to the first Terminal window and press `Ctrl C`.

> On Windows instead: install Node.js from nodejs.org (the "LTS" button), open the folder in "Command Prompt", and run the same `npm` lines.

---

## Part 2 — Upload the code to GitHub

Your GitHub repository already exists: **github.com/chiefbusiness-dot/saathiwebsite**. It is empty. We will fill it using the free **GitHub Desktop** app, which needs no typing of commands.

1. Go to **desktop.github.com** and click **Download for macOS**.
2. Open the downloaded file and drag **GitHub Desktop** into your **Applications** folder. Open it.
3. Click **Sign in to GitHub.com**. Your browser opens. Sign in with the account that owns `chiefbusiness-dot`, then click **Authorize desktop**. Go back to GitHub Desktop.
4. If it asks how to configure Git, keep your name and email and click **Finish**.
5. In the top menu, click **File → Add Local Repository…**
6. Click **Choose…**, open **Documents**, select the **saathiwebsite** folder, and click **Add Repository**.
7. At the top of the window, click **Publish branch** (or **Push origin**).
8. Wait until it finishes. Open **github.com/chiefbusiness-dot/saathiwebsite** in your browser. You should now see folders like `web` and `server`, and files like `README.md`.

**Public or private?** The repository is currently **public**: anyone can read the code (not your sign-ups, passwords or data — those are never in the code). To make it private: on the GitHub page click **Settings**, scroll to the bottom to **Danger Zone**, click **Change visibility → Make private**. Render works either way.

**Later, after any change:** open GitHub Desktop and click **Push origin**. Render updates the live site automatically within a few minutes.

---

## Part 3 — Create the database on Supabase

1. Go to **supabase.com** and click **Start your project**. Sign up (the **Continue with GitHub** button is easiest).
2. Click **New project**.
   - **Organization:** keep the one it suggests (it's free).
   - **Project name:** `saathi`
   - **Database password:** click **Generate a password**, or type your own using **only letters and numbers** (symbols like `@` or `#` cause problems later). **Copy this password into your Notes app now.** You need it in step 6.
   - **Region:** choose **South Asia (Mumbai)**.
   - **Plan:** Free.
3. Click **Create new project**. Wait 1–2 minutes until it says the project is ready.
4. At the top of the page, click the **Connect** button.
5. Under **Connection string**, choose the **Session pooler** option.
   - Use the **Session pooler**, not "Direct connection". Render's free plan can only reach the pooler.
6. Copy the line that starts with `postgresql://`. It looks like this:
   ```
   postgresql://postgres.abcdefghijkl:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
   ```
   Paste it into your Notes app. Replace `[YOUR-PASSWORD]` (including the square brackets) with the database password from step 2.

This full line is your **DATABASE_URL**. Keep it private: anyone who has it can read your sign-ups.

You don't need to create any tables. Saathi sets up its own the first time it starts.

---

## Part 4 — Put the site online with Render

1. Go to **render.com** and click **Get Started**. Choose **GitHub** to sign up, and allow access.
2. In the Render dashboard, click **New +** (top right), then **Blueprint**.
3. If it asks to connect GitHub, click **Connect GitHub**, choose your `chiefbusiness-dot` account, select **Only select repositories → saathiwebsite**, and click **Install**.
4. Pick **saathiwebsite** from the list and click **Connect**.
5. **Blueprint name:** `saathi`. Render reads the `render.yaml` file and shows one service called **saathi** on the **Free** plan.
6. Render asks for two values:
   - **DATABASE_URL** → paste the full line from Part 3, step 6.
   - **ADMIN_SECRET** → your admin password. Make one up: **at least 12 characters**, not used anywhere else, e.g. three random words and a number: `mango-river-lantern-42`. **Save it in your Notes app.** If it's shorter than 12 characters, the admin page stays switched off.
7. Click **Apply** (or **Deploy Blueprint**).
8. Click the **saathi** service and watch the **Logs**. The first build takes about 3–5 minutes. It's done when you see:
   ```
   Saathi running at http://localhost:10000 (database: postgres)
   ```
   The words `database: postgres` mean it's connected to Supabase.
9. At the top of the page you'll see your web address, like **https://saathi-ab12.onrender.com**. Click it. That's your live website.

---

## Part 5 — First time in the admin page

1. Open your web address and add `/admin` at the end, e.g. `https://saathi-ab12.onrender.com/admin`.
2. Type your **ADMIN_SECRET** and click **Sign in**. You stay signed in on that device for 6 months.
3. Do these once:
   - **Prices & settings → Contact details:** add your phone, WhatsApp and email. Click **Save**.
   - **Prices & settings → The pilot:** check the places left (starts at 20 of 20).
   - **Photos:** upload a landscape photo for the Story section (at least 1600 pixels wide looks best).
   - **Site text:** read through anything you want to change. Click **Save and publish**.
4. Open the main site and fill in the **Join the pilot** form with your own details as a test. It should appear in **Sign-ups**. Delete it afterwards.

Nobody else can find the admin page: it isn't linked anywhere and search engines are told to ignore it. Still, don't share the address and password together.

---

## Part 6 — Free plan limits, in plain words

| What happens | Why | What to do |
|---|---|---|
| The site takes **about 50 seconds** to open after a quiet spell | Render's free plan **sleeps after 15 minutes** with no visitors | Nothing. The first visitor waits, then it's fast. To avoid it, upgrade the service to Render's **Starter** plan (about $7, roughly ₹600, a month). |
| The site stops working and Supabase says **"Project paused"** | Supabase's free plan **pauses after 7 days** with no database activity | Log in to supabase.com, open the project, click **Restore project**. Wait 2 minutes. Visiting the site every few days (or getting sign-ups) keeps it awake. |
| Storage | Supabase free: **500 MB**. Sign-ups and text use almost nothing; each photo uses about 0.5 MB | You won't come close. |
| Running hours | Render free: **750 hours a month**, enough for one site running all month | Nothing to do. |

Free plans can change. If either service emails you about a change, forward it to whoever helps you with the site.

---

## Part 7 — Your own web address (optional, costs money)

1. Buy a domain from a seller such as GoDaddy, Hostinger or Namecheap (search for `saathi`; `.in` domains are cheapest in India).
2. In Render, open the **saathi** service → **Settings** → **Custom Domains** → **Add Custom Domain**, and type your domain (e.g. `www.saathi.in`).
3. Render shows a **CNAME** record. In your domain seller's website, find **DNS settings** and add that record exactly as shown.
4. Wait 10 minutes to a few hours. Render adds the secure padlock (`https://`) automatically, free.

---

## Part 8 — If something breaks

**First, always:** open Render → **saathi** → **Logs**, and look at the last red lines. Copy them for whoever helps you.

| Problem | Likely cause | Fix |
|---|---|---|
| Site shows "Service unavailable" or takes a minute | It was asleep (Part 6) | Wait 60 seconds and refresh. |
| Logs say `DATABASE_URL is not set` | The value is missing | Render → saathi → **Environment** → add `DATABASE_URL` → **Save Changes**. |
| Logs say `password authentication failed` | Wrong password inside DATABASE_URL | Check you replaced `[YOUR-PASSWORD]` and removed the brackets. Or reset the password in Supabase (**Project Settings → Database → Reset database password**) and update DATABASE_URL in Render. |
| Logs say `ENOTFOUND`, `ENETUNREACH` or `timeout` | You used the "Direct connection" string, or Supabase is paused | Use the **Session pooler** string (Part 3, step 5). Check Supabase isn't paused (Part 6). |
| Admin page says "switched off" | ADMIN_SECRET missing or under 12 characters | Render → **Environment** → set a longer `ADMIN_SECRET` → **Save Changes**. |
| Forgot the admin password | — | Render → **Environment** → change `ADMIN_SECRET` → **Save Changes**. Sign in with the new one. |
| Lost a phone or laptop that was signed in | — | Admin → **Activity** → **Sign out on all devices**. Then change `ADMIN_SECRET` in Render. |
| A text change looks wrong | — | Admin → **Site text** → **Earlier versions** → **Restore**. |
| A new change broke the site | A bad update was pushed | Render → saathi → **Events** → find the last good deploy → **Rollback**. |

---

## Your private details — keep these in one safe place

- [ ] Supabase database password
- [ ] DATABASE_URL (the full `postgresql://…` line)
- [ ] ADMIN_SECRET (your admin password)
- [ ] Your live web address (`https://….onrender.com`)

Never put these in the code, in GitHub, or in a public message.
