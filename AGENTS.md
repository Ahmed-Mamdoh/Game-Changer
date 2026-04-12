# Agent Guide: Game Changer

## 🚀 Critical Commands
- `npm run dev`: Vite dev server (port 5173)
- `npm run build`: Vercel production build
- `npm run lint`: ESLint (required pre-commit)

## 🔑 Environment Setup
- **Required `.env`:** `CLIENT_ID`, `ACCESS_TOKEN` (IGDB), `VITE_SUPABASE_KEY`
- **Never commit real API keys** - use placeholders in version control

## 🌐 API Architecture
- **IGDB Proxy Mandatory:** ALL IGDB calls MUST use `/api/igdbProvider` (POST) - direct calls fail
- **Proxy:** `api/igdbProvider.js` handles IGDB auth
- **Frontend API:** `src/api/igdbApi.js` for all IGDB queries
- **Supabase:** `src/api/supabase.js` for auth/database

## 🎨 Styling System
- **Tailwind v4:** Theme defined in `src/index.css` using `@theme` directive
- **DaisyUI:** Configured via `@plugin "daisyui"` with custom dark theme in `src/index.css`
- **Custom Colors:** Obsidian Pulse design system with custom CSS variables in `@theme`
- **UI Components:** `src/ui/` for custom/shadcn-ui components
- **Fonts:** Space Grotesk (headings), Manrope (body) via CSS variables

## 🏗️ Key Architecture
- `api/`: Vercel serverless functions
- `src/features/`: Feature modules (auth, games, user)
- `src/pages/`: React Router routes
- `src/hooks/`: TanStack Query hooks

## ⚠️ Critical Gotchas
- **CORS:** Never call IGDB directly from browser - always use proxy
- **Image URLs:** Prepend `https://images.igdb.com/igdb/image/upload/t_cover_big/` to IGDB image paths
- **Auth:** Supabase auto-handles state via `onAuthStateChange()`
- **Routes:** Defined in `src/App.jsx`

## 📁 Essential References
- `guide.md`: Design system and asset placeholders
- `src/constants/constant.js`: Shared constants
- `vercel.json`: Deployment config
