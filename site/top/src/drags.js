///////////////////////////////////////////////////////////////////////////
// DRAGS JQUERY PLUGIN
///////////////////////////////////////////////////////////////////////////

define(['jquery'], function($) {

// Use $('div').drags() to make divs draggable.
// Optional options: {handle: '.handle'} specifies a path to a draggable
// handle region. {within: '#container'} limits the dragging to a conainer.
// {cursor: "move"} specifies the cursor style for the handle.

$.fn.drags = function(opt) {
  opt = $.extend({handle:null,cursor:"move",within:document}, opt);
  this.each(function() {
    var $drag = $(this),
        $handle = (!opt.handle ? $drag : $drag.find(opt.handle));
    $handle.css('cursor', opt.cursor).on("mousedown", function(e) {
      if ($handle != $drag) {
        $handle.addClass('active-handle');
      }
      $drag.addClass('draggable');
      var z_idx = $drag.css('z-index'),
        $within = $(opt.within),
        min_x = ($within.offset() || { left: 0 }).left,
        min_y = ($within.offset() || { left: 0 }).left,
        max_x = min_x + $within.width() - $drag.outerWidth(),
        max_y = min_y + $within.height() - $drag.outerHeight(),
        pos_y = $drag.offset().top - e.pageY,
        pos_x = $drag.offset().left - e.pageX,
        up_func = function() {
          if ($handle != $drag) {
            $handle.removeClass('active-handle');
          }
          $drag.removeClass('draggable').css('z-index', z_idx);
          $(window).off("mousemove", move_func).
                off("mouseup", up_func);
        },
        move_func = function(e) {
          if (!e.which) { up_func(); }
          else {
            $drag.offset({
              top: Math.max(min_y, Math.min(max_y,
                    e.pageY + pos_y)),
              left: Math.max(min_x, Math.min(max_x,
                    e.pageX + pos_x))
            });
          }
        };
      $drag.css('z-index', 1000);
      $(window).on("mousemove", move_func).
                on("mouseup", up_func);
      e.preventDefault(); // disable selection
    });
  });
}

});

