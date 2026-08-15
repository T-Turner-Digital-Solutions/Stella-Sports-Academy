# Stellar Sports Academy

Stellar Sports Academy is a nonprofit empowering young athletes through athletic training,
academic support, mentorship, leadership development, and life skills. We help youth build
confidence, discipline, and opportunity—on the field, in the classroom, and in life.

This repository is the organization's public website, built with Next.js.

## Status

This build covers the **public-facing marketing site** (all informational pages, the donation
flow, and every public form) plus an **admin review section** (`/admin`) for athlete
applications, volunteer sign-ups, sponsorship inquiries, and contact submissions. It does
**not** yet include a board portal, donor accounts, or content-management for the marketing
pages themselves — those remain out of scope. See
[What's Not Built Yet](#whats-not-built-yet) below.

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in real values — see below
npm run dev                  # http://localhost:3000
```

```bash
npm run build   # production build
npm run lint     # eslint
```

## Tech Stack

- **Next.js 16** (App Router, TypeScript, React 19)
- **Tailwind CSS v4** for styling, with the brand palette defined in `src/app/globals.css`
- **Zod** for form validation (client + server)
- **Stripe** for donation checkout (env-gated — see below)
- **Resend** for transactional email (env-gated — see below)
- **PostgreSQL** (via `pg`) for form-submission storage, **bcryptjs** + **jose** for admin auth
  (env-gated — see [Admin Section](#admin-section))
- **lucide-react** for icons, **Framer Motion** for the impact-counter animation

## Environment Variables

Copy `.env.example` to `.env.local` and fill in real values. Every integration is designed to
**fail gracefully and honestly** when not configured — the site never fakes success:

| Variable | Purpose | If unset |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata/SEO | Falls back to a placeholder domain |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `_PHONE` | Displayed in footer/contact | Hidden if empty |
| `NEXT_PUBLIC_SOCIAL_*` | Social links in footer | Hidden if empty |
| `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFY_EMAIL` | Sends form notification/confirmation emails | Forms still accept submissions; notifications are logged server-side only (see `src/lib/email.ts`) — **nothing is delivered anywhere until this is set** |
| `STRIPE_SECRET_KEY` | Powers `/donate` checkout | `/donate` shows "online giving isn't connected yet" instead of a fake success flow |
| `STRIPE_WEBHOOK_SECRET` | Verifies Stripe webhook signatures | Webhook endpoint returns 501 |

## Editing Content

The admin section (`/admin`) covers **reviewing form submissions**, not editing marketing copy.
Site content still lives in `src/content/*.ts` as plain, typed data — no numbers or testimonials
were invented to fill placeholders:

- `impact.ts` — impact statistics are `null` until real, verified figures are added
- `campaigns.ts` — fundraising totals are real ($0), goals are `null` until the org sets them
- `leadership.ts` — board member names/roles only; bios are intentionally blank pending approved copy
- `news.ts` — news posts and events start as empty arrays
- `transparency.ts` — public documents/meeting minutes start empty pending board approval

Edit these files directly and redeploy.

## Donations

`/donate` creates a Stripe Checkout session (one-time or monthly) via
`POST /api/donations/checkout`. Configure `STRIPE_SECRET_KEY` to activate it, and point a Stripe
webhook at `/api/donations/webhook` (set `STRIPE_WEBHOOK_SECRET`) to get donor/admin email
receipts on `checkout.session.completed`.

**Not yet persisted to a database** — donations are handled entirely by Stripe; there is no local
record of a gift beyond the email receipt. See [What's Not Built Yet](#whats-not-built-yet) below.

## Forms

Contact, Volunteer, Athlete Application, Corporate Sponsorship, and the newsletter signup all:

- Validate on the client and again on the server (Zod)
- Include a honeypot field for basic spam protection
- Send an admin notification + donor/applicant confirmation email via Resend (if configured)
- **Are persisted to a database** (Postgres, when `DATABASE_URL` is configured) and reviewable at
  `/admin` — see [Admin Section](#admin-section) below. If `DATABASE_URL` is not set, submissions
  still email out as before but nothing is stored.

Athlete application data is never displayed publicly anywhere on the site.

## Admin Section

`/admin` is a password-protected area for reviewing everything submitted through the public
forms: athlete applications, volunteer sign-ups, corporate sponsorship inquiries, and contact
messages. It is a single-admin-account system (no user management, roles, or self-serve signup) —
matching the scope of what was asked for.

### 1. Provision a Postgres database

Any Postgres 14+ database works (Neon, Supabase, Railway, RDS, etc.). Once you have a connection
string, run the schema once:

```bash
psql "$DATABASE_URL" -f src/lib/schema.sql
```

This creates the `pgcrypto` extension and four tables (`athlete_applications`,
`volunteer_applications`, `corporate_sponsorship_inquiries`, `contact_submissions`). It's safe to
re-run — every statement is idempotent.

### 2. Generate admin credentials

Generate a bcrypt hash for your admin password (never store the plain password):

```bash
node -e "require('bcryptjs').hash('yourpassword', 10).then(console.log)"
```

Generate a random session signing secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Set environment variables

```
DATABASE_URL=postgres://...
ADMIN_EMAIL=you@stellarsportsacademy.org
ADMIN_PASSWORD_HASH=<the bcrypt hash from step 2>
SESSION_SECRET=<the random secret from step 2>
```

**⚠️ If you put these in a literal `.env` / `.env.local` file**, every `$` in
`ADMIN_PASSWORD_HASH` (bcrypt hashes are full of them, e.g. `$2b$10$...`) **must be escaped as
`\$`**. Next.js's built-in `.env` loader does shell-style `$VAR` expansion on unquoted values, and
will silently corrupt an unescaped hash — you'll get 401s on every login attempt with no error
message. This does **not** apply to variables entered directly into Netlify's dashboard, only to
literal `.env`/`.env.local` files.

### 4. Sign in

Visit `/admin/login`. Without all three of `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` /
`SESSION_SECRET` set, login honestly returns a 501 explaining it isn't configured yet, rather than
pretending to work. Without `DATABASE_URL` set, the dashboard and list pages render an empty state
explaining the database isn't configured, rather than an error.

Sessions are signed JWTs in an `httpOnly` cookie, valid for 8 hours.

## What's Not Built Yet

The original spec for this project describes a full nonprofit operations platform. This build is
the public website plus form-submission review. Deliberately out of scope for this pass:

- **Donations table** — Stripe handles the charge and email receipt, but there's no local record
  of gifts (see [Donations](#donations) above)
- **Board portal** (`/board`) — meeting minutes, resolutions, document vault, compliance calendar
- **Donor/supporter accounts** — giving history, saved payment methods, receipt downloads
- **Content management** — marketing copy is still edited in `src/content/*.ts` and redeployed,
  not editable from `/admin`
- **PDF generation** for meeting minutes and documents
- **Audit logging**
- Real photography (all imagery is currently CSS/brand-mark based — no stock or placeholder
  photos were sourced, since none were provided as authentic organizational photography)

None of this was silently skipped — it requires infrastructure decisions (hosting for the board
portal, donor-account auth strategy) that should be made deliberately, not defaulted.

## Deployment (Netlify)

1. Connect this repository to Netlify (Next.js is auto-detected).
2. Add the environment variables from `.env.example` in Netlify's dashboard (Site settings →
   Environment variables), including the [Admin Section](#admin-section) variables if you want
   `/admin` active in production. Never commit real values to the repo.
3. Set `NEXT_PUBLIC_SITE_URL` to the real production URL once known.
4. Point the Stripe webhook at `https://<your-domain>/api/donations/webhook`.

## Brand Assets

The Stellar star mark was cropped from the organization's corporate record book cover
(`public/brand/stella-mark.png`), since no standalone transparent-background logo file was
available. Replace `public/brand/*.png` with official logo files when available.
