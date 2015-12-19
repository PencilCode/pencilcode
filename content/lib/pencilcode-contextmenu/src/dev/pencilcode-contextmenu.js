(function($) {

    function clearRightClickMenus(){
      $('.right-click-menu').css('display','none');
      $('.right-click-active').removeClass('right-click-active');
    }



    //Listeners tomanage Right CLick Menu
    (function (){
      function clickInsideElement( e, className ) {
        var el = e.srcElement || e.target;
        
        if ( el.classList.contains(className) ) {
          return el;
        } else {
          while ( el = el.parentNode ) {
            if ( el.classList && el.classList.contains(className) ) {
              return el;
            }
          }
        }

        return false;
      }
      
      //Listens for click events.
      (function () {
        document.addEventListener( "click", function(e) {
          var clickeElIsLink = clickInsideElement( e, 'right-click-menu' );

          if ( !clickeElIsLink ) {
              clearRightClickMenus();
          }
        });
      })();

      //Listens for keyup events.
      (function () {
        window.onkeyup = function(e) {
          if ( e.keyCode === 27 ) {
            clearRightClickMenus();
          }
        }
      })();

      //Window resize event listener
      (function () {
        window.onresize = function(e) {
          clearRightClickMenus();
        };
      })();
    })();


  /*  $(document).ready(function () {
      $('.right-click-menu').on('mouseenter', function(){
          console.log("Mouse enter");
          //mouseOverActiveElement = true; 
      }).on('mouseleave', function(){ 
          console.log("Mouse leave");
          //mouseOverActiveElement = false; 
          //clearRightClickMenus();
      }).on('focus', function(){ 
          console.log("Mouse focus");
          //mouseOverActiveElement = false; 
          //clearRightClickMenus();
      }).on('focusout', function(){ 
          console.log("Mouse focusout");
          //mouseOverActiveElement = false; 
          //clearRightClickMenus();
      }).on('blur', function(){ 
          console.log("Mouse blur");
          //mouseOverActiveElement = false; 
          //clearRightClickMenus();
      }).on('click', function(){ 
          console.log("Mouse click");
          //mouseOverActiveElement = false; 
          //clearRightClickMenus();
      })
    });*/

    $.fn.extend({
      addRightClickMenu:function(menus){
        this.each(function() {
          function getMenu(menus) {
            var menu=$('<ul/>', {class: 'menu-list'});
            menus.forEach(function(m) {
              var li=$('<li/>',{class:'menu-item'}).appendTo(menu);
              var menuContent = $('<div/>', {class:'menu-item-content'}).appendTo(li);
              var menuLink=$('<a/>',{text:m.name}).appendTo(menuContent);
              li.on('click',function(e){
                e.stopPropagation();
                e.preventDefault();
                m.action(e);
              });
              
              if(m.options) {
                menuContent.append(getMenu(m.options));
                menuContent.append(
                  $('<span/>', {class: "left-icon"}).append(
                    $('<a/>',{class:"more-options-icon"}).append(
                      $('<i/>',{class:"fa fa-caret-right"})
                      )
                    )
                  );
              }
            });
            return menu;
          }
          
          function getRightClickMenuDiv(){
            var rightClickMenuDiv = $('.right-click-menu');
            if(rightClickMenuDiv.length==0){
              rightClickMenuDiv=$('<div/>',{class:"right-click-menu"}).appendTo($('body'));
            }
            rightClickMenuDiv.on('mouseleave', function(){ 
                //console.log("Mouse leave");
                clearRightClickMenus();
            });
            return rightClickMenuDiv;
          }
          
          $(this).on('contextmenu', function(e) {
            e.stopPropagation();
            e.preventDefault();

            clearRightClickMenus();
            var left, top;

            $(this).addClass('right-click-active');
            var menu=getRightClickMenuDiv();
            menu.html(getMenu(menus));

            var clickCoordsX = e.pageX;
            var clickCoordsY = e.pageY;
            var menuWidth = menu.offsetWidth + 4;
            var menuHeight = menu.offsetHeight + 4;
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;

            if ( (windowWidth - clickCoordsX) < menuWidth) {
              left = windowWidth - menuWidth + "px";
            } else {
              left = clickCoordsX + "px";
            }

            if ((windowHeight - clickCoordsY) < menuHeight) {
              top = windowHeight - menuHeight + "px";
            } else {
              top = clickCoordsY + "px";
            }

            $(menu).css('display', 'block')
              .css('left',left)
              .css('top',top);

            e.preventDefault();
          });
        });
      }
    });
})(jQuery);