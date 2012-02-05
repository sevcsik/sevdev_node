var http = require('http');
var router = require('./router.js');

var server = http.createServer(router.onRequest);
server.listen(8080);


