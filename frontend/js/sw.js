// Install a service worker and save the response from /api/vi/ in the users cache.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('vi-store').then((cache) => {
            return cache.add('/api/vi/')
        })
    )
})

// Check if we've already saved a response for the outgoing request.
self.addEventListener('fetch', (event) => {
    console.log('Attempting to use cache for: ' + event.request.url)

    event.respondWith(
        caches.match(event.request).then((res) => {
            return res || fetch(event.request)
        })
    )
})