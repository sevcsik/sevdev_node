/**
 * @fileOverview This client-side javascript is loaded on every page
 *               based on {@link template.html}.
 */

/**
 * This contains the cached pages
 */
var page_cache = {};

/**
 * Set up UI event handlers, load pages when DOM is ready,
 * and add additional elements
 */
function onReady()
{
  $(window).resize(resizeContentDiv);

  // bind browser navigation buttons to changePage
  window.onpopstate = changePage;

  // set initial history state object
  if (Modernizr.history)
    history.replaceState({ page: page_name }, page_name,
        page_name == 'root' ? '/' : page_name);

  // load initial page to cache (object comes from server)
  page_cache[page_name] = initial_page;

  // get initial_page.content from content element
  initial_page.content = $('#content > .page').html();

  // remove initial page and add dummy div for positioning
  $('#content .page').remove();
  $('#content').append($('<div class="page dummy"></div>'));

  // add side overlays
  $('#content').append('<div id="overlay_left"></div>');
  $('#content').append('<div id="overlay_right"></div>');

  $('#menu_slider > a').each(function(i, e)
  {
    // add onclick to each menu item
    $(e).click(changePage);
    var page = $(e).attr('data-page');

    if (page != page_name) // don't load active page again
      $.ajax('ajax/pages/' + page, { success: onPageLoad });

    // add entries in page_cache
    if (!(page in page_cache)) page_cache[page] = null;

    // insert page element to DOM
    var page_div = $('<div></div>')
      .addClass('page')
      .attr('data-page', page);

    // insert content, if it's already available (initial page)
    if (page_cache[page]) page_div.html(page_cache[page].content)
    else page_div.addClass('loading');

    // set inactive
    if (page != page_name) page_div.addClass('inactive');

    $('#content').append(page_div);
  });

  // focus on active page
  $('#content').attr('class', 'focus-' + page_name);
}

/**
 * Navigate to a different page
 */
function changePage(event)
{
  var page;

  // is it coming from onpopstate
  if (event.type == 'popstate')
  {
    // if it's fired 'cause page load, ignore
    if (!event.state) return;
    page = event.state.page;
  }
  // or onclick?
  else
  {
    page = $(event.target).attr('data-page');
    // push url into history
    if (Modernizr.history)
      history.pushState({ 'page': page }, page, page == 'root' ? '/' : page);
  }

  // set current page inactive
  $('#content [data-page="' + page_name + '"]').addClass('inactive');

  // slide menu and content
  $('#menu').attr('class', 'focus-' + page);
  $('#content').attr('class', 'focus-' + page);

  // set page_name global
  page_name = page;

  // set new page active
  $('#content [data-page="' + page_name + '"]').removeClass('inactive');

  // set page title
  if (page_cache[page])
    $('title').html('sevdev: ' + page_cache[page].title);

  resizeContentDiv();

  return false;
}

/**
 * Insert page content to the DOM, when it's loaded
 */
function onPageLoad(data)
{
  page_cache[data.name] = data;
  $('#content [data-page="' + data.name + '"]')
    .removeClass('loading')
    .html(data.content);
}

var count = 0;

/**
 * Set #content height to the current article's height
 * but fill the window
 */
function resizeContentDiv()
{
  // distance between #content's top and window's bottom
  var min_size = window.innerHeight - $('#content')[0].offsetTop;

  // current .page's height
  var content_size =
    $('#content > [data-page="' + page_name + '"]')[0].offsetHeight;

  $('#content')[0].style.height =
    (min_size > content_size ? min_size : content_size) + 'px';
}

$(document).ready(onReady);
$(document).ready(resizeContentDiv);
