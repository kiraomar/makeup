```javascript
const LOCK_CACHE_NAME = 'asoo-lock-v1';

self.addEventListener('install', (event) => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('message', (event) => {
    if (event.data === 'LOCK_SITE') {
        caches.open(LOCK_CACHE_NAME).then((cache) => cache.put('/locked', new Response('locked')));
    }
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            caches.open(LOCK_CACHE_NAME).then(async (cache) => {
                const isLocked = await cache.match('/locked');
                if (isLocked) {
                    return new Response(`<!DOCTYPE html><html lang="ar" dir="rtl"><body style="background:#fdf2f8;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:sans-serif;text-align:center;">
                    <div style="background:white;padding:30px;border-radius:20px;box-shadow:0 10px 25px rgba(0,0,0,0.1);max-width:300px;">
                    <h2 style="color:#e11d48;">الرابط منتهي الصلاحية</h2>
                    <p>هذا الرابط مخصص لاستخدام واحد فقط. يرجى التواصل مع الإدارة للحصول على رابط جديد.</p>
                    </div></body></html>`, { headers: { 'Content-Type': 'text/html' } });
                }
                return fetch(event.request);
            })
        );
    }
});

```
