# yahya.me

Interactive CV for Yahya Khaled — Electrical Power Engineer.

## Stack

- **Next.js 15** (App Router, RSC) + **React 19**
- **Tailwind CSS v4** (CSS-first theme tokens)
- **framer-motion** for the slide-deck transitions
- **Neon serverless Postgres** + **Drizzle ORM** (CV content)
- **Cloudflare R2** for media (photo URL is env-configurable)
- Deployed on **Vercel**

## Layout

A controlled slide deck — one page at a time, no free scroll. Navigate with mouse wheel, arrow keys, swipe, or the side rail.

1. Hero — name + tagline (left), photo with frosted veil (right)
2. About
3. Roadmap (timeline from Neon)
4. Achievements (cards from Neon)
5. Contact

UI defaults to Arabic (RTL). The circular toggle in the top corner switches to English (LTR).

## Local development

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL and (optionally) NEXT_PUBLIC_PHOTO_URL
npm run dev
```

The site renders with a built-in seed dataset if `DATABASE_URL` is missing or unreachable, so you can develop the UI without a database.

## Database

Schema lives in `lib/schema.ts`. Two tables: `roadmap` and `achievements`, both with `_ar` / `_en` columns for bilingual content.

```bash
# generate / apply schema
npm run db:push

# seed with the data from lib/seed-data.ts
npm run db:seed
```

Or apply `drizzle/0000_init.sql` directly in the Neon SQL editor.

## Deployment

### Vercel
1. Import the repo into Vercel.
2. Add environment variables:
   - `DATABASE_URL` — Neon **pooled** connection string
   - `NEXT_PUBLIC_PHOTO_URL` — public URL of your photo (R2 or any HTTPS URL)
3. Deploy.

### Cloudflare R2 (photo hosting)
1. Create an R2 bucket and upload your photo.
2. Either enable the bucket's public `r2.dev` URL or attach a custom domain.
3. Set `NEXT_PUBLIC_PHOTO_URL` in Vercel to that URL — no redeploy needed if you redeploy the latest build.

The default fallback photo is the GitHub raw URL of the file in this repo.

## Editing content

The fastest way is the **admin panel** at `/admin`:

1. Set `ADMIN_PASSWORD` (and ideally `ADMIN_SECRET`) in your env.
2. Visit `/admin/login`, enter the password.
3. Edit Hero / About / Roadmap / Achievements / Contact / Photo URL — changes
   are written to Neon and the public pages are revalidated automatically.

Everything also has a code fallback if the DB is unavailable:

- **Hero / nav / UI strings (defaults)** — `lib/i18n.ts`
- **Static fallback CV data** — `lib/seed-data.ts`
- **Color palette** — `app/globals.css` (`@theme` block)

## Routes

- `/` — interactive slide deck (default landing experience)
- `/about`, `/roadmap`, `/achievements`, `/contact` — same content as the
  matching slide, opened as a full standalone page (linkable / shareable)
- `/admin/login`, `/admin` — password-protected editor
