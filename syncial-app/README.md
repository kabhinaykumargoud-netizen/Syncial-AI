# Syncial 🚀

A modern **Social Media Management Dashboard** built with **Next.js 16**, **Tailwind CSS**, and **Supabase**.

![Syncial Dashboard](./public/preview.png)

## Features

- 🔐 **Authentication** — Email/password + Google OAuth via Supabase Auth
- 📋 **Dashboard** — Stats overview, recent posts, real-time updates
- ✍️ **Create Posts** — Multi-platform scheduling with datetime picker
- 📅 **Calendar View** — FullCalendar with platform-colored events
- 📊 **Analytics** — Recharts line + bar charts with per-platform metrics
- ⚙️ **Settings** — Profile management, connected accounts, preferences
- 📱 **Responsive** — Full mobile + desktop support with slide-out drawer nav

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 16 (App Router) | Framework |
| Tailwind CSS | Styling |
| Supabase | Auth + Database |
| FullCalendar | Calendar view |
| Recharts | Analytics charts |
| Lucide React | Icons |
| Sonner | Toast notifications |

## Quick Start

### 1. Clone & Install
```bash
cd syncial-app
npm install
```

### 2. Set Up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the contents of `supabase-schema.sql` → Run
3. Go to **Settings → API** → copy your **Project URL** and **anon key**

### 3. Configure Environment
```bash
cp .env.local.example .env.local
```
Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Enable Google OAuth (optional)
- Go to Supabase Dashboard → **Authentication → Providers → Google**
- Add your Google OAuth Client ID & Secret
- Add `http://localhost:3000/auth/callback` to allowed redirect URIs

### 5. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Protected pages (layout checks auth)
│   │   ├── dashboard/        # Overview with stats + recent posts
│   │   ├── posts/            # Posts grid + filters
│   │   ├── posts/create/     # Create/schedule new post
│   │   ├── calendar/         # FullCalendar view
│   │   ├── analytics/        # Recharts engagement metrics
│   │   └── settings/         # Profile + connected accounts
│   ├── auth/callback/        # OAuth redirect handler
│   ├── login/                # Login page
│   └── signup/               # Signup page
├── components/
│   ├── ui/                   # Sidebar, LoadingSpinner, ErrorMessage
│   └── dashboard/            # PostCard, StatsCard, PlatformFilter
├── lib/supabase/             # Browser + server Supabase clients
├── types/                    # TypeScript interfaces
└── proxy.ts                  # Next.js 16 route protection
```

## Database Schema

Run `supabase-schema.sql` in your Supabase SQL Editor. Creates:
- `posts` — scheduled/published posts with platform array
- `analytics` — likes, comments, shares, impressions per post
- `connected_accounts` — social profile connections
- All tables have **Row Level Security** (users only see their own data)
- `posts` table enrolled in **Supabase Realtime**

## Deployment (Vercel)

```bash
npm run build   # verify locally first
```
1. Push to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Add your Vercel domain to Supabase Auth → URL Configuration
