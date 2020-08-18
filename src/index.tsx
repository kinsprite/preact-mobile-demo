import { h, render, hydrate } from 'preact'; /** @jsx h */
import global from 'core-js/internals/global';

import './store';
import RouterBase from './RouterBase';

import './root.css';
import nativeMessageHandler from './nativeMessage';

global.nativeMessageHandler = nativeMessageHandler;

const normalizeURL = (url) => (url[url.length - 1] === '/' ? url : `${url}/`);

function init() {
  const root = document.getElementById('root') || document.body.firstElementChild;

  let preRenderData = { url: '' };
  const inlineDataElement = document.querySelector(
    '[type="__PREACT_CLI_DATA__"]',
  );
  if (inlineDataElement) {
    preRenderData = JSON.parse(decodeURI(inlineDataElement.innerHTML)).preRenderData
                || preRenderData;
  }
  /* An object named CLI_DATA is passed as a prop,
         * this keeps us future proof if in case we decide,
         * to send other data like at some point in time.
         */
  const CLI_DATA = { preRenderData };
  const currentURL = preRenderData.url ? normalizeURL(preRenderData.url) : '';
  const canHydrate = inlineDataElement
            && process.env.NODE_ENV === 'production'
            && hydrate
            && currentURL === normalizeURL(document.location.pathname);
  const doRender = canHydrate ? hydrate : render;
  doRender(h(RouterBase, { CLI_DATA }), document.body, root);
}

init();
