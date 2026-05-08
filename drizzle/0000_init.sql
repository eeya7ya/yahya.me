CREATE TABLE IF NOT EXISTS "roadmap" (
  "id" serial PRIMARY KEY NOT NULL,
  "year" text NOT NULL,
  "title_ar" text NOT NULL,
  "title_en" text NOT NULL,
  "desc_ar" text NOT NULL,
  "desc_en" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS "achievements" (
  "id" serial PRIMARY KEY NOT NULL,
  "year" text NOT NULL,
  "title_ar" text NOT NULL,
  "title_en" text NOT NULL,
  "desc_ar" text NOT NULL,
  "desc_en" text NOT NULL,
  "icon" text DEFAULT 'spark' NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL
);
