var content = new Object;
var current_content;

if ($.browser.webkit) TRANSITION_END = "webkitTransitionEnd";
else if ($.browser.mozilla) TRANSITION_END = "transitionend";
else if ($.browser.opera) TRANSITION_END = "oTransitionEnd";

$(document).ready(function()
{
  $(document).hashchange(function()
  {
    $('body').scrollTo($('#menu'), {duration: 500});
    switch_content();
  });

  $.ajax('content.php',
    {
      data: { lang: info.lang },
      success: function(data, status, xhr)
      {
        load_content(data);
      },
    }
  );
});

function switch_content()
{
  hash = location.hash.replace('#', '');
  if (hash == current_content.page) return;

  current_content.container.removeClass('visible');
  current_content.container.addClass('hidden_left');
  current_content.container[0].addEventListener(TRANSITION_END, function()
  {
    $(this).hide();
    $(this).removeClass('hidden_left');
  });

  current_content = content[hash];
  current_content.container.show().addClass('visible');
}

function load_content(data)
{
  hash = location.hash.replace('#', '');
  if (!hash) hash = 'home';

  $('#content').html('');
  for (i = 0; i < data.length; i++)
  {
    data[i].container =
      $('<div id="page_' + data[i].page + '" class="page">');
    data[i].container.html(data[i].html);
    $('#content').append(data[i].container);

    content[data[i].page] = data[i];
  }
  $('#content .page').hide();

  current_content = content[hash];
  current_content.container.show().addClass('visible');
}


