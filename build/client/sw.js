const CACHE_VERSION = 'v1.0.0'
const RUNTIME = `ala-runtime-${CACHE_VERSION}`
const PRECACHE = `ala-precache-${CACHE_VERSION}`
const PRECACHE_URLS = [
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/images/Before.mp4',
  '/images/After.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => ![RUNTIME, PRECACHE].includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)

  // Only handle same-origin
  if (url.origin !== self.location.origin) return

  // Navigation requests: network first, fall back to offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(async () => (await caches.open(PRECACHE)).match('/offline.html')),
    )
    return
  }

  // Images: cache-first
  if (req.destination === 'image') {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req)
            .then((res) => {
              const copy = res.clone()
              caches.open(RUNTIME).then((cache) => cache.put(req, copy))
              return res
            })
            .catch(() => caches.match('/images/hero-after.svg')),
      ),
    )
    return
  }

  // CSS/JS: stale-while-revalidate
  if (req.destination === 'style' || req.destination === 'script' || req.destination === 'font') {
    event.respondWith(
      caches.open(RUNTIME).then(async (cache) => {
        const cached = await cache.match(req)
        const network = fetch(req)
          .then((res) => {
            cache.put(req, res.clone())
            return res
          })
          .catch(() => cached)
        return cached || network
      }),
    )
    return
  }
})
