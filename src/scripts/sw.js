// sw.js

importScripts('/Workbox/workbox-sw.js');

if (workbox) {
  console.log('Workbox is loaded (self-hosted)');

  // Precache essential assets
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: null },
    { url: '/index.html', revision: null },
    { url: '/styles.css', revision: null },
    { url: '/app.bundle.js', revision: null },
    { url: '/Images/favicon.png', revision: null },
    { url: '/manifest.json', revision: null }
  ]);

    // ✅ Runtime caching for everything under /src/
  workbox.routing.registerRoute(
    // Match any request that starts with /src/
    ({ url }) => {url.pathname.startsWith('/src/'); console.log('[SW] Caching:', url.href);},
    // Use a Network First strategy
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50, // Limit to 50 entries
          maxAgeSeconds: 7 * 24 * 60 * 60 // 1 week
        })
      ]
    })
  );

} else {
  console.error('Workbox failed to load');
}
