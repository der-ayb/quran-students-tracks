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
        "favicon.svg",
        "favicon-96x96.png",
        "apple-touch-icon.png",
        // "manifest.json",
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
      manifest: {
        name: "تطبيق متابعة الحفظ",
        short_name: "متابعة",
        description: "تطبيق متابعة التلاميذ في حفظ القرآن الكريم",
        lang: "ar",
        display_override: ["window-controls-overlay"],
        orientation: "portrait",
        categories: ["education", "productivity"],
        theme_color: "#00684a",
        background_color: "#05b690",
        display: "standalone",
        shortcuts: [
          {
            name: "Today's agenda",
            short_name: "Agenda",
            description: "View your agenda for today",
            url: "/today",
            icons: [
              {
                src: "/images/web-app-manifest-192x192.png",
                sizes: "192x192",
              },
            ],
          },
        ],
        screenshots: [
          {
            src: "/images/screenshot1.png",
            sizes: "697x495",
            type: "image/png",
          },
          {
            src: "/images/screenshot2.png",
            sizes: "697x495",
            type: "image/png",
          },
          {
            src: "/images/screenshot3.png",
            sizes: "697x495",
            type: "image/png",
          },
          {
            src: "/images/screenshot4.png",
            sizes: "697x495",
            type: "image/png",
          },
        ],
        icons: [
          {
            src: "/images/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/images/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/images/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/images/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
    }),
  ],
});
