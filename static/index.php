<?php
  ini_set('display_errors', 'On');
  require_once 'site.inc.php';
  $info = bootstrap();
?>

<!DOCTYPE html>
<html>
<head>
  <title>sevdev website development</title>
  <script src="js/jquery-1.7.min.js"></script>
  <script><?php @include 'js/jquery.hashchange-1.0.0.js'; ?></script>
  <script><?php @include 'js/jquery.scrollTo-min.js'; ?></script>
  <script><?php @include 'js/jquery.transition.min.js'; ?></script>
  <script><?php @include 'js/html5.js'; ?></script>
  <script><?php @include 'js/common.js'; ?></script>
  <script><?php echo 'var info = '.json_encode($info).';'; ?></script>
  <style>
<?php
  @include 'base.css';
  @include 'telegrama/stylesheet.css';
?>
  </style>
</head>
<body>
  <div id="background_header"></div>
  <div id="background_menu"></div>
  <div id="background_content"></div>
  <div id="align">
    <header id="header">
    </header>
    <nav id="menu">
      <a href="#about">about</a>
      <a href="#contact">contact</a>
      <a href="#references">references</a>
      <div id="#menu_selector"></div>
    </nav>
    <div id="content">
      <img src="img/loading.gif" style="margin-top: 40px">
    </div>
  </div>
</body>
</html>
