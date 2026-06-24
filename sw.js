// Service worker minimal : met le jeu en cache pour qu'il fonctionne hors-ligne
// et se lance instantanément une fois installé.

const CACHE_NAME = 'tank-strike-v1';
const FILES_TO_CACHE = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// A l'installation, on télécharge et on stocke tous les fichiers nécessaires
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// On nettoie les anciennes versions du cache si on republie une mise à jour
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Pour chaque requête : on répond depuis le cache si possible, sinon on va sur le réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
