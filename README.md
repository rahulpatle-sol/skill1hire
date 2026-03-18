# Skill1 Hire Frontend 🚀

Next.js 15 · GSAP · Lenis · Sonner · Dark Enterprise UI

## Setup

```bash
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
npm run dev
# → http://localhost:3000
```

## Backend Login Fix

Copy files from `/BACKEND_FIXES/` to your backend:
- `generateToken.js` → `src/utils/`
- `passport.js` → `src/config/`
- `auth.controller.js` → `src/controllers/auth/`

**Root cause:** JWT_SECRET env var mismatch between token signing and verification.

## Pages

| Route | Page |
|-------|------|
| `/` | Landing (GSAP + Lenis + Unsplash) |
| `/login` | Login |
| `/register` | Register (role selector) |
| `/forgot-password` | Password reset |
| `/candidate/dashboard` | Candidate home |
| `/candidate/profile` | Edit profile + capstone |
| `/candidate/assessments` | Take MCQ tests |
| `/candidate/scorecard` | Skill scores |
| `/candidate/jobs` | Job feed (verified only) |
| `/candidate/applications` | Application tracker |
| `/hr/dashboard` | HR home |
| `/hr/post-job` | Post new job |
| `/hr/jobs` | Manage jobs |
| `/hr/jobs/[id]/applications` | Review applicants |
| `/mentor/dashboard` | Mentor home |
| `/mentor/sessions` | Session management |
| `/admin/dashboard` | Platform stats |
| `/admin/users` | User management |
| `/admin/verify` | Verification queue |
| `/admin/domains` | Domain + skill creation |
| `/admin/assessments` | Test creation |

## Tech
- **Next.js 15** — App Router, Turbopack
- **GSAP 3** — Hero animations, scroll reveals, parallax
- **Lenis** — Smooth scrolling
- **Sonner** — Toast notifications
- **Tailwind CSS** — Utility styling
- **Unsplash** — Free high-quality images

## Deploy
Frontend → Vercel
Backend → Render
