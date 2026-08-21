const CACHE_NAME = "bori-v1.6.1-production";
const ASSETS = ["./","./index.html","./styles.css","./config.js","./app.js","./manifest.webmanifest","./assets/favicon.png","./assets/icon-192.png","./assets/icon-512.png","./assets/splash-v2.png","./assets/hero-bori.png","./assets/icon-door.png","./assets/icon-key.png","./assets/room-icons/home.jpg","./assets/room-icons/beach.jpg","./assets/room-icons/cat.jpg","./assets/room-icons/couple.jpg","./assets/room-icons/plant.jpg","./assets/room-icons/piggybank.jpg","./assets/room-icons/shopping.jpg","./assets/room-icons/food.jpg","./assets/room-icons/book.jpg","./assets/room-icons/fitness.jpg","./assets/room-icons/camera.jpg","./assets/room-icons/balloons.jpg","./assets/room-icons/movie.jpg","./assets/room-icons/game.jpg","./assets/room-icons/checklist.jpg","./assets/room-icons/store.jpg","./assets/room-icons/baby.jpg","./assets/room-icons/car.jpg","./assets/room-icons/letter.jpg","./assets/room-icons/gift.jpg","./assets/stickers/hi.jpg","./assets/stickers/there.jpg","./assets/stickers/thankyou.jpg","./assets/stickers/awesome.jpg","./assets/stickers/please.jpg","./assets/stickers/congrats.jpg","./assets/stickers/whimper.jpg","./assets/stickers/hug.jpg","./assets/stickers/gotit.jpg","./assets/stickers/thinking.jpg","./assets/stickers/ok2.jpg","./assets/stickers/goodnight.jpg","./assets/stickers/hardwork.jpg","./assets/stickers/yay.jpg","./assets/stickers/touched.jpg","./assets/stickers/leaving.jpg","./assets/stickers2/hi2.jpg","./assets/stickers2/logging.jpg","./assets/stickers2/calculating.jpg","./assets/stickers2/done2.jpg","./assets/stickers2/saving_best.jpg","./assets/stickers2/spree.jpg","./assets/stickers2/overspent.jpg","./assets/stickers2/ohno.jpg","./assets/stickers2/shouldbuy.jpg","./assets/stickers2/planfirst.jpg","./assets/stickers2/tinyjoy.jpg","./assets/stickers2/summary.jpg","./assets/stickers2/goalmet.jpg","./assets/stickers2/keepsaving.jpg","./assets/stickers2/saveit.jpg","./assets/stickers2/todayspend.jpg","./assets/stickers2/waitbuy.jpg","./assets/stickers2/walletcry.jpg","./assets/stickers2/relax.jpg","./assets/stickers2/goodnight2.jpg","./assets/category-icons/ramen.png","./assets/category-icons/bubbletea.png","./assets/category-icons/coffee.png","./assets/category-icons/cake.png","./assets/category-icons/burger.png","./assets/category-icons/groceries.png","./assets/category-icons/shopping_bag.png","./assets/category-icons/cart.png","./assets/category-icons/car.png","./assets/category-icons/scooter.png","./assets/category-icons/train.png","./assets/category-icons/plane.png","./assets/category-icons/gas.png","./assets/category-icons/bus.png","./assets/category-icons/taxi.png","./assets/category-icons/parking.png","./assets/category-icons/movie.png","./assets/category-icons/game.png","./assets/category-icons/headphones.png","./assets/category-icons/gift.png","./assets/category-icons/house.png","./assets/category-icons/building.png","./assets/category-icons/lightbulb.png","./assets/category-icons/faucet.png","./assets/category-icons/toiletries.png","./assets/category-icons/bed_moon.png","./assets/category-icons/firstaid.png","./assets/category-icons/medicine.png","./assets/category-icons/fitness.png","./assets/category-icons/produce.png","./assets/category-icons/pets.png","./assets/category-icons/petfood.png","./assets/category-icons/toiletries2.png","./assets/category-icons/clothes.png","./assets/category-icons/makeup.png","./assets/category-icons/haircut.png","./assets/category-icons/luggage.png","./assets/category-icons/bedroom.png","./assets/category-icons/laptop.png","./assets/category-icons/phone.png","./assets/category-icons/book.png","./assets/category-icons/graduation.png","./assets/category-icons/tv.png","./assets/category-icons/calendar.png","./assets/category-icons/wallet.png","./assets/category-icons/creditcard.png","./assets/category-icons/insurance.png","./assets/category-icons/receipt.png","./assets/category-icons/flowers.png","./assets/category-icons/chat.png"];
self.addEventListener("install", event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))); });
self.addEventListener("activate", event => event.waitUntil(Promise.all([caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))), self.clients.claim()])));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(fetch(event.request).then(response => { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); return response; }).catch(() => caches.match(event.request)));
});
self.addEventListener("push", event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { title: "BORI", body: event.data ? event.data.text() : "" }; }
  const title = data.title || "BORI";
  const options = {
    body: data.body || "",
    icon: "./assets/icon-192.png",
    badge: "./assets/icon-192.png",
    data: { url: data.url || "./" },
    tag: "bori-chat",
    renotify: true
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = event.notification.data?.url || "./";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const c of list) { if ("focus" in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
