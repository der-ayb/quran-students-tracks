import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        codeSplitting: {
          minSize: 20000,
          groups: [
            {
              name: "node_modules",
              test: /node_modules/,
            },
            {
              name: "pdfmake",
              test: /pdfmake/,
            },
            {
              name: "vfs_fonts",
              test: /vfs/,
            }
          ],
        },
      },
    },
  },
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
        "default.sqlite3",
        "quran.sqlite",
        "sql-wasm-browser.wasm",
        "fonts/**/*.{ttf,woff,woff2,otf}",
        "images/*",
      ],
      workbox: {
        cleanupOutdatedCaches: true,
        additionalManifestEntries: [
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.8/cerulean/bootstrap.rtl.min.css",
            revision: null,
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.8/yeti/bootstrap.rtl.min.css",
            revision: null,
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.8/flatly/bootstrap.rtl.min.css",
            revision: null,
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.8/slate/bootstrap.rtl.min.css",
            revision: null,
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.8/solar/bootstrap.rtl.min.css",
            revision: null,
          },
          // other CDNs
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css",
            revision: null,
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/js/bootstrap.bundle.min.js",
            revision: null,
          },
        ],
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === "https://fonts.gstatic.com" ||
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
