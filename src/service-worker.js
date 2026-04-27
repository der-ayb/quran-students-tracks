importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js"
);

workbox.setConfig({ debug: false });
// Force waiting service worker to become active
self.skipWaiting();
workbox.core.clientsClaim();

// Precache critical files with revisions (update revisions when files change)
workbox.precaching.precacheAndRoute(
  [
    { url: "./", revision: "1" },
    { url: "./favicon.ico", revision: "1" },
    { url: "./index.html", revision: "2" },
    { url: "./app.html", revision: "48" },
    { url: "./manifest.json", revision: "3" },
    { url: "./install.js", revision: "2" },

    { url: "./src/style.css", revision: "16" },
    { url: "./src/fonts.css", revision: "2" },
    { url: "./src/script.js", revision: "89" },
    { url: "./src/auth.js", revision: "2" },
    { url: "./src/flatpickr-hijri-calendar.js", revision: "3" },
    { url: "./src/pdfmake.js", revision: "1" },
    { url: "./src/vfs_fonts.js", revision: "1" },
    { url: "./src/yearpicker.css", revision: "1" },
    { url: "./src/yearpicker.js", revision: "1" },

    { url: "./assets/default.sqlite3", revision: "2" },
    { url: "./assets/quran.sqlite", revision: "4" },

    {
      url: "./assets/fonts/changa/2-cm9JNi2YuVOUckY5y-au8.woff2",
      revision: "1",
    },
    {
      url: "./assets/fonts/markazi/syk0-ydym6AtQaiEtX7yhqbVpHWVF1E.woff2",
      revision: "1",
    },
    {
      url: "./assets/fonts/noto-sans/nwpCtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlj4wv4r4xA.woff2",
      revision: "1",
    },
    {
      url: "./assets/fonts/raedex/SLXYc1bJ7HE5YDoGPuzj_dh8uc7wUy8ZQQyX2Iw1ZEzMhQ.woff2",
      revision: "1",
    },
    {
      url: "./assets/fonts/rubik/iJWKBXyIfDnIV7nErXyi0A.woff2",
      revision: "1",
    },
    {
      url: "./assets/fonts/UthmanicWarshV21East.ttf",
      revision: "1",
    },

    {
      url: "./assets/images/manifest-icon-192.maskable.png",
      revision: "1",
    },
    {
      url: "./assets/images/manifest-icon-512.maskable.png",
      revision: "1",
    },
    { url: "./assets/images/apple-icon-180.png", revision: "1" },

    // bootstrap
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.8/spacelab/bootstrap.rtl.min.css",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.8/cerulean/bootstrap.rtl.min.css",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.8/yeti/bootstrap.rtl.min.css",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.8/flatly/bootstrap.rtl.min.css",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.8/slate/bootstrap.rtl.min.css",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.8/solar/bootstrap.rtl.min.css",
      revision: "1",
    },
    // other CDNs
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css",
      revision: "1",
    },
    {
      url: "https://www.gstatic.com/firebasejs/ui/6.0.2/firebase-ui-auth.css",
      revision: "1",
    },
    {
      url: "https://cdn.datatables.net/2.3.4/css/dataTables.dataTables.css",
      revision: "1",
    },
    {
      url: "https://cdn.datatables.net/2.3.4/css/dataTables.bootstrap5.css",
      revision: "1",
    },
    {
      url: "https://cdn.datatables.net/select/3.1.3/js/dataTables.select.min.js",
      revision: "1",
    },
    {
      url: "https://cdn.datatables.net/select/3.1.3/js/select.bootstrap5.min.js",
      revision: "1",
    },
    {
      url: "https://cdn.datatables.net/select/3.1.3/css/select.bootstrap5.min.css",
      revision: "1",
    },
    {
      url: "https://cdn.datatables.net/buttons/3.2.5/css/buttons.bootstrap5.css",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.css",
      revision: "1",
    },
    {
      url: "https://cdn.jsdelivr.net/npm/flatpickr-hijri-calendar@1.0.0/dist/flatpickr-hijri-calendar.min.css",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/js/bootstrap.bundle.min.js",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.js",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.wasm",
      revision: "1",
    },
    {
      url: "https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js",
      revision: "1",
    },
    {
      url: "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth-compat.js",
      revision: "1",
    },
    {
      url: "https://www.gstatic.com/firebasejs/ui/6.0.2/firebase-ui-auth.js",
      revision: "1",
    },
    {
      url: "https://cdn.datatables.net/2.3.4/js/dataTables.js",
      revision: "1",
    },
    {
      url: "https://cdn.datatables.net/2.3.4/js/dataTables.bootstrap5.js",
      revision: "1",
    },
    {
      url: "https://cdn.datatables.net/buttons/3.2.5/js/dataTables.buttons.js",
      revision: "1",
    },
    {
      url: "https://cdn.datatables.net/buttons/3.2.5/js/buttons.bootstrap5.js",
      revision: "1",
    },
    {
      url: "https://cdn.datatables.net/buttons/3.2.5/js/buttons.html5.js",
      revision: "1",
    },
    {
      url: "https://cdn.datatables.net/buttons/3.2.5/js/buttons.print.js",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/locale/ar-dz.min.js",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.js",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/l10n/ar-dz.min.js",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/luxon/3.7.2/luxon.min.js",
      revision: "1",
    },
    {
      url: "https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js",
      revision: "1",
    },
  ],
  {
    // Ignore URL parameters to prevent duplicate caching
    ignoreURLParametersMatching: [/.*/],
  }
);

// Cache-first for precached local and CDN files
workbox.routing.registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://cdnjs.cloudflare.com" ||
    url.origin === "https://www.gstatic.com" ||
    url.origin === "https://cdn.datatables.net" ||
    url.origin === "https://cdn.jsdelivr.net",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "core-cache",
  })
);

// Serve Cached Resources
workbox.routing.registerRoute(
  ({ url }) => url.origin === self.location.origin,
  new workbox.strategies.CacheFirst({
    cacheName: "static-cache",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache static resources for 7 days
      }),
    ],
  })
);

// Serve HTML pages with Network First and offline fallback
workbox.routing.registerRoute(
  ({ request }) => request.mode === "navigate",
  async ({ event }) => {
    try {
      const response = await workbox.strategies
        .networkFirst({
          cacheName: "pages-cache",
          plugins: [
            new workbox.expiration.ExpirationPlugin({
              maxEntries: 50,
            }),
          ],
        })
        .handle({ event });
      return response || (await caches.match("./index.html"));
    } catch (error) {
      return await caches.match("./index.html");
    }
  }
);

// Clean up old/unused caches during activation
self.addEventListener("activate", (event) => {
  const currentCaches = [
    workbox.core.cacheNames.precache,
    "core-cache",
    "pages-cache",
    "static-cache",
  ];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
