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
  $(window).resize(resizeInactive);

  // bind browser navigation buttons to changePage
  window.onpopstate = changePage;

  // set initial history state object
  if (Modernizr.history) {
    history.replaceState({ page: page_name }, page_name,
        page_name === 'root' ? '/' : page_name);
  }

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

  // set onclick handlers to menu items
  $('#menu_slider > a').each(function(i, e)
  {
    // add onclick to each menu item
    $(e).click(changePage);
    var page = $(e).attr('data-page');

    if (page !== page_name) { // don't load active page again
      $.ajax('ajax/pages/' + page, { success: onPageLoad });
    }

    // add entries in page_cache
    if (page_cache[page] === undefined) {
      page_cache[page] = null;
    }

    // insert page element to DOM
    var page_div = $('<div></div>')
      .addClass('page')
      .attr('data-page', page);

    // insert content, if it's already available (initial page)
    if (page_cache[page]) {
      page_div.html(page_cache[page].content);
    } else { 
      page_div.addClass('loading');
    }

    // set inactive
    if (page !== page_name) {
      page_div.addClass('inactive');
    }

    $('#content').append(page_div);
  });

  // set onclick handlers to inline page links
  $('a[data-page]').click(changePage);
}

/**
 * Navigate to a different page
 */
function changePage(event)
{
  var page;
  var $content = $('#content');
  var $page = $content.find('.page[data-page="' + page_name + '"]');

  // is it coming from onpopstate
  if (event.type === 'popstate') {
    // if it's fired 'cause page load, ignore
    if (!event.state) {
      return;
    }
    page = event.state.page;
  }
  // or onclick?
  else
  {
    page = $(event.target).attr('data-page');
    // push url into history
    if (Modernizr.history) {
      history.pushState({ 'page': page }, page, 
                        page === 'root' ? '/' : page);
    }

    if (ga) ga('send', 'pageview', page === 'root' ? '/' : page);
  }

  // set current page inactive
  $page.addClass('inactive');

  // slide menu and content
  var pageIndex = $('#menu *').index($('[data-page="' + page));
  $('#menu').attr('class', 'focus-' + pageIndex);
  $content.attr('class', 'focus-' + pageIndex);

  // set page_name global
  page_name = page;
  // update
  $page = $content.find('.page[data-page="' + page_name + '"]');

  // set new page active
  $page.removeClass('inactive');

  // set page title
  if (page_cache[page]) {
    $('title').html('sevdev: ' + page_cache[page].title);
  }

  // clip inactive pages when the transition is complete
  $content.on('transitionend', resizeInactive)
    .on('webkitTransitionEnd', resizeInactive)
    .on('oTransitionEnd', resizeInactive);

  // remove previously forced height
  $page.css('height', 'auto').css('overflow', 'visible');

  event.preventDefault();
}

/**
 * Set #content height to the current article's height
 * but fill the window, and clip inactive pages
 */
function resizeInactive(event)
{
  var $content = $('#content');
  var $page = $content.find('.page[data-page="' + page_name + '"]');

  // distance between #content's top and window's bottom
  var min_size = window.innerHeight - $content.prop('offsetTop');

  // current .page's height
  var content_size = $page.children().prop('offsetHeight');

  var height = min_size > content_size ? min_size : content_size;
  $('#content').css('height', height + 'px');

  // clip inactive pages
  $content.find('.page.inactive')
    .css('height', height + 'px')
    .css('overflow', 'hidden');

  if (event) {
    $content.unbind(event);
  }
}


/**
 * Insert page content to the DOM, when it's loaded
 */
function onPageLoad(data)
{
  page_cache[data.name] = data;
  $('#content > [data-page="' + data.name + '"]')
    .removeClass('loading')
    .html(data.content)
    // Update inline navigation links
    .find('a[data-page]')
    .click(changePage);

  resizeInactive();
}

var count = 0;

$(document).ready(onReady);
