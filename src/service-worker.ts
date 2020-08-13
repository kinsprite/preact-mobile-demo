/* eslint-disable no-restricted-globals */
import { skipWaiting, clientsClaim } from 'workbox-core';
import { registerRoute, NavigationRoute, setDefaultHandler } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from 'workbox-strategies';
import { precache, addRoute } from 'workbox-precaching';
import { ExpirationPlugin } from 'workbox-expiration';
import * as navigationPreload from 'workbox-navigation-preload';

skipWaiting();
clientsClaim();
// eslint-disable-next-line no-underscore-dangle
precache(self.__WB_MANIFEST);
addRoute();

//
// NavigationPreloadManager
//
navigationPreload.enable();
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
  new RegExp('.+\\.(js|css)$'),
  new CacheFirst({
    cacheName: 'static-resources',
  }),
);

//
// Images Resources
//
registerRoute(
  new RegExp('.+\\.(png|jpg|jpeg|gif)$'),
  new CacheFirst({
    cacheName: 'images',
  }),
);

// Use a stale-while-revalidate strategy for all other requests.
setDefaultHandler(new NetworkFirst());
