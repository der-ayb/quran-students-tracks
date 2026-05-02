import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      devOptions: {
        enabled: true, // Enable SW in development
        type: "module",
      },
      strategies: "generateSW",
      injectRegister: false,
      registerType: "prompt",
      includeAssets: [
        "favicon.ico",
        "manifest.json",
        "default.sqlite3",
        "quran.sqlite",
        "fonts/**/*.{ttf,woff,woff2,otf}",
        "images/*"
      ],
      workbox: {
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 3000000,
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === "https://fonts.googleapis.com" ||
              url.origin === "https://cdnjs.cloudflare.com" ||
              url.origin === "https://cdn.datatables.net" ||
              url.origin === "https://cdn.jsdelivr.net",
            handler: "CacheFirst",
            options: {
              cacheName: "core-cache-first",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ url }) => url.origin.includes(".gstatic.com"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "core-cache-stale-while-revalidate",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
