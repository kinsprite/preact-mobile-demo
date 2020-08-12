/* eslint-disable @typescript-eslint/no-var-requires, import/no-dynamic-require, import/no-extraneous-dependencies */
const fs = require('fs');
const http = require('http');
const path = require('path');

const connect = require('connect');
const serveStatic = require('serve-static');

const manifestJson = require(path.resolve('./dist/rmf-manifest.json'));

const runSSR = require(path.resolve(path.join('./dist', manifestJson.files['ssr.js'])));

function readIndexHtml() {
  const indexFile = path.resolve('./public/index.html');
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

function renderHtml(req, res) {
  // This context object contains the results of the render
  const context = {};
  const html = runSSR.default({
    context, req, indexHtml, manifestJson,
  });

  // context.url will contain the URL to redirect to if a <Redirect> was used
  if (context.url) {
    res.writeHead(302, {
      Location: context.url,
    });
    res.end();
  } else {
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
