const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const replaceInFile = require('replace-in-file');
const scripts = require('react-micro-frontend-scripts');

// the file you want to get the hash
const fd = fs.createReadStream(path.join(scripts.paths.prodDist(), 'service-worker.js'));
const hash = crypto.createHash('sha1');
hash.setEncoding('hex');

fd.on('end', () => {
  hash.end();
  const sha1sum = hash.read();
  fd.close();

  replaceInFile({
    files: path.join(scripts.paths.prodDist(), 'index.html'),
    from: /'\/service-worker.js(\?v=([0-9a-f]*|null))?'/,
    to: `'/service-worker.js?v=${sha1sum.substr(0, 10)}'`,
  });
});

// read all file and pipe it (write it) to the hash object
fd.pipe(hash);
