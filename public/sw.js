const CACHE_NAME = 'russian-4kyu-training-v1'
const BASE_PATH = '/russian-4kyu-training/'
const APP_SHELL = [
  BASE_PATH,
  BASE_PATH + 'manifest.webmanifest',
  BASE_PATH + 'icon.svg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const requestURL = new URL(event.request.url)
  if (requestURL.origin !== self.location.origin || !requestURL.pathname.startsWith(BASE_PATH)) return

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => cachedResponse || fetch(event.request).then((response) => {
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone))
        }
        return response
      }))
      .catch(() => caches.match(BASE_PATH)),
  )
})
