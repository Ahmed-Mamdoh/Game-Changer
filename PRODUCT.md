# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Gamers who keep a log of what they play. They mark games as Playing, Played, Dropped or Wishlist, record hours and dates, write reviews, and come back to see their library and stats. Discovery (browse, free games, upcoming releases) serves this tracker: finding the next game to add.

## Product Purpose

Game Changer is a game tracker and discovery site. It brings a personal game library, IGDB game data, free-game alerts (GamerPower) and AI recommendations (Groq) into one place. Success: a user logs a game in seconds, finds their next game without leaving the site, and returns to check their library.

## Positioning

A tracker that also tells you what to play next: AI recommendations and a chat assistant read the user's own library, and free-to-keep games across Steam, Epic and GOG show up beside it.

## Operating Context

- Routes: home, `/games/allGames`, `/games/upcomingGames`, `/games/freeGames`, `/games/forYou`, `/game/:id`, `/auth`, `/account`.
- Data: IGDB through the `/api/igdbProvider` proxy, Supabase auth and `user_games` and reviews, GamerPower for free games, Groq for the chatbot and For You picks.
- Desktop and phone both matter.

## Capabilities and Constraints

- Library statuses, hours played, dates, reviews and ratings per game.
- Genre/theme/game-mode/date filters, search ranked by relevance, pagination.
- Now playing, Favorites and a taste strip (ratings spread, top genres) on the account page.
- Wishlist alerts when a wishlisted game becomes free.
- Stack: React 19, Vite, Tailwind v4 with DaisyUI, Radix/shadcn primitives, TanStack Query, deployed on Vercel.

## Brand Commitments

- Name: Game Changer.
- Purple is the brand color and must stay; other hues may support it.
- The game detail page keeps its idea of the game's art as a full background behind the game's details. The way it is built may change.

## Evidence on Hand

- Real game covers, artwork, screenshots and trailers from IGDB.
- No testimonials, user counts or press. Do not invent any.

## Product Principles

1. The games are the picture. Covers and art carry the look; the interface stays quiet around them.
2. Logging is the core action. It is always one press away from any game.
3. Show real data, never filler: real games, real counts, the user's own numbers.
4. Discovery leads back to the library.
