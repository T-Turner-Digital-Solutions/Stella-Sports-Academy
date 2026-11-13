-- Stellar Sports Academy — admin review database schema.
-- Run this once against your Postgres database (see README "Admin Section"
-- for setup). Safe to re-run — every statement is idempotent.
--
-- Kept in sync by hand with src/lib/schema.ts, which exports this same SQL
-- as a string for POST /api/admin/db-setup (an in-app alternative to running
-- this file with psql — useful when nobody has direct database access).

-- Needed for gen_random_uuid() below. Postgres 13+ ships this built in via
-- this extension; managed providers (Neon, Supabase, RDS) all support it.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS athlete_applications (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  status              TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'archived')),
  reviewed_at         TIMESTAMPTZ,

  athlete_first_name  TEXT NOT NULL,
  athlete_last_name   TEXT NOT NULL,
  date_of_birth       DATE NOT NULL,
  school              TEXT NOT NULL,
  grade               TEXT NOT NULL,
  sport               TEXT NOT NULL,
  position            TEXT,
  current_team        TEXT,

  parent_name         TEXT NOT NULL,
  parent_email        TEXT NOT NULL,
  parent_phone        TEXT NOT NULL,

  program_interest    TEXT[] NOT NULL DEFAULT '{}',
  financial_assistance BOOLEAN NOT NULL DEFAULT false,
  additional_info     TEXT
);

CREATE TABLE IF NOT EXISTS volunteer_applications (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  status              TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'archived')),
  reviewed_at         TIMESTAMPTZ,

  name                TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT NOT NULL,
  area_of_interest    TEXT NOT NULL,
  experience          TEXT,
  availability        TEXT NOT NULL,
  message             TEXT
);

CREATE TABLE IF NOT EXISTS corporate_sponsorship_inquiries (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  status              TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'archived')),
  reviewed_at         TIMESTAMPTZ,

  company_name        TEXT NOT NULL,
  contact_name        TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT,
  interested_tier     TEXT,
  message              TEXT
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  status              TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'archived')),
  reviewed_at         TIMESTAMPTZ,

  name                TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT,
  inquiry_type        TEXT NOT NULL,
  message             TEXT NOT NULL
);

-- Board member / admin accounts. The first account is bootstrapped from the
-- ADMIN_EMAIL / ADMIN_PASSWORD_HASH env vars the first time someone signs in
-- (see README "Admin Section") — every account after that is created by an
-- "owner" sending an invite from /admin/team, which emails a one-time link
-- for the invitee to set their own password.
CREATE TABLE IF NOT EXISTS admin_users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  email               TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  role                TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  password_hash       TEXT,
  invite_token        TEXT UNIQUE,
  invite_expires_at   TIMESTAMPTZ,
  active              BOOLEAN NOT NULL DEFAULT true,
  last_login_at       TIMESTAMPTZ
);

-- Board meetings and events. Any signed-in board member/admin account can
-- add or remove one — this is a scheduling convenience, not an
-- access-control surface, so it deliberately doesn't gate by role the way
-- account management (admin_users) does. zoom_url is optional so this can
-- also hold in-person events (e.g. a gala) that have no call link.
CREATE TABLE IF NOT EXISTS board_meetings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by          UUID REFERENCES admin_users(id) ON DELETE SET NULL,

  title               TEXT NOT NULL,
  scheduled_at        TIMESTAMPTZ NOT NULL,
  zoom_url            TEXT,
  notes               TEXT
);

-- zoom_url was originally NOT NULL — relax it for existing databases too.
ALTER TABLE board_meetings ALTER COLUMN zoom_url DROP NOT NULL;

-- One row per completed Stripe Checkout session (one-time or the first
-- payment of a recurring gift). Donor-level detail here is admin-only —
-- never displayed publicly — matching the privacy commitments on /privacy
-- and the campaign pages.
CREATE TABLE IF NOT EXISTS donations (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  stripe_session_id         TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id  TEXT,

  donor_name                TEXT NOT NULL,
  donor_email               TEXT,
  amount_cents              INTEGER NOT NULL,
  currency                  TEXT NOT NULL DEFAULT 'usd',
  frequency                 TEXT NOT NULL CHECK (frequency IN ('one-time', 'monthly')),
  designation               TEXT NOT NULL,
  anonymous                 BOOLEAN NOT NULL DEFAULT false,
  receipt_emailed_at        TIMESTAMPTZ
);
