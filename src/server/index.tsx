/* eslint-disable @typescript-eslint/no-var-requires, import/no-dynamic-require, import/no-extraneous-dependencies */
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as Url from 'url';

import { h } from 'preact'; /** @jsx h */
import distRootArg from './distRootArg';

const connect = require('connect');
const compression = require('compression');
const serveStatic = require('serve-static');
const { renderToString } = require('preact-render-to-string');
const bodyParser = require('body-parser');
const { ChunkExtractor } = require('@loadable/server');

const { default: rest } = require('./rest');
const db = require('./db');
const { default: App } = require('../entry-server');

const distRoot = distRootArg() || '.';
console.log('Dist root: ', distRoot); // eslint-disable-line no-console

const clientStats = path.resolve(`${distRoot}/dist/loadable-stats.json`);
const ssrStats = path.resolve(`${distRoot}/dist-server/loadable-stats.json`);
const indexFile = path.resolve(`${distRoot}/dist/index.html`);
const clientOutputPath = path.resolve(`${distRoot}/dist`);
const ssrOutputPath = path.resolve(`${distRoot}/dist-server`);

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

function getHeaderLinkContent(mainAssets: {scriptType: 'script' | 'style', url: string}[]) {
  // Link: </style.css>; as=style; rel=preload, </favicon.ico>; as=image; rel=preload
  let linkContent = '';

  mainAssets.filter((asset) => asset.scriptType === 'script' || asset.scriptType === 'style')
    .forEach((asset) => {
      if (linkContent) {
        linkContent += ', ';
      }

      linkContent += `<${asset.url}>; as=${asset.scriptType}; rel=preload`;
    });

  return linkContent;
}

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

  const ssrExtractor = new ChunkExtractor({
    statsFile: ssrStats,
    entrypoints: ['server'],
    outputPath: ssrOutputPath,
  });
  ssrExtractor.requireEntrypoint();

  const routeContent = { url: '' };
  const jsx = ssrExtractor.collectChunks(<App url={url} preloadedState={backendData} routeContent={routeContent} />);
  const appHtml = renderToString(jsx) || '';

  if (routeContent.url) {
    // default route
    res.writeHead(302, {
      Location: routeContent.url,
    });
    res.end();
  } else {
    const clientExtractor = new ChunkExtractor({
      statsFile: clientStats,
      entrypoints: ['polyfill', 'app'],
      outputPath: clientOutputPath,
    });

    const cliData = encodeURI(JSON.stringify({ preRenderData: { url } }));
    const cliDataHtml = `<script type="__PREACT_CLI_DATA__">${cliData}</script>`;
    const backendDataHtml = `<script>window.__BACKEND_DATA__ = ${JSON.stringify(backendData)};</script>`;
    const html = indexHtml.replace('<div id="root"></div>', cliDataHtml + backendDataHtml + appHtml);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    // Server push header: Link: </style.css>; as=style; rel=preload, </favicon.ico>; as=image; rel=preload
    const linkContent = getHeaderLinkContent(clientExtractor.getMainAssets());

    if (linkContent) {
      res.setHeader('Link', linkContent);
    }

    res.write(html);
    res.end();
  }
}

const app = connect();

app.use(compression());

if (process.env.ENABLE_SERVE_STATIC) {
  app.use(serveStatic('dist', { index: false }));
  app.use(serveStatic('public', { index: false }));
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', rest.processRequest());

// respond to all requests
app.use(renderHtml);

// create node.js http server and listen on port
console.log('Listen on: http://127.0.0.1:9090'); // eslint-disable-line
http.createServer(app).listen(9090, '127.0.0.1');
