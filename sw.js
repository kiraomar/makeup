```javascript
const LOCK_CACHE_NAME = 'asoo-lock-v1';

self.addEventListener('install', (event) => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('message', (event) => {
    if (event.data === 'LOCK_SITE') {
        caches.open(LOCK_CACHE_NAME).then((cache) => {
            cache.put('/locked', new Response('locked'));
        });
    }
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        const url = new URL(event.request.url);
        // في حال كان الرابط يحتوي على توكن جديد، يتم مسح قفل الحماية تلقائياً لتمكين الزبونة من الدخول
        if (url.searchParams.has('token') || url.searchParams.has('v')) {
            event.waitUntil(caches.delete(LOCK_CACHE_NAME));
        }

        event.respondWith(
            caches.open(LOCK_CACHE_NAME).then(async (cache) => {
                const isLocked = await cache.match('/locked');
                if (isLocked && !url.searchParams.has('token') && !url.searchParams.has('v')) {
                    return new Response(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@700&display=swap" rel="stylesheet">
    <title>الرابط منتهي</title>
</head>
<body style="background:#fdf2f8;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:'Cairo',sans-serif;text-align:center;">
    <div style="background:white;padding:30px;border-radius:20px;box-shadow:0 10px 25px rgba(0,0,0,0.1);max-width:320px;width:100%;box-sizing:border-box;border:1px solid #fce7f3;">
        <div style="font-size:4rem;margin-bottom:15px;">🔒</div>
        <h2 style="color:#e11d48;margin:0 0 10px 0;">الرابط منتهي الصلاحية</h2>
        <p style="color:#4b5563;font-size:0.95rem;line-height:1.6;margin:0;">هذا الرابط مخصص لاستخدام واحد فقط لحماية الخصوصية. يرجى طلب رابط جديد من الإدارة 🌸</p>
    </div>
</body>
</html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
                }
                return fetch(event.request);
            })
        );
    }
});

```
