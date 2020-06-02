const url = require('url');
const http = require('http');
const {STATUS_CODES} = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const handleSendResponse = (code) => {
    res.statusCode = code;
    res.end(STATUS_CODES[code]);
  };

  if (req.method === 'DELETE') {
    const pathname = url.parse(req.url).pathname.slice(1);
    const filepath = path.join(__dirname, 'files', pathname);

    const handleError = (error) => {
      let statusCode = 500;
      const {code} = error;
      if (code === 'ENOENT') {
        statusCode = 404;
      }
      handleSendResponse(statusCode);
    };

    if (pathname.includes('/') || pathname.includes('..')) {
      return handleSendResponse(400);
    }

    fs.unlink(filepath, (err) => {
      if (err) handleError(err);
      else handleSendResponse(200);
    });
  } else {
    handleSendResponse(501);
  }
});

module.exports = server;
