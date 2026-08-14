-- Stella Sports Academy — admin review database schema.
-- Run this once against your Postgres database (see README "Admin Section"
-- for setup). Safe to re-run — every statement is idempotent.

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
