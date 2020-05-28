const url = require('url');
const http = require('http');
const {STATUS_CODES} = require('http');
const path = require('path');
const fs = require('fs');

const LimitSizeStream = require('./LimitSizeStream');
const server = new http.Server();
const limit = 1024 * 1024;

server.on('request', (req, res) => {
  const handleSendResponse = (code) => {
    res.statusCode = code;
    res.end(STATUS_CODES[code]);
  };

  if (req.method === 'POST') {
    const pathname = url.parse(req.url).pathname.slice(1);
    const filepath = path.join(__dirname, 'files', pathname);

    const handleError = (error) => {
      let statusCode = 500;
      const {code} = error;
      if (code === 'LIMIT_EXCEEDED') {
        statusCode = 413;
        unlinkFile();
      } else if (code === 'ENOENT') {
        statusCode = 400;
      } else if (code === 'EEXIST') {
        statusCode = 409;
      }
      handleSendResponse(statusCode);
    };

    const unlinkFile = () => {
      fs.unlink(filepath, (err) => {
        if (err) throw err;
      });
    };

    if (pathname.includes('/')) {
      handleSendResponse(400);
    }

    if (Number(req.headers['content-length']) === 0) {
      handleSendResponse(409);
    }

    const transformableStream = new LimitSizeStream({
      limit,
    });
    const writableStream = fs.createWriteStream(filepath, {flags: 'wx'});

    const pipedStream = req.pipe(transformableStream).pipe(writableStream);
    pipedStream.on('finish', () => {
      handleSendResponse(201);
    });

    req.on('aborted', unlinkFile);
    req.on('error', handleError);
    writableStream.on('error', handleError);
    transformableStream.on('error', handleError);
    pipedStream.on('error', handleError);
  } else {
    handleSendResponse(501);
  }
});

module.exports = server;
