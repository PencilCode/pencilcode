///////////////////////////////////////////////////////////////////////////
// Arrow Support to Create Code-flow Arrows.
// The following functions generate the svg necessary to display 
// arrows on the code.
///////////////////////////////////////////////////////////////////////////
var $              = require('jquery');


function curvedVertical(x1, y1, x2, y2) {
 
  y2 = y2 - 12;
  
  x1 = parseFloat(x1);
  y1 = parseFloat(y1);
  x2 = parseFloat(x2);
  y2 = parseFloat(y2);
  var radius = Math.abs(y1 - y2);

  return 'M'+ x1 + "," + y1 + " " + 'A'+ radius + "," + radius + " 1 0,1 " + x2 + "," + y2;
};

function drawArrow(show_fade, startcoords, endcoords, x_val, offset_left, offset_top, block_mode){
  /* Given the coordinates and offsets, arrows are drawn with an svg path element that creates an 
  upward left-facing curve to the right of the blocks/text code from the previous line of code that ran 
  to the current line that's running. Note that arrows are drawn on the condition that there's an out of order
  flow in lines of code. i.e., line 5 runs and then line 2 runs. */


  if (show_fade) {
    arrowtext = "<path stroke-linecap='square' d='" + curvedVertical(x_val + offset_left, (startcoords.pageY - offset_top), x_val 
    			+ offset_left, (endcoords.pageY - offset_top)) 
                + "' marker-start='url(#arrowhead2)' style='stroke:#8EC8FF;fill:none; stroke-width:4' position='relative'/> \ "
  } else{
    arrowtext = "<path stroke-linecap='square' d='" + curvedVertical(x_val + offset_left, (startcoords.pageY - offset_top), x_val + offset_left, (endcoords.pageY - offset_top)) 
                        + "' marker-start='url(#arrowhead1)' style='stroke:dodgerblue; fill:none; stroke-width:4' position='relative'/> \ "
  } 

  var text = "<svg class= 'arrow' width=" 
            + $(".editor").width() + " height=" + $(".editor").height() 
            + "  viewBox='0 0 " + $('.editor').width() +" " + $('.editor').height() +"'> \
            <marker id='arrowhead1' markerWidth='10' markerHeight='10' orient='auto-start-reverse'\
             refX='0' refY='2.5' style='stroke:dodgerblue; fill:dodgerblue; stroke-linejoin: miter; \
             stroke-width:0px;' markerUnits='strokeWidth' > <polygon points='0,0 5,2.5 0,5'/>  \
            </marker> <marker id='arrowhead2' markerWidth='10' markerHeight='10' orient='auto-start-reverse'\
             refX='0' refY='2.5' style='stroke:#8EC8FF; fill:#8EC8FF; stroke-linejoin: miter; stroke-width:0px;' 
             markerUnits='strokeWidth' > \ <polygon points='0,0 5,2.5 0,5'/> \
            </marker>  \ " + arrowtext +  "</svg> ";
    
    var div = document.createElement('div');
    div.className =  "arrow";
    div.innerHTML = text;
    div.style.visibility = 'visible';
    div.style.position = "absolute";
    div.style.zIndex = "10";
    div.style.left = "0px";
    div.style.top = "0px";

    if (block_mode) {
       $("div[id^='editor_'] .droplet-main-scroller").append(div);
    } else {
       $("div[id^='editor_']").append(div);
    }
};

module.exports = {drawArrow : drawArrow};