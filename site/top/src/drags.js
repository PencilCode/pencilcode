///////////////////////////////////////////////////////////////////////////
// DRAGS JQUERY PLUGIN
///////////////////////////////////////////////////////////////////////////

define(['jquery'], function($) {

// Use $('div').drags() to make divs draggable.
// Optional options: {handle: '.handle'} specifies a path to a draggable
// handle region. {within: '#container'} limits the dragging to a conainer.

$.fn.drags = function(opt) {
  opt = $.extend({handle:null,resize:null,within:document}, opt);
  this.each(function() {
    var $drag = $(this),
        $handle = (!opt.handle ? $drag : $drag.find(opt.handle)),
        $resize = (!opt.resize ? $() : $drag.find(opt.resize));
    // When dragging over an iframe, we need to cover the frame so that
    // mousemove events don't get routed to that frame instead of our window.
    function makesheet() {
      return $('<div></div>').css({
        position: 'fixed', top:0, left:0,
        height: $(window).height(), width: $(window).width(),
        zIndex: $drag.css('z-index')}).insertBefore($drag);
    }
    $resize.css('cursor', 'nwse-resize').on('mousedown', function(e) {
      var $within = $(opt.within),
        $sheet = makesheet(),
        offset = $drag.offset(),
        woffset = $within.offset() || { left:0, top: 0 },
        max_x = woffset.left - offset.left + $within.width(),
        max_y = woffset.top - offset.top + $within.height(),
        pos_y = $drag.height() - e.pageY,
        pos_x = $drag.width() - e.pageX,
        up_func = function() {
          $sheet.remove();
          $(window).off("mousemove", move_func).off("mouseup", up_func);
          window.dispatchEvent(new Event('resize'));
        },
        move_func = function(e) {
          window.dispatchEvent(new Event('resize'));
          if (!e.which) { console.log('e.which', e.which);  up_func(); return; }
          $drag.width(Math.max(100, Math.min(max_x, e.pageX + pos_x)))
               .height(Math.max(100, Math.min(max_y, e.pageY + pos_y)));
        };
      $drag.offset(offset);
      $(window).on("mousemove", move_func).
                on("mouseup", up_func);
      e.preventDefault(); // disable selection
    });
    $handle.css('cursor', 'move').on("mousedown", function(e) {
      var $within = $(opt.within),
        offset = $drag.offset(),
        $sheet = makesheet(),
        woffset = $within.offset() || { left:0, top: 0 },
        max_x = woffset.left + $within.width() - $drag.outerWidth(),
        max_y = woffset.top + $within.height() - $drag.outerHeight(),
        pos_y = $drag.offset().top - e.pageY,
        pos_x = $drag.offset().left - e.pageX,
        up_func = function() {
          $sheet.remove();
          $(window).off("mousemove", move_func).off("mouseup", up_func);
        },
        move_func = function(e) {
          if (!e.which) { up_func(); return; }
          $drag.offset({
            top: Math.max(woffset.top, Math.min(max_y,
                  e.pageY + pos_y)),
            left: Math.max(woffset.left, Math.min(max_x,
                  e.pageX + pos_x))
          });
        };
      $(window).on("mousemove", move_func).
                on("mouseup", up_func);
      e.preventDefault(); // disable selection
    });
  });
}

});

