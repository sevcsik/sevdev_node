var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var page_view = require('./page_view.js');

var MIME_TYPES =
{
  '.css':   'text/css',
  '.js':    'text/javascript',
  '.png':   'image/png',
  '.jpg':   'image/jpg',
  '.woff':  'application/font-woff',
  '.ttf':   'application/octet-stream',
  '.otf':   'application/octet-stream',
  '.eot':   'application/vnd.ms-fontobject',
  '.svg':   'image/svg+xml',
  default: 'text/plain',
};

var static_cache = {};
var no_cache = false;

// is cache disabled?
if (process.argv.indexOf('--no-cache') != -1)
{
  no_cache = true;
  console.log('cache disabled.');
}

exports.onRequest = function(request, response)
{
  // check that file exists in cache
  if (!no_cache && request.url in static_cache)
  {
    // check that browser cache is valid
    if ('if-none-match' in request.headers &&
        request.headers['if-none-match'] === static_cache[request.url].etag)
    {
      response.writeHead(304); // not modified
      response.end();
    }
    else // respond with cached content
    {
      if (!no_cache)
        response.writeHead(200,
        {
          'Content-Type': static_cache[request.url].type,
          'ETag': static_cache[request.url].etag
        });
      else
        response.writeHead(200,
        {
          'Content-Type': static_cache[request.url].type,
          'Cache-Control': 'no-cache'
        });

      response.end(static_cache[request.url].content, 'utf-8');
    }
  }
  else
  {
    // check that file exists
    var file_path = 'static' + request.url;
    path.exists(file_path, function(exists)
    {
      if (exists && request.url != '/') // serve normally
      {
        fs.readFile(file_path, function(error, content)
        {
          if (error)
          {
            response.writeHead(403);
            response.write('sry :(');
            response.end();
          }
          else
          {
            mime_type = MIME_TYPES[path.extname(file_path)];
            if (mime_type == undefined) mime_type = MIME_TYPES.default;

            // save file contents to cache
            if (!no_cache)
            {
              fs.stat(file_path, function(err, stats)
              {
                static_cache[request.url] =
                {
                  'type': mime_type,
                  'content': content,
                  'etag': crypto.createHash('sha1').update(content)
                          .digest('hex')
                };
                console.log('file cached: ' + file_path);
              });
            }

            response.writeHead(200, { 'Content-Type': mime_type });
            response.end(content, 'utf-8');
          }
        });
      }
      else // treat as a dynamic url
      {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        if (request.url == '/')
          page_view.renderTemplate(request, response);
        else
        {
          if (request.url.match(/^\/ajax\/pages/))
            page_view.respondAjax(request, response);
          else
            page_view.renderTemplate(request, response);
        }
      }
    });
  }
};

// bind cache clear to SIGHUP
process.on('SIGHUP', function()
{
  static_cache =  {};
  console.log('static cache cleared.');
});
