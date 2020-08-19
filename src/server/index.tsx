/* eslint-disable @typescript-eslint/no-var-requires, import/no-dynamic-require, import/no-extraneous-dependencies */
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as Url from 'url';

import { h } from 'preact'; /** @jsx h */

const connect = require('connect');
const compression = require('compression');
const serveStatic = require('serve-static');
const { renderToString } = require('preact-render-to-string');
const bodyParser = require('body-parser');
const { ChunkExtractor } = require('@loadable/server');

const { default: rest } = require('./rest');
const db = require('./db');
const { default: AppContainer } = require('../ssr');

// const ssrModule = require(path.resolve('./dist-ssr/ssr.js'));
// const ssrModule = require(path.resolve('./dist-ssr/ssr.js'));
const ssrStats = path.resolve('./dist-server/loadable-stats.json');

const indexFile = path.resolve('./dist/index.html');
// const AppContainer = (ssrModule && ssrModule.default) || ssrModule;

function readIndexHtml() {
  const result = fs.readFileSync(indexFile, 'utf8');

  if (result) {
    return result;
  }

  return `<!DOCTYPE html>
 <html lang="en">
 <head></head>
 <body>
 <div id="root"></div>
 </body>
 </html>`;
}

const indexHtml = readIndexHtml();
const appHtmlMinSize = '<div id="root"></div>'.length;

/**
 * render HTML
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function renderHtml(req, res) {
  const url = req.url || '/';

  (global as any).history = {};
  (global as any).location = { ...Url.parse(url) };
  const backendData = db.getInitData();

  const ssrExtractor = new ChunkExtractor({ statsFile: ssrStats, entrypoints: ['server'] });
  // const { default: AppContainer } = ssrExtractor.requireEntrypoint();
  ssrExtractor.requireEntrypoint();
  const jsx = ssrExtractor.collectChunks(<AppContainer url={url} preloadedState={backendData} />);
  const appHtml = renderToString(jsx) || '';

  // const appHtml = renderToString(preact.h(AppContainer, { url, preloadedState: backendData })) || '';

  if (appHtml.length <= appHtmlMinSize) {
    // default route
    res.writeHead(302, {
      Location: '/home',
    });
    res.end();
  } else {
    const cliData = encodeURI(JSON.stringify({ preRenderData: { url } }));
    const cliDataHtml = `<script type="__PREACT_CLI_DATA__">${cliData}</script>`;
    const backendDataHtml = `<script>window.__BACKEND_DATA__ = ${JSON.stringify(backendData)};</script>`;
    const html = indexHtml.replace('<div id="root"></div>', cliDataHtml + backendDataHtml + appHtml);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.write(html);
    res.end();
  }
}

const app = connect();

app.use(compression());
app.use(serveStatic('dist', { index: false }));
app.use(serveStatic('public', { index: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', rest.processRequest());

// respond to all requests
app.use(renderHtml);

// create node.js http server and listen on port
console.log('Listen on: http://127.0.0.1:3000'); // eslint-disable-line
http.createServer(app).listen(3000);
