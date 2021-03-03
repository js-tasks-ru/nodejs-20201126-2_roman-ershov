const url = require('url');
const http = require('http');
const path = require('path');
const {createWriteStream, unlink} = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const writeStream = createWriteStream(filepath, {flags: 'wx'});
      const limitStream = new LimitSizeStream({limit: 2 ** 20});

      limitStream.on('error', () => {
        res.statusCode = 413;
        unlink(filepath, () => {});
        res.end('Limit has been exceeded');
      });

      writeStream.on('close', () => {
        res.statusCode = 201;
        res.end();
      });

      writeStream.on('error', (error) => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File already exists');
        } else if (error.code === 'ENOENT') {
          res.statusCode = 400;
          res.end('Nested paths are not allowed');
        } else {
          res.statusCode = 500;
          res.end('Internal server error');
        }
      });

      res.on('close', () => {
        if (!res.finished) {
          writeStream.destroy();
          unlink(filepath, () => {});
        }
      });

      req.pipe(limitStream).pipe(writeStream);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
