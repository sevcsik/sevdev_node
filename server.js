var http = require('http');
var router = require('./router.js');

var port = 8080;

if (process.argv.indexOf('--port') !== -1) {
  // check for port number in arguments
  var portString = process.argv[process.argv.indexOf('--port') + 1];

  port = +portString;

  if (!port) throw 'Invalid port: ' + portString;
}

var server = http.createServer(router.onRequest);
console.log('listening on ' + port + ', have fun.');
server.listen(port);

