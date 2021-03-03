const url = require('url');
const http = require('http');
const path = require('path');
const {unlink} = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
       unlink(filepath, (error) => {
          if (error) {
             if (pathname.includes('/') || pathname.includes('..')) {
                res.statusCode = 400;
                res.end('Nested paths are not allowed');
             } else if (error.code === 'ENOENT') {
                res.statusCode = 404;
                res.end('File not found');
             } else {
                res.statusCode = 500;
                res.end('Internal server error');
             }
          } else {
             res.statusCode = 200;
             res.end('File has been deleted');
          }
       });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
