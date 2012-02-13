fs = require('fs');
libxml = require ('libxmljs');

var page_cache = {};
var template = null;

var no_cache = false;

// is cache disabled?
if (process.argv.indexOf('--no-cache') != -1) no_cache = true;


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

        // read page info from xml
        var page = {};
        try
        {
          var page_xml = libxml.parseHtmlString(data);
          page.title = page_xml.get('//sd-title').text();
          page.menutitle = page_xml.get('//sd-menutitle').text();
          page.name = page_name;
        }
        catch (err)
        {
          console.log('xml error: ' + err.toString());
          page.content = page.title = 'XML ERROR';
          page.menutitle = page_name;
        }

        // delete sd-pageinfo before outputting it
        page.content = data.replace(/<sd-pageinfo>[^]+<\/sd-pageinfo>/, '');

        // put in cache
        if (!no_cache) page_cache[page_name] = page;

        var output = template.replace(/{{the_content}}/g, page.content)
                             .replace(/{{the_title}}/g, page.title)
                             .replace(/{{the_pagename}}/g, page.name);
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

exports.respondAjax = function(request, response)
{

}

// bind cache clear to SIGHUP
process.on('SIGHUP', function()
{
  template = null;
  static_cache = {};
  console.log('page cache cleared.');
});
