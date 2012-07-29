var http = require('http');
var router = require('./router.js');

var port = 8080;

// use PORT environment variable if available
if (process.env['PORT']) {
  port = parseInt(process.env['PORT'], 10);
} else if ((i = process.argv.indexOf('--port')) !== -1 &&
     process.argv.length > i+1) {
  // check for port number in arguments
  port = parseInt(process.argv[i+1], 10);
  if (!port) { throw 'Invalid port: ' + process.argv[i+1]; }
}

var server = http.createServer(router.onRequest);
console.log('listening on ' + port + ', have fun.');
server.listen(port);

