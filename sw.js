```javascript
const LOCK_CACHE_NAME = 'asoo-site-lock-v1';

self.addEventListener('install', (event) => { self.skipWaiting(); });
self.addEventListener('activate', (event) => { event.waitUntil(self.clients.claim()); });

self.addEventListener('message', (event) => {
    if (event.data === 'LOCK_SITE') {
        caches.open(LOCK_CACHE_NAME).then((cache) => {
            cache.put('/locked-flag', new Response('locked'));
        });
    }
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            caches.open(LOCK_CACHE_NAME).then((cache) => {
                return cache.match('/locked-flag').then((response) => {
                    if (response) {
                        return new Response(`
                            <!DOCTYPE html>
                            <html lang="ar" dir="rtl">
                            <head>
                                <meta charset="utf-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>تم قفل الرابط</title>
                                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@700&display=swap" rel="stylesheet">
                            </head>
                            <body style="background:#fdf2f8; display:flex; justify-content:center; align-items:center; height:100vh; margin:0; font-family:'Cairo', sans-serif; text-align:center; padding:20px;">
                                <div style="background:white; padding:30px; border-radius:20px; box-shadow:0 10px 25px rgba(225,29,72,0.1); border:1px solid #fce7f3; max-width:400px; width:100%;">
                                    <div style="font-size:4.5rem; margin-bottom:10px;">🔒</div>
                                    <h2 style="color:#e11d48; margin-top:0; font-size:1.8rem;">الرابط منتهي الصلاحية!</h2>
                                    <p style="color:#4b5563; font-size:1rem; font-weight:bold; line-height:1.6;">لقد قمتِ بالخروج من الصفحة.<br>هذا الرابط مخصص للاستخدام مرة واحدة فقط لحماية خصوصية العمل.</p>
                                    <p style="color:#fb7185; font-size:0.9rem; margin-top:20px;">يرجى التواصل مع إدارة الصالون لطلب رابط جديد 🌸</p>
                                </div>
                            </body>
                            </html>
                        `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
                    }
                    return fetch(event.request);
                });
            })
        );
    }
});


```
