import { defineConfig } from "@vite-pwa/assets-generator/config";

// Regenerate the app icons with: npx pwa-assets-generator
// It writes them next to the source in pwa/; move them into public/ and
// rename apple-touch-icon-180x180.png to apple-touch-icon.png.
// The source already has its own background and safe-zone padding.
const background = "#0c0b10";

export default defineConfig({
  headLinkOptions: { preset: "2023" },
  preset: {
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[48, "favicon.ico"]],
      padding: 0,
      resizeOptions: { background },
    },
    maskable: { sizes: [512], padding: 0, resizeOptions: { background } },
    apple: { sizes: [180], padding: 0, resizeOptions: { background } },
  },
  images: ["pwa/icon-source.svg"],
});
