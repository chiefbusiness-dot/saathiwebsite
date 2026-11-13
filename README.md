# Saathi website

A 4G safety watch for your parent, and a real person on the other end of every alert.

See [BUILD_PLAN.md](BUILD_PLAN.md) for the full brief and phases.

## Run it on your computer

```bash
npm install
npm run build
npm start
```

Then open http://localhost:3000. The design system is at http://localhost:3000/style-guide.

Run the automated tests with `npm test`.

With no setup, sign-ups are saved in an embedded database in the `.pglite` folder. Set `DATABASE_URL` to use a real Postgres database (Supabase in production).

While editing, `npm run dev` gives a live-reloading version at http://localhost:5173.

## Putting it online

See [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) for step-by-step instructions (GitHub, Supabase, Render).
