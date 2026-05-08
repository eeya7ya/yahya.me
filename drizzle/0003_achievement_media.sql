ALTER TABLE "achievements" ADD COLUMN IF NOT EXISTS "media" text NOT NULL DEFAULT '[]';
