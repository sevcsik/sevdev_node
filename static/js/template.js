/**
 * @fileOverview This client-side javascript is loaded on every page
 *               based on {@link template.html}.
 */

/**
 * This contains the cached pages
 */
var page_cache = {};

/**
 * Set up UI event handlers, and load pages when DOM is ready
 */
function onReady()
{
  // bind browser navigation buttons to changePage
  window.onpopstate = changePage;

  // set initial history state object
  history.replaceState({ page: page_name }, page_name,
      page_name == 'root' ? '/' : page_name);

  // load initial page to cache (object comes from server)
  page_cache[page_name] = initial_page;

  // get initial_page.content from content element
  initial_page.content = $('#content > .page').html();

  $('#content').html('');

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
  if (event instanceof PopStateEvent)
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

$(document).ready(onReady);
