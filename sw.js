/* Mentor 서비스워커
   - 앱 껍데기: 캐시 우선 (빠른 실행 / 오프라인)
   - 콘텐츠(content/): 네트워크 우선 (새 글이 바로 반영)
   앱 파일을 수정했을 때는 아래 VERSION 숫자만 올리면 됩니다. */
const VERSION = 'mentor-v1';
const SHELL = [
  './', './index.html', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-32.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e=>{
  const req = e.request;
  if(req.method!=='GET') return;
  const url = new URL(req.url);
  if(url.origin!==location.origin) return;

  if(url.pathname.includes('/content/')){
    e.respondWith(
      fetch(req).then(r=>{
        const copy = r.clone();
        caches.open(VERSION).then(c=>c.put(req, copy));
        return r;
      }).catch(()=>caches.match(req))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(r=>{
      const copy = r.clone();
      caches.open(VERSION).then(c=>c.put(req, copy));
      return r;
    }))
  );
});
