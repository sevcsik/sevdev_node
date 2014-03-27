var fs = require('fs');
var libxml = require ('libxmljs');

var page_cache = {};
var template = null;

var no_cache = false;

// is cache disabled?
if (process.argv.indexOf('--no-cache') !== -1) { no_cache = true; }

function renderPage(template, page)
{
  var output = template
                 .replace(/\{\{the_content\}\}/g, page.content)
                 .replace(/\{\{the_title\}\}/g, page.title)
                 .replace(/\{\{the_pagename\}\}/g, page.name)
				 .replace(/\{\{the_pageindex\}\}/g, page.index);

  // don't include content in pageinfo_json again
  var content = page.content;
  page.content = null;
  output = output.replace('{{pageinfo_json}}', JSON.stringify(page));
  page.content = content;

  return output;
}

function parsePageXML(content, page)
{
  var page_xml = libxml.parseHtmlString(content);
  page.title = page_xml.get('//sd-title').text();
  page.index = page_xml.get('//sd-index').text();
}


function respondTemplate(request, response, page)
{
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
        if (!no_cache) { console.log('template cached'); }
        template = data;
        response.end(renderPage(template, page));
      }
    });
  }
  else
  {
    response.end(renderPage(template, page));
  }

  // only keep template in memory, if cache is enabled
  if (no_cache) { template = null; }
}

exports.respond = function(request, response, render)
{
  // get page name from url
  var url_items = request.url.split('/');

  var page_name;

  do
  {
    page_name = url_items.pop();
  } while (url_items.length > 0 && !page_name);

  if (!page_name)
  {
    page_name = 'root';
  }

  // if cached, respond the cached version
  if (!no_cache && page_cache[page_name] !== undefined)
  {
    if (!render) {
      response.writeHead(200, {'Content-type:': 'application/json'});
      response.end(JSON.stringify(page_cache[page_name]));
    } else {
      response.writeHead(200, {'Content-type:': 'text/html'});
      respondTemplate(request, response, page_cache[page_name]);
    }
  }
  else
  {
    // load page from file
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
        // load metadata
        fs.readFile('pages' + '/' + page_name + '.meta.xml', 'utf-8',
        function(error, metadata)
        {
          // read page info from xml
          var page = {};
          page.name = page_name;

          try
          {
            if (!error)
            {
              parsePageXML(metadata, page);
            }
            else
            {
              console.log('couldn\'t load ' + page_name + '.meta.xml');
            }
          }
          catch (error_ex)
          {
            console.log('xml error: ' + error_ex.toString());
            page.title = page_name;
          }

          page.content = data;

          // save to cache
          if (!no_cache)
          {
            page_cache[page_name] = page;
            console.log('page cached: ' + page_name);
          }
          else
          {
            response.writeHead(200, {'Cache-Control': 'no-cache'});
          }

          if (!render) // respond JSON
          {
            response.writeHead(200, {'Content-type:': 'application/json'});
            response.end(JSON.stringify(page));
          }
          else // render page in template
          {
            respondTemplate(request, response, page);
          }
        });
      }
    });
  }
};

// bind cache clear to SIGHUP
process.on('SIGHUP', function()
{
  template = null;
  static_cache = {};
  page_cache = {};
  console.log('page cache cleared.');
});
