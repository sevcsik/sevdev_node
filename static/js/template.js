/**
 * @fileOverview This client-side javascript is loaded on every page
 *               based on {@link template.html}.
 */

/**
 * Set up UI event handlers, and load pages when DOM is ready
 */
function onReady()
{
  // add onclick to each menu item
  $('#menu_slider > a').each(function(i, e)
  {
    $(e).click(changePage);
    var page = $(e).attr('data-page');

    if (page != page_name) // don't load active page again
      $.ajax('ajax/pages/' + page, { success: onPageLoad });
  });

  // bind browser navigation buttons to changePage
  window.onpopstate = changePage;

  // set initial history state object
  history.replaceState({ page: page_name }, page_name,
      page_name == 'root' ? '/' : page_name);
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

  // slide menu
  $('#menu').attr('class', 'focus-' + page);

  // set page_name global
  page_name = page;

  return false;
}

/**
 * Insert page content to the DOM, when it's loaded
 */
function onPageLoad(data)
{
  console.log(data);
}

$(document).ready(onReady);
