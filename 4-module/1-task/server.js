const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  const readableStream = fs.createReadStream(filepath);

  readableStream.on('open', () => {
    readableStream.pipe(res);
  });

  readableStream.on('error', (err) => {
    if (err.code === 'ENOENT') {
      res.statusCode = 404;
    }
    if (pathname.includes('/')) {
      res.statusCode = 400;
    }
    readableStream.destroy();
    res.end();
  });

  switch (req.method) {
    case 'GET':
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
