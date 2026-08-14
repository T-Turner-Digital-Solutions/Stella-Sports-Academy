# Stella Sports Academy

Stella Sports Academy is a nonprofit empowering young athletes through athletic training,
academic support, mentorship, leadership development, and life skills. We help youth build
confidence, discipline, and opportunity—on the field, in the classroom, and in life.

This repository is the organization's public website, built with Next.js.

## Status: Phase 1 (Public Website)

This build covers the **public-facing marketing site**: all informational pages, the donation
flow (Stripe-ready), the athlete application, and volunteer/sponsorship/contact forms. It does
**not** yet include a database, admin dashboard, or board portal — those are Phase 2. See
[What's Not Built Yet](#whats-not-built-yet-phase-2) below.

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

Because there's no admin dashboard yet, all editable content lives in `src/content/*.ts` as
plain, typed data — no numbers or testimonials were invented to fill placeholders:

- `impact.ts` — impact statistics are `null` until real, verified figures are added
- `campaigns.ts` — fundraising totals are real ($0), goals are `null` until the org sets them
- `leadership.ts` — board member names/roles only; bios are intentionally blank pending approved copy
- `news.ts` — news posts and events start as empty arrays
- `transparency.ts` — public documents/meeting minutes start empty pending board approval

Edit these files directly and redeploy, or migrate them into a database in Phase 2.

## Donations

`/donate` creates a Stripe Checkout session (one-time or monthly) via
`POST /api/donations/checkout`. Configure `STRIPE_SECRET_KEY` to activate it, and point a Stripe
webhook at `/api/donations/webhook` (set `STRIPE_WEBHOOK_SECRET`) to get donor/admin email
receipts on `checkout.session.completed`.

**Not yet persisted to a database** — see Phase 2 below.

## Forms

Contact, Volunteer, Athlete Application, Corporate Sponsorship, and the newsletter signup all:

- Validate on the client and again on the server (Zod)
- Include a honeypot field for basic spam protection
- Send an admin notification + donor/applicant confirmation email via Resend (if configured)
- Are **not persisted to a database** — see Phase 2 below

Athlete application data is never displayed publicly anywhere on the site.

## What's Not Built Yet (Phase 2)

The original spec for this project describes a full nonprofit operations platform. This Phase 1
build is the public website only. Deliberately out of scope for this pass:

- **Database** — no persistent storage yet; forms relay via email only (see above)
- **Admin dashboard** (`/admin`) — managing content, donations, applications, campaigns
- **Board portal** (`/board`) — meeting minutes, resolutions, document vault, compliance calendar
- **Donor/supporter accounts** — giving history, saved payment methods, receipt downloads
- **PDF generation** for meeting minutes and documents
- **Audit logging**
- Real photography (all imagery is currently CSS/brand-mark based — no stock or placeholder
  photos were sourced, since none were provided as authentic organizational photography)

None of this was silently skipped — it requires infrastructure decisions (database provider,
hosting for the admin/board portals, auth strategy) that should be made deliberately, not
defaulted.

## Deployment (Netlify)

1. Connect this repository to Netlify (Next.js is auto-detected).
2. Add the environment variables from `.env.example` in Netlify's dashboard (Site settings →
   Environment variables). Never commit real values to the repo.
3. Set `NEXT_PUBLIC_SITE_URL` to the real production URL once known.
4. Point the Stripe webhook at `https://<your-domain>/api/donations/webhook`.

## Brand Assets

The Stella star mark was cropped from the organization's corporate record book cover
(`public/brand/stella-mark.png`), since no standalone transparent-background logo file was
available. Replace `public/brand/*.png` with official logo files when available.
