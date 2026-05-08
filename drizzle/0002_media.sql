ALTER TABLE "achievements" ADD COLUMN IF NOT EXISTS "image_url" text NOT NULL DEFAULT '';
ALTER TABLE "achievements" ADD COLUMN IF NOT EXISTS "video_url" text NOT NULL DEFAULT '';
