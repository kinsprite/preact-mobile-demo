const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const replaceInFile = require('replace-in-file');
const scripts = require('react-micro-frontend-scripts');

// the file you want to get the hash
const swFilePath = path.join(scripts.paths.prodDist(), 'service-worker.js');
const fd = fs.createReadStream(swFilePath);
const hash = crypto.createHash('sha1');
hash.setEncoding('hex');

fd.on('end', () => {
  hash.end();
  const sha1sum = hash.read();
  fd.close();

  const swFileHashName = `service-worker.${sha1sum.substr(0, 8)}.js`;

  fs.rename(swFilePath, path.join(scripts.paths.prodDist(), swFileHashName), (err) => {
    if (err) {
      console.log('Error Found:', err);
    }
  });

  replaceInFile({
    files: path.join(scripts.paths.prodDist(), 'index.html'),
    from: 'if (\'serviceWorker\' in navigator) {}',
    to: `if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/${swFileHashName}');
        navigator.serviceWorker.startMessages();
      });
    }`,
  });

  replaceInFile({
    files: path.join(scripts.paths.prodDist(), 'rmf-manifest.json'),
    from: /"\/service-worker(\.[0-9a-f]+)?.js"/,
    to: `"/${swFileHashName}"`,
  });
});

// read all file and pipe it (write it) to the hash object
fd.pipe(hash);

// copy files
const pwaFileNames = [
  'favicon.ico',
  'logo192.png',
  'logo512.png',
  'pwa.webmanifest',
];

pwaFileNames.forEach((fileName) => {
  fs.copyFile(
    path.join(scripts.paths.public(), fileName),
    path.join(scripts.paths.prodDist(), fileName),
    (err) => {
      if (err) {
        console.log('Error Found:', err);
      }
    },
  );
});
