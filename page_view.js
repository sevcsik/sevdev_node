fs = require('fs');

var page_cache = {};
var template = null;
var no_cache = process.no_cache;

function renderPage(page_name, template, response)
{
  // load page
  var output;
  if (!no_cache && page_name in page_cache)
  {
    output = template.replace('{{ARTICLE}}', page_cache[page_name]);
    response.write(output);
    response.end();
  }
  else
  {
    fs.readFile('pages' + '/' + page_name + '.html', 'utf-8',
                function(err, data)
    {
      if (err)
      {
        response.writeHead(404, 'Page Missing');
        response.end();
      }
      else
      {
        if (!no_cache) console.log('page cached: ' + page_name);
        var output = template.replace('{{ARTICLE}}', data);
        response.write(output);
        response.end();

        // put in page_cache
        if (!no_cache) page_cache[page_name] = data;
      }
    });
  }
}

exports.renderTemplate = function(request, response)
{
  // strip slash from url
  var page_name = request.url.replace('/', '');
  if (!page_name) page_name = 'root';

  // load template
  if (!template)
  {
    fs.readFile('static/template.html', 'utf-8', function(err, data)
    {
      if (err)
      {
        response.writeHead(404, 'Template Missing');
        response.end(); // TODO: generic error module
      }
      else
      {
        if (!no_cache) console.log('template cached');
        template = data;
        renderPage(page_name, template, response);
      }
    });
  }
  else renderPage(page_name, template, response);

  // only keep template in memory, if cache is enabled
  if (no_cache) template = null;
};
