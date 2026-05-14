CREATE TABLE IF NOT EXISTS "projects" (
  "id" serial PRIMARY KEY NOT NULL,
  "year" text DEFAULT '' NOT NULL,
  "title_ar" text NOT NULL,
  "title_en" text NOT NULL,
  "desc_ar" text DEFAULT '' NOT NULL,
  "desc_en" text DEFAULT '' NOT NULL,
  "field" text DEFAULT '' NOT NULL,
  "media" text DEFAULT '[]' NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL
);
