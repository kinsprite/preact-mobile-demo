import { skipWaiting, clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';

skipWaiting();
clientsClaim();

registerRoute(
  ({ url }) => url.origin === 'https://hacker-news.firebaseio.com',
  new StaleWhileRevalidate(),
);

this.addEventListener('push', (event) => {
  const title = 'Get Started With Workbox';
  const options = {
    body: (event as any).data.text(),
  };
  // event.waitUntil(this.registration.showNotification(title, options));
});

precacheAndRoute(self.__WB_MANIFEST);
