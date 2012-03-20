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
  $(header_svg).find('[id$="activebg"]').hide();
}


