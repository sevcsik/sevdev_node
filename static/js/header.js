/**
 * @fileOverview This client-side javascript manipulates the svg embed in
 * #header.
 */

/**
 * Global to store a reference to header SVGDocument
 */
var header_svg = null;
var $header_svg = null;


/**
 * Initialize header SVG, hide unwanted nodes, assign events, etc.
 * Bound to #header > svg[onload]
 */
function initHeader(svg)
{
  header_svg = svg;
  $header_svg = $(svg);

  // hide hover backgrounds
  $header_svg.find('[id$="activebg"]').hide();

  // add menu event handlers
  for (var i = 0; i < 5; i++)
  {
    $header_svg.find('[id="item' + i + '_bg"]').hover(headerItemOnhover);
    $header_svg.mouseleave(headerOnmouseleave);
  }
}

function headerClippathAnimate()
{
  x = headerClippathAnimate.x;

  var $clippath = $header_svg.find('#activebg_clippath');
  d = headerClippathAnimate.d;

  if (x === undefined) x = 0;
  if (d === undefined) d = -80;

  if ((d < 0 && x > -1200) || (d > 0 && x < 0))
  {
    x += d;
    // move clippath by x
    $clippath.attr('transform', 'translate(' + x + ', 0)');
    // save x
    headerClippathAnimate.x = x;
    headerClippathAnimate.handle = setTimeout(headerClippathAnimate, 40);
  }
}

function headerItemOnhover(event)
{
  var target = event.delegateTarget;
  $(target).hide();
  var activebg = header_svg.getElementById(target.id.replace('bg', 'activebg'));
  // hide previous activebgs
  // FIXME: use classes instead of id substrings
  $header_svg.find('[id$="activebg"]').not('#' + activebg.id).hide();
  $(activebg).show();

  // start clippath animation
  headerClippathAnimate.d = -80;
  clearTimeout(headerClippathAnimate.handle);
  headerClippathAnimate.handle = setTimeout(headerClippathAnimate, 40);;

  header_svg.activeItem = target;
}

function headerOnmouseleave(event)
{
  headerClippathAnimate.d = 80;
  clearTimeout(headerClippathAnimate.handle);
  headerClippathAnimate.handle = setTimeout(headerClippathAnimate, 40);;
  $(header_svg.activeItem).show();
}
