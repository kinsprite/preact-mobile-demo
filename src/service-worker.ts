import global from 'core-js/internals/global';
import { clientsClaim, skipWaiting } from 'workbox-core';
import { NavigationRoute, registerRoute, setDefaultHandler } from 'workbox-routing';
import {
  CacheFirst, CacheOnly, NetworkFirst, NetworkOnly,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
// import * as navigationPreload from 'workbox-navigation-preload';

// polyfill
if (typeof global.globalThis !== 'object') {
  global.globalThis = global;
}

// eslint-disable-next-line no-restricted-globals, no-underscore-dangle
const manifests: {revision: string, url: string}[] = self.__WB_MANIFEST;
const spaHtmlURL = '/index.html';

skipWaiting();
clientsClaim();
precacheAndRoute(manifests.filter((item) => item.url !== spaHtmlURL));

const spaHtmlItems = manifests.filter((item) => item.url === spaHtmlURL);
const spaHtmlWithRev = `${spaHtmlURL}?v=${spaHtmlItems.length && spaHtmlItems[0].revision}`;

//
// NavigationPreloadManager
//
// navigationPreload.enable();
const navNetworkOnly = new NetworkOnly();
const navNetworkFirst = new NetworkFirst({ cacheName: 'navigations', networkTimeoutSeconds: 5 });

const navigationHandler = async ({ event, request }) => {
  const { url } = request;
  console.log(`[Service Worker]: nav to ${url}`);  // eslint-disable-line

  try {
    return await navNetworkOnly.handle({ event, request });
  } catch (e) {
    return navNetworkFirst.handle({ event, request: new Request(spaHtmlWithRev) });
  }
};

// cache SPA's index.html
globalThis.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(navNetworkFirst.handle({ request: new Request(spaHtmlWithRev) }));
});

globalThis.addEventListener('activate', () => {
  const cacheOnly = new CacheOnly({ cacheName: 'navigations' });

  cacheOnly.handle({ request: new Request(spaHtmlWithRev) }).catch(() => {
    const timerId = globalThis.setTimeout(() => {
      navNetworkFirst.handle({ request: new Request(spaHtmlWithRev) });
      globalThis.clearTimeout(timerId);
    }, 3000);
  });
});

// Register this strategy to handle all navigations.
registerRoute(
  new NavigationRoute(navigationHandler, {
    denylist: [/^\/_/, /^\/api/, /^\/rest/, /\/[^/?]+\.[^/]+$/],
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
  ({ url }) => url.origin === globalThis.location.origin
             && pwaManifestPaths.has(url.pathname),
  new CacheFirst({
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

// Use a NetworkFirst strategy for all other requests.
setDefaultHandler(new NetworkFirst({
  cacheName: 'fallbacks',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxEntries: 60,
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
    }),
  ],
}));

//
// Push
//
globalThis.addEventListener('push', (event: PushEvent) => {
  if (!(globalThis.Notification && globalThis.Notification.permission === 'granted')) {
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

  console.log('PUSH ', data);  // eslint-disable-line

  ((globalThis as any).registration as ServiceWorkerRegistration).showNotification(title, {
    body: message,
    tag: 'simple-push-demo-notification',
    icon,
  });
});

globalThis.addEventListener('notificationclick', (event: NotificationEvent) => {
  const { notification } = event;
  notification.close();
  console.log('On notification click');  // eslint-disable-line

  if (notification.tag === 'simple-push-demo-notification') {
    const clients = (globalThis as any).clients as Clients;

    if (clients.openWindow) {
      clients.openWindow('/');
    }
  }
});
