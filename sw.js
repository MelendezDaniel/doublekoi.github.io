const CACHE="doubleko-v1";
const PRECACHE=["./","./index.html","./manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.mode==="navigate"){ e.respondWith(fetch(r).catch(()=>caches.match("./index.html"))); return; }
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{
    caches.open(CACHE).then(c=>c.put(r,res.clone())).catch(()=>{});
    return res;
  })));
});
