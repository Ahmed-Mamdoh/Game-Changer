# Agent Guide: Game Changer

## 🚀 Critical Commands
- `npm run dev`: Vite dev server (port 5173)
- `npm run build`: Vercel production build
- `npm run lint`: ESLint (required pre-commit)
- `npm run preview`: Preview production build locally

## 🔑 Environment Setup
- **Required `.env`:** 
  - `CLIENT_ID`: IGDB API Client ID
  - `ACCESS_TOKEN`: IGDB API Access Token
  - `VITE_SUPABASE_URL`: Supabase project URL
  - `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase anon/public key
- **Never commit real API keys** - use placeholders in version control

## 🛠️ Integrated Skills & Standards

### 🗄️ Supabase & Database
- **Skill:** `supabase`, `supabase-postgres-best-practices`
- **Implementation:** `src/api/supabase.js`
- **Usage:** Handles all user authentication and persistence for `user_games` and reviews.
- **Rule:** Use RLS (Row Level Security) on all tables; never bypass auth in client-side queries.

### 🌐 API Architecture
- **Skill:** `api-and-interface-design`
- **IGDB Proxy Mandatory:** ALL IGDB calls MUST use `/api/igdbProvider` (POST). Direct browser calls to IGDB will fail due to CORS.
- **Proxy:** `api/igdbProvider.js` (Vercel Serverless) handles server-side auth.
- **Frontend API:** `src/api/igdbApi.js` centralizes all IGDB query logic.
- **Data Fetching:** Use TanStack Query hooks in `src/hooks/` for caching and state management.

### 🎨 Styling System
- **Skill:** `frontend-ui-engineering`
- **Tailwind v4:** Theme defined in `src/index.css` using the `@theme` directive.
- **DaisyUI:** Configured via `@plugin "daisyui"` with custom dark theme.
- **Design System:** "Obsidian Pulse" - use custom CSS variables (e.g., `--color-pulse-primary`) defined in `src/index.css`.
- **UI Components:** `src/components/ui/` contains Shadcn-like primitives. Use these instead of raw HTML.
- **Fonts:** Space Grotesk (headings), Manrope (body).

## 🏗️ Key Architecture
- `api/`: Vercel serverless functions (backend-as-a-service)
- `src/features/`: Feature-based modules (Auth, ChatBot, User, Games)
- `src/hooks/`: Custom TanStack Query hooks for data fetching
- `src/pages/`: React Router page components
- `src/utils/`: Shared utility functions (image helpers, recommenders)

## ⚠️ Critical Gotchas
- **CORS:** IGDB direct calls = ❌. Proxy calls = ✅.
- **Image URLs:** Use `src/utils/igdbImage.js` or prepend `https://images.igdb.com/igdb/image/upload/t_cover_big/`.
- **Auth State:** Supabase state is managed globally; use `useUserToken` hook or `onAuthStateChange`.
- **Routes:** Centralized in `src/App.jsx`. Always check for protected routes.

## 📁 Essential References
- `guide.md`: Design system details and asset placeholders.
- `src/constants/constant.js`: Shared constants (Pagination limits, etc.).
- `vercel.json`: Deployment and routing configuration.
- `skills-lock.json`: Agent skill dependencies.
