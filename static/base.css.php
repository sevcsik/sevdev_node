<?php

ini_set('display_errors', 'On');
require_once 'csstools.inc.php';

$base = '#fffff';
$link = '#95cfe6';

$menu_base = '#ffffff';
$menu_hl = '#95cfe6';

?>

nav, article, header
{
  display: block;
}

*
{
  margin: 0px;
  padding: 0px;
}

*:link
{
  text-decoration: none;
  border: 0px;
}

body
{
  background: #7b7b7b;
}

#background_header
{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 350px;
  background-color: black;
  z-index: -2;
}

#background_menu
{
  position: absolute;
  top: 350px;
  left: 0px;
  width: 100%;
  height: 50px;
  z-index: -1;
  box-shadow: 0px 0px 20px black;

  <?php grad_simple_vertical('#3b3b3b', '#797979') ?>
}

#background_content
{
  position: absolute;
  top: 401px;
  height: 400px;
  left: 0px;
  width: 100%;
  z-index: -2;

  <?php grad_simple_vertical('#3a3a3a', '#7b7b7b') ?>
}

#align
{
  width: 960px;
  margin: auto;
  min-height: 1600px;
  position: relative;
  background: url(img/header_bg.png) center top no-repeat;;
  padding-top: 400px;
}

#menu
{
  position: absolute;
  left: 0px;
  top: 351px;
  height: 50px;
  background: bottom repeat-x;
  background-image: url(img/menu_selector_bg.png);
  width: 100%;
}

#menu a
{
  line-height: 50px;
  height: 50px;
  color: <?php echo $menu_base ?>;
  font-family: 'TelegramaRender', Arial;
  font-size: 18px;
  padding: 0px 20px;
  text-shadow: 0px -1px 1px black;

  <?php transition_single('color 0.5s linear')?>;
}

#menu a:hover
{
  color: <?php echo $menu_hl ?>;

  <?php transition_single('color 0.5s linear')?>;
}

#menu_selector
{
  position: absolute;
  bottom: 0px;
  left: 0px;
  height: 5px;
  width: 50px;
  background: bottom repeat-x;
  background-image: url(img/menu_selector_fg.png);
}

#content
{
  padding: 10px;
  text-align: center;
  position: relative;
}

#content .page
{
  position: absolute;
  width: 100%;
  left: 150px;
  opacity: 0;
}

#content .visible
{
  left: 0px;
  opacity: 1;
  <?php transition_multiple(array('opacity', 'left'), '0.5s', 'ease-in'); ?>
}

#content .hidden_left
{
  left: -150px;
  opacity: 0;
  <?php transition_multiple(array('opacity', 'left'), '0.5s', 'ease-in'); ?>
}

