// Original source: recolor.coffee

(function() {
var global, __iced_k, __iced_k_noop;

__iced_k = __iced_k_noop = function() {};

global = window;

global.recolor = function(urls, fn) {
  var a, args, b, d, data, dopixel, dx, dy, i, imd, maxheight, maxwidth, moment, out, s, sec, sprites, url, x, xx, y, yy, ___iced_passed_deferral, __iced_deferrals, __iced_k, _begin, _end, _positive;
  __iced_k = __iced_k_noop;
  ___iced_passed_deferral = iced.findDeferral(arguments);
  if ((fn == null) && _.isFunction(urls)) {
    fn = urls;
    urls = null;
  }
  if (urls == null) {
    urls = [];
  }
  if (_.isString(urls)) {
    args = Array.prototype.slice.call(arguments, 0);
    if (_.isFunction(args[args.length - 1])) {
      fn = args.pop();
    }
    urls = args;
  }
  if (!_.isFunction(fn)) {
    fn = _.identity;
  }
  turtle.speed(Infinity);
  wear({
    width: 0,
    height: 0
  });
  if (urls.length > 1) {
    label('...', {
      zIndex: 3,
      color: white,
      font: '20px sans-serif',
      textShadow: '0px 0px 7px black',
      turtleSpeed: Infinity,
      id: 'recolorlabel'
    });
  }
  turtle.speed('turtle');
  sec = function(fn) {
    return setTimeout(fn, 1000);
  };
  moment = function(fn) {
    return setTimeout(fn, 0);
  };
  sprites = [];
  data = [];
  (function(_this) {
    return (function(__iced_k) {
      var _i, _len, _ref, _results, _while;
      _ref = urls;
      _len = _ref.length;
      _i = 0;
      _results = [];
      _while = function(__iced_k) {
        var _break, _continue, _next;
        _break = function() {
          return __iced_k(_results);
        };
        _continue = function() {
          return iced.trampoline(function() {
            ++_i;
            return _while(__iced_k);
          });
        };
        _next = function(__iced_next_arg) {
          _results.push(__iced_next_arg);
          return _continue();
        };
        if (!(_i < _len)) {
          return _break();
        } else {
          url = _ref[_i];
          s = new Sprite({
            width: 0,
            height: 0
          });
          s.speed(Infinity);
          s.css({
            zIndex: 2
          });
          s.wear(url);
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              funcname: "recolor"
            });
            s.done(__iced_deferrals.defer({
              lineno: 62
            }));
            __iced_deferrals._fulfill();
          })(function() {
            var _j, _ref1;
            d = s.imagedata();
            b = d.data;
            d.channels = 1;
            for (i = _j = 0, _ref1 = b.length; _j < _ref1; i = _j += 4) {
              if (abs(b[i] - b[i + 1]) > 3 || abs(b[i] - b[i + 2]) > 3) {
                d.channels = 3;
              }
              if (b[i + 3] < 255) {
                d.alpha = true;
              }
            }
            if (d.alpha && d.channels === 3) {
              d.channels = 4;
            }
            sprites.push(s);
            data.push(d);
            $('#recolorlabel').text(url.split('/').pop() + (": " + d.width + "x" + d.height + "x" + d.channels));
            $('#recolorlabel').moveto(window);
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                funcname: "recolor"
              });
              sec(__iced_deferrals.defer({
                lineno: 84
              }));
              __iced_deferrals._fulfill();
            })(_next);
          });
        }
      };
      _while(__iced_k);
    });
  })(this)((function(_this) {
    return function() {
      var _i, _len;
      maxheight = max(64, _.max(_.map(sprites, function(s) {
        return s.height();
      })));
      maxwidth = max(64, _.max(_.map(sprites, function(s) {
        return s.width();
      })));
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        d = data[_i];
        d.xoff = floor((maxwidth - d.width) / 2);
        d.yoff = floor((maxheight - d.height) / 2);
      }
      out = turtle;
      out.wear({
        width: maxwidth,
        height: maxheight
      });
      out.css({
        zIndex: 5
      });
      a = (function() {
        var _j, _ref, _results;
        _results = [];
        for (_j = 0, _ref = maxheight * maxwidth * 4; 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--) {
          _results.push(0);
        }
        return _results;
      })();
      dopixel = function(x, y) {
        var c, inputs, j, loc, result, _j, _k, _l, _len1, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _results;
        inputs = [];
        for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
          d = data[_j];
          for (c = _k = 0, _ref = d.channels; 0 <= _ref ? _k < _ref : _k > _ref; c = 0 <= _ref ? ++_k : --_k) {
            if ((d.xoff <= x && x < d.xoff + d.width) && (d.yoff <= y && y < d.yoff + d.height)) {
              inputs.push(d.data[c + 4 * (x - d.xoff + (y - d.yoff) * d.width)]);
            } else {
              inputs.push(0);
            }
          }
        }
        result = fn.apply(null, inputs);
        if ($.isNumeric(result)) {
          result = [result];
        }
        if ($.isPlainObject(result)) {
          result = [(_ref1 = (_ref2 = result.red) != null ? _ref2 : result.r) != null ? _ref1 : 0, (_ref3 = (_ref4 = result.green) != null ? _ref4 : result.g) != null ? _ref3 : 0, (_ref5 = (_ref6 = result.blue) != null ? _ref6 : result.b) != null ? _ref5 : 0, (_ref7 = (_ref8 = result.alpha) != null ? _ref8 : result.a) != null ? _ref7 : 255];
        }
        while (result.length < 3) {
          result.push(result[0] || 0);
        }
        if (result.length < 4) {
          result.push(255);
        }
        result.length = 4;
        loc = (y * maxwidth + x) * 4;
        _results = [];
        for (j = _l = 0; _l < 4; j = ++_l) {
          _results.push(a[loc + j] = min(255, max(0, round(result[j]))));
        }
        return _results;
      };
      (function(__iced_k) {
        var _j, _results, _while;
        yy = 0;
        _begin = 0;
        _end = maxheight;
        _positive = _end > _begin;
        _results = [];
        _while = function(__iced_k) {
          var _break, _continue, _next;
          _break = function() {
            return __iced_k(_results);
          };
          _continue = function() {
            return iced.trampoline(function() {
              if (_positive) {
                yy += 64;
              } else {
                yy -= 64;
              }
              return _while(__iced_k);
            });
          };
          _next = function(__iced_next_arg) {
            _results.push(__iced_next_arg);
            return _continue();
          };
          if (!!((_positive === true && yy >= maxheight) || (_positive === false && yy <= maxheight))) {
            return _break();
          } else {

            (function(__iced_k) {
              var _k, _results1, _while;
              xx = 0;
              _begin = 0;
              _end = maxwidth;
              _positive = _end > _begin;
              _results1 = [];
              _while = function(__iced_k) {
                var _break, _continue, _l, _m, _next;
                _break = function() {
                  return __iced_k(_results1);
                };
                _continue = function() {
                  return iced.trampoline(function() {
                    if (_positive) {
                      xx += 64;
                    } else {
                      xx -= 64;
                    }
                    return _while(__iced_k);
                  });
                };
                _next = function(__iced_next_arg) {
                  _results1.push(__iced_next_arg);
                  return _continue();
                };
                if (!!((_positive === true && xx >= maxwidth) || (_positive === false && xx <= maxwidth))) {
                  return _break();
                } else {

                  for (dy = _l = 0; _l < 64; dy = ++_l) {
                    y = yy + dy;
                    if (y >= maxheight) {
                      continue;
                    }
                    for (dx = _m = 0; _m < 64; dx = ++_m) {
                      x = xx + dx;
                      if (x >= maxwidth) {
                        continue;
                      }
                      dopixel(x, y);
                    }
                  }
                  imd = {
                    width: maxwidth,
                    height: maxheight,
                    data: a
                  };
                  out.imagedata(imd);
                  (function(__iced_k) {
                    __iced_deferrals = new iced.Deferrals(__iced_k, {
                      parent: ___iced_passed_deferral,
                      funcname: "recolor"
                    });
                    moment(__iced_deferrals.defer({
                      lineno: 151
                    }));
                    __iced_deferrals._fulfill();
                  })(_next);
                }
              };
              _while(__iced_k);
            })(_next);
          }
        };
        _while(__iced_k);
      })(function() {
        remove($('#recolorlabel'), sprites);
        return speed(1);
      });
    };
  })(this));
};

})();
