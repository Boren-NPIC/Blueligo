# BlueLingo — deploy-ready learning platform

## Setup Supabase

1. Create a Supabase project.
2. Open SQL Editor and run `supabase-setup.sql` once.
3. Enable Email and Google in Authentication → Providers.
4. Add `https://YOUR-DOMAIN/auth/callback` to Authentication → URL Configuration → Redirect URLs.

## Setup Cloudinary

Create an unsigned Upload Preset called `bluelingo_videos`. Restrict it to video files and set a maximum upload size.

## Environment variables

Copy `.env.example` to `.env.local` and replace every placeholder. Never expose `SUPABASE_SERVICE_ROLE_KEY` or `TELEGRAM_BOT_TOKEN` in browser code.

## Run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Admin dashboard: `/admin`.

## Deploy to Vercel

1. Upload this project to GitHub.
2. Import it in Vercel.
3. Add every variable from `.env.example` in Project Settings → Environment Variables.
4. Deploy.

Included: email registration, password login, Google OAuth, receipt upload, Telegram notification, student payment history, and Admin approve/reject.
