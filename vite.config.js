import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import sitemapPlugin from "vite-plugin-sitemap";
import { VitePWA } from "vite-plugin-pwa";

const BRAND_BACKGROUND = "#0c0b10";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemapPlugin({ hostname: "https://game-changer-gg.vercel.app" }),
    VitePWA({
      // A new build takes over on the next visit; nothing to confirm
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        id: "/",
        name: "Game Changer",
        short_name: "Game Changer",
        description:
          "Discover, track and get recommendations for games, with the reason behind every pick.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "any",
        theme_color: BRAND_BACKGROUND,
        background_color: BRAND_BACKGROUND,
        categories: ["games", "entertainment"],
        icons: [
          { src: "/pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          { name: "Browse", url: "/games/allGames" },
          { name: "For you", url: "/games/forYou" },
          { name: "Your library", url: "/account" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        // The main bundle is large; keep it in the offline shell
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: "/index.html",
        // Proxies and SEO files are real server responses, never the shell
        navigateFallbackDenylist: [
          /^\/api\//,
          /^\/sitemap\.xml$/,
          /^\/robots\.txt$/,
        ],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === "https://fonts.googleapis.com" ||
              url.origin === "https://fonts.gstatic.com",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 20 },
            },
          },
          {
            urlPattern: ({ url }) => url.origin === "https://images.igdb.com",
            handler: "CacheFirst",
            options: {
              cacheName: "igdb-images",
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  // Local dev has no serverless functions; send /api to the deployed proxies
  server: {
    proxy: {
      "/api": {
        target: "https://game-changer-gg.vercel.app",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
