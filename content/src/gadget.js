///////////////////////////////////////////////////////////////////////////
// GADGET WINDOW UTILITY
///////////////////////////////////////////////////////////////////////////

var $ = require('jquery');


function makesheet(item) {
  return $('<div></div>').css({
    position: 'fixed', top:0, left:0,
    height: $(window).height(), width: $(window).width(),
    zIndex: item.css('z-index')}).insertBefore(item);
}

$('body').on('click',
    '.gadget .topbar button, .gadget .topbar .closer', toggle);

function toggle(e) {
  var $this = $(this).closest('.gadget'),
      $window = $(window);
  if ($this.is(':animated') || $this.data('moved')) return;
  if ($this.hasClass('minimized')) {
    $this.data('minleft', $this.position().left);
    $this.data('mintop', $this.position().top);
    var goal = {
      height: $this.data('height') || 200,
      width: $this.data('width') || 200,
      left: $this.position().left - 10,
      top: $this.position().top - 8
    };
    goal.left = Math.max(0, Math.min(goal.left,
        $window.width() - goal.width));
    goal.top = Math.max(0, Math.min(goal.top,
        $window.height() - goal.height));
    $this.animate(goal);
    $this.find('.topbar').animate({
      'padding-left': 10, 'padding-top': 8});
    $this.removeClass('minimized');
  } else {
    $this.data('height', $this.height());
    $this.data('width', $this.width());
    $this.animate({
      height: $this.find('.topbar button').outerHeight(),
      width: $this.find('.topbar button').outerWidth(),
      left: $this.data('minleft') != null ?
            $this.data('minleft') :
            $this.position().left + 10,
      top: $this.data('mintop') != null ?
           $this.data('mintop') :
           $this.position().top + 8
    });
    $this.find('.topbar').animate({
      'padding-left': 0, 'padding-top': 0});
    $this.addClass('minimized');
  }
}

$('body').on('mousedown', '.gadget .topbar', function(e) {
  var $window = $(window),
      $drag = $(this).closest('.gadget'),
      offset = $drag.offset(),
      $sheet = makesheet($drag),
      start_t = (new Date).getTime(),
      max_x = $window.width() - $drag.outerWidth(),
      max_y = $window.height() - $drag.outerHeight(),
      pos_y = $drag.offset().top - e.pageY,
      pos_x = $drag.offset().left - e.pageX,
      up_func = function(e) {
        $sheet.remove();
        $window.off("mousemove", move_func)
               .off("mouseup", up_func);
      },
      move_func = function(e) {
        if (!e.which) { up_func(); return; }
        $drag.offset({
          top: Math.max(0, Math.min(max_y,
                e.pageY + pos_y)),
          left: Math.max(0, Math.min(max_x,
                e.pageX + pos_x))
        });
        var t = (new Date).getTime();
        if (t - start_t > 200) {
          $drag.data('moved', t);
          $drag.data('minleft', null);
          $drag.data('mintop', null);
        }
      };
    $drag.data('moved', null);
    $window.on("mousemove", move_func)
           .on("mouseup", up_func);
    e.preventDefault(); // disable selection
})

$('body').on('mousedown', '.gadget .sizer', function(e) {
  var $window = $(window),
      $drag = $(this).closest('.gadget'),
      $sheet = makesheet($drag),
      offset = $drag.offset(),
      max_x = $window.width() - offset.left,
      max_y = $window.height() - offset.top,
      pos_y = $drag.height() - e.pageY,
      pos_x = $drag.width() - e.pageX,
      up_func = function() {
        $sheet.remove();
        $(window).off("mousemove", move_func).off("mouseup", up_func);
        window.dispatchEvent(new Event('resize'));
      },
      move_func = function(e) {
        window.dispatchEvent(new Event('resize'));
        $drag.width(Math.max(150, Math.min(max_x, e.pageX + pos_x)))
             .height(Math.max(50, Math.min(max_y, e.pageY + pos_y)));
      };
    if ($drag.hasClass('minimized')) return;
    $drag.offset(offset);
    $(window).on("mousemove", move_func).
              on("mouseup", up_func);
    e.preventDefault(); // disable selection
});

$('body').on('expand', '.gadget', function(e) {
  $this = $(this);
  if ($this.hasClass('minimized')) {
    toggle.call(this, e);
  }
});

function addGadget(id, opts) {
  var result = $(
    '<div class="gadget"' +
    (id ? ' id="' + id + '">' : '>') +
    '<div class="topbar">' +
    '<button>' + (opts.name || opts.id || 'Gadget') + '</button>' +
    '<div class="closer"></div>' +
    '</div>' +
    '<div class="body"></div>' +
    '<div class="sizer"></div>' +
    '</div>');
  if (opts.width) result.data('width', opts.width);
  if (opts.height) result.data('height', opts.height);
  var css = {};
  if (opts.minimized) {
    result.addClass('minimized');
  } else {
    if (opts.width) css.width = opts.width;
    if (opts.height) css.height = opts.height;
  }
  if (opts.top != null) css.top = opts.top;
  if (opts.left != null) css.left = opts.left;
  if (opts.content) {
    result.find('.body').append(opts.content);
  }
  return result.css(css).appendTo('body');
}

module.exports =  { addGadget: addGadget };

