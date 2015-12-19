!function(a) {
    function b() {
        a(".right-click-menu").css("display", "none"), a(".right-click-active").removeClass("right-click-active");
    }
    !function() {
        function a(a, b) {
            var c = a.srcElement || a.target;
            if (c.classList.contains(b)) return c;
            for (;c = c.parentNode; ) if (c.classList && c.classList.contains(b)) return c;
            return !1;
        }
        !function() {
            document.addEventListener("click", function(c) {
                var d = a(c, "right-click-menu");
                d || b();
            });
        }(), function() {
            window.onkeyup = function(a) {
                27 === a.keyCode && b();
            };
        }(), function() {
            window.onresize = function(a) {
                b();
            };
        }();
    }(), a.fn.extend({
        hasScrollBar: function() {
            return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : !1;
        },
        addRightClickMenu: function(c) {
            this.each(function() {
                function d(b) {
                    var c = a("<ul/>", {
                        class: "menu-list"
                    });
                    return b.forEach(function(b) {
                        var e = a("<li/>", {
                            class: "menu-item"
                        }).appendTo(c), f = a("<div/>", {
                            class: "menu-item-content"
                        }).appendTo(e), g = a("<a/>", {
                            text: b.name
                        }).appendTo(f);
                        g.on("click", function(a) {}), b.options && (f.append(d(b.options)), f.append(a("<span/>", {
                            class: "left-icon"
                        }).append(a("<a/>", {
                            class: "more-options-icon"
                        }).append(a("<i/>", {
                            class: "fa fa-caret-right"
                        })))));
                    }), c;
                }
                function e() {
                    var c = a(".right-click-menu");
                    return 0 == c.length && (c = a("<div/>", {
                        class: "right-click-menu"
                    }).appendTo(a("body"))), c.on("mouseleave", function() {
                        b();
                    }), c;
                }
                a(this).on("contextmenu", function(f) {
                    b();
                    var g, h;
                    a(this).addClass("right-click-active");
                    var i = e();
                    i.html(d(c));
                    var j = f.pageX, k = f.pageY, l = i.offsetWidth + 4, m = i.offsetHeight + 4, n = window.innerWidth, o = window.innerHeight;
                    g = l > n - j ? n - l + "px" : j + "px", h = m > o - k ? o - m + "px" : k + "px", 
                    a(i).css("display", "block").css("left", g).css("top", h), f.preventDefault();
                });
            });
        }
    });
}(jQuery);