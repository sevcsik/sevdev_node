<?php

//ini_set('display_errors', 'On');

class Page
{
  public $container;
  public $html;
  public $page;
  public $lang;

  function __construct($page, $lang)
  {
    $page = str_replace(array('.', '\\', '/'), '', $page);
    $lang = str_replace(array('.', '\\', '/'), '', $lang);
    $this->container = null;
    $this->page = $page;
    $this->lang = $lang;
    $this->html = @file_get_contents("content/$page.$lang.html");
    if (!$this->html)
      throw new Exception('404');
  }
}

$ret = array();
$lang = isset($_GET['lang']) ? $_GET['lang'] : 'en';

$pages = array('home', 'about', 'contact', 'references');

foreach ($pages as $page)
{
  $p = new Page($page, $lang);
  $ret[] = $p;
}

header('Content-type: application/json');
echo json_encode($ret);

?>
