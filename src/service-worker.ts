/* eslint-disable no-restricted-globals */
import { skipWaiting, clientsClaim } from 'workbox-core';
import { registerRoute, NavigationRoute, setDefaultHandler } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from 'workbox-strategies';
import { precache, addRoute } from 'workbox-precaching';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
// import * as navigationPreload from 'workbox-navigation-preload';

skipWaiting();
clientsClaim();
// eslint-disable-next-line no-underscore-dangle
precache(self.__WB_MANIFEST);
addRoute();

//
// NavigationPreloadManager
//
// navigationPreload.enable();
const networkFirst = new NetworkFirst({ networkTimeoutSeconds: 30 });

const navigationHandler = (params) => {
  // console.log(`[Service Worker]: nav to ${params.request.url}`);
  const spaEntryURL = '/index.html';
  return networkFirst.handle({ ...params, request: new Request(spaEntryURL) });
};

// Register this strategy to handle all navigations.
registerRoute(
  new NavigationRoute(navigationHandler, {
    denylist: [/^\/_/, /^\/api/, /\/[^/?]+\.[^/]+$/],
  }),
);

//
// PWA manifest
//
const pwaManifestPaths = new Set([
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/pwa.webmanifest',
]);

registerRoute(
  ({ url }) => url.origin === self.location.origin
             && pwaManifestPaths.has(url.pathname),
  new StaleWhileRevalidate({
    cacheName: 'pwa-manifest',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 15 * 24 * 3600, // 15 Days
      }),
    ],
  }),
);

//
// Static Resources: scripts and styles
//
registerRoute(
  ({ request }) => request.destination === 'script'
                   || request.destination === 'style',
  new CacheFirst({
    cacheName: 'static-resources',
  }),
);

//
// Images Resources
//
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);

// Use a stale-while-revalidate strategy for all other requests.
setDefaultHandler(new NetworkFirst());

//
// Push
//
self.addEventListener('push', (event: PushEvent) => {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  let data = {
    title: null as string,
    message: null as string,
  };

  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || 'Something Has Happened';
  const message = data.message || "Here's something you might want to check out.";
  const icon = 'images/new-notification.png';

  console.log('PUSH ', data);

  ((self as any).registration as ServiceWorkerRegistration).showNotification(title, {
    body: message,
    tag: 'simple-push-demo-notification',
    icon,
  });
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  const { notification } = event;
  notification.close();
  console.log('On notification click');

  if (notification.tag === 'simple-push-demo-notification') {
    const clients = (self as any).clients as Clients;

    if (clients.openWindow) {
      clients.openWindow('/');
    }
  }
});
