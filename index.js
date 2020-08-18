/* eslint-disable @typescript-eslint/no-var-requires, import/no-dynamic-require, import/no-extraneous-dependencies */
const fs = require('fs');
const http = require('http');
const path = require('path');

const connect = require('connect');
const serveStatic = require('serve-static');
const URL = require('url');
const preact = require('preact');
const renderToString = require('preact-render-to-string');

const manifestJson = require(path.resolve('./dist/rmf-manifest.json'));
const ssrModule = require(path.resolve('./dist-ssr/ssr.js'));

const indexFile = path.resolve('./dist/index.html');
const App = (ssrModule && ssrModule.default) || ssrModule;

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

/**
 * render HTML
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function renderHtml(req, res) {
  const url = req.url || '/';

  global.history = {};
  global.location = { ...URL.parse(url) };

  const appHtml = renderToString(preact.h(App, { url }));

  if (!appHtml) {
    // default route
    res.writeHead(302, {
      Location: '/home',
    });
    res.end();
  } else {
    const data = encodeURI(JSON.stringify({ preRenderData: { url } }));
    const dataHtml = `<script type="__PREACT_CLI_DATA__">${data}</script>`;
    const html = indexHtml.replace('<div id="root"></div>', dataHtml + appHtml);
    res.write(html);
    res.end();
  }
}

const app = connect();

app.use(serveStatic('dist', { index: false }));
app.use(serveStatic('public', { index: false }));

// respond to all requests
app.use(renderHtml);

// create node.js http server and listen on port
console.log('Listen on: http://127.0.0.1:3000');
http.createServer(app).listen(3000);
