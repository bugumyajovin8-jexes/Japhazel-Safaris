# Database setup

The site runs in one of two modes, decided entirely by whether `DATABASE_URL`
is set.

| | No `DATABASE_URL` | With `DATABASE_URL` |
| --- | --- | --- |
| Tours & gallery | Seeded into memory each boot | Seeded once into Postgres |
| Bookings | **Lost on restart** | Persisted |
| Contact messages | **Lost on restart** | Persisted |
| Admin sessions | Lost on restart | Persisted (`user_sessions` table) |
| `/api/health` says | `"memory (demo — data is not saved)"` | `"postgres"` |

Memory mode is fine for showing the site to a client. It is not fine once real
people can submit the booking form.

---

## 1. Get a connection string

Any Postgres works. Free tiers that suit this project:

**Neon** — <https://neon.tech> · quickest for Vercel, generous free tier.
Create a project, then copy the pooled connection string from the dashboard.

**Supabase** — <https://supabase.com> · use **Settings → Database →
Connection string → URI**, and pick **Transaction mode (port 6543)**. Do not
use the `https://...supabase.co` API URL; the app rejects it with an explanatory
error because it is a common mix-up.

**Vercel Postgres** — from the Vercel dashboard, Storage → Create. It sets
`DATABASE_URL` on the project automatically.

**Local Postgres** — you already have PostgreSQL 18 installed, listening on
**port 4193** (not the usual 5432). To use it for development:

```bash
createdb -U postgres -h 127.0.0.1 -p 4193 japhazel
```

Then set `DATABASE_URL=postgresql://postgres:YOURPASSWORD@127.0.0.1:4193/japhazel`.

## 2. Point the app at it

Create `.env` in the project root (it is gitignored — never commit it):

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
SESSION_SECRET=<64 hex chars>
ADMIN_EMAIL=admin@japhazel.com
ADMIN_PASSWORD=<something long>
```

Generate a session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Create the tables

```bash
npm run db:setup
```

This applies everything in `./migrations`, verifies all six tables exist, and
prints row counts. It is safe to run repeatedly — Drizzle tracks which
migrations have already been applied.

## 4. Start the app

```bash
npm run dev
```

On first boot it seeds 12 tours and 28 gallery images. On later boots it sees
the existing rows and leaves them alone, so your edits in the admin panel are
never overwritten.

Confirm it worked:

```bash
curl -s http://localhost:3000/api/health
```

You want `"persistence":"postgres"` and `"dbReachable":true`.

---

## Deploying to Vercel

Add the same four variables under **Project → Settings → Environment
Variables**, then redeploy.

Run the migrations once against the production database from your own machine,
with `DATABASE_URL` temporarily pointing at it:

```bash
npm run db:setup
```

Vercel does not run migrations for you, and the app does not run them at boot —
doing that on a serverless platform means every cold start races every other
cold start to alter the schema.

### Connection pooling matters here

Each serverless invocation can open its own pool. Use your provider's **pooled**
connection string (Neon's pooled endpoint, Supabase's port 6543), not the
direct one, or you will exhaust connections under modest traffic.

---

## Changing the schema later

Edit `shared/schema.ts`, then:

```bash
npm run db:generate
```

That writes a new migration into `./migrations`. Review the SQL, commit it, and
apply it with `npm run db:setup`.

`npm run db:studio` opens Drizzle Studio if you want to browse the data.

---

## How failures behave

This is deliberate, and worth knowing:

- **Reads** fall back to in-memory data if Postgres is unreachable. The site
  keeps rendering with seeded content rather than showing an error page.
- **Writes never fall back.** A booking that cannot be written returns HTTP 503
  and a message telling the customer nothing was reserved and to phone instead.
  The submitted details are written to the server log so the enquiry is not
  lost entirely.

The alternative — quietly writing the booking to memory and returning success —
tells a customer their trip is reserved when no record exists anywhere. That is
worse than an honest error.

`/api/health` returns 503 with `"status":"degraded"` whenever the database is
configured but unreachable, so uptime monitoring catches it.

---

## Admin login is separate from this

Worth knowing before you pick a provider: **the admin panel does not
authenticate against the database.** `client/src/lib/store.tsx` calls
`supabase.auth.signInWithPassword`, and the server verifies the resulting
bearer token with `supabase.auth.getUser` (`server/routes.ts`, `requireAuth`).

Two consequences:

- The `admin_users` table and the `ADMIN_PASSWORD` seed are **not used for
  login**. They are left in place because the schema and seed reference them,
  but the account you actually log in with must exist in **Supabase Auth**.
- Without `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, the Supabase client
  is `null`, `login()` returns false immediately, and the login form reports
  "Invalid email or password" for every input — including the correct one.

So to read the bookings you have persisted, you also need Supabase Auth
configured, whichever Postgres you choose:

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

Then create your admin user in the Supabase dashboard under
**Authentication → Users → Add user**.

Using Supabase for both Postgres and Auth is the least moving parts, since the
code already expects it.
