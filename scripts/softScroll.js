$(document).ready(function()
{
  $("a[href*='#']").on("click", function(e)
  {
    const anchorElement = $(this);
    $("html, body").stop().animate(
    {
      scrollTop: $(anchorElement.attr("href")).offset().top
    }, 555);
    e.preventDefault();
    return false;
  });
});
