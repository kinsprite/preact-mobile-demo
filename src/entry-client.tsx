import { h, render, hydrate } from 'preact'; /** @jsx h */
import global from 'core-js/internals/global';

import './redux/store';
import nativeMessageHandler from './nativeMessage';
import App from './App';

import './styles/root.scss';

global.nativeMessageHandler = nativeMessageHandler;

const normalizeURL = (url) => (url[url.length - 1] === '/' ? url : `${url}/`);

function init() {
  const root = document.getElementById('root') || document.body.firstElementChild;

  let preRenderData = { url: '' };
  const inlineDataElement = document.querySelector('[type="__PREACT_CLI_DATA__"]');

  if (inlineDataElement) {
    preRenderData = JSON.parse(decodeURI(inlineDataElement.innerHTML)).preRenderData
      || preRenderData;
  }

  /* An object named CLI_DATA is passed as a prop,
         * this keeps us future proof if in case we decide,
         * to send other data like at some point in time.
         */
  const CLI_DATA = { preRenderData };
  const preloadedState = window.__BACKEND_DATA__; // eslint-disable-line
  const currentURL = preRenderData.url ? normalizeURL(preRenderData.url) : '';
  const canHydrate = inlineDataElement
            && process.env.NODE_ENV === 'production'
            && hydrate
            && currentURL === normalizeURL(document.location.pathname);
  console.log(`canHydrate is ${canHydrate}`); // eslint-disable-line
  const doRender = canHydrate ? hydrate : render;
  doRender(h(App, { CLI_DATA, preloadedState }), document.body, root);
}

function notification() {
  if ('Notification' in window) {
    Notification.requestPermission((status) => {
      console.log('Notification permission status:', status); // eslint-disable-line
      if (Notification.permission === 'granted' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((reg) => {
          console.log('Notification serviceWorker ready'); // eslint-disable-line
          // TODO 2.4 - Add 'options' object to configure the notification
          // reg.showNotification('Hello world!');
        });
      }
    });
  }
}

init();
notification();
