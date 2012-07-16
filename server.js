var http = require('http');
var router = require('./router.js');

// check for port number in arguments
var port = 8080;
if ((i = process.argv.indexOf('--port')) !== -1 &&
      process.argv.length > i+1)
{
  port = parseInt(process.argv[i+1], 10);
  if (!port) { throw 'Invalid port: ' + process.argv[i+1]; }
}

var server = http.createServer(router.onRequest);
console.log('listening on ' + port + ', have fun.');
server.listen(port);

