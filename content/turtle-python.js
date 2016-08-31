// Derived from code in the Brython project:
//
// Copyright (c) 2012, Pierre Quentel pierre.quentel@gmail.com
// All rights reserved.

;var ___MINIMAL_TEST___ = { };

document.addEventListener('DOMContentLoaded', function($myInstance){
(function($myInstance) {

  function ajaxRequest(url) {
    var data;

    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
      var xmlhttp=new XMLHttpRequest();
    }
    else { // code for IE6, IE5
      var xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
      var state = this.readyState
      if(state===4) {
        data = xmlhttp.responseText
      }
    }

    xmlhttp.open('GET', url, false)
    xmlhttp.send()
    if (xmlhttp.status != 200) {
      var msg = "can't open file '" + url
      msg += "': No such file or directory"
      console.log(msg)
      return
    }
    return data;
  }

  function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
      throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
  }

  function executePython(payload, outputElement, canvasElement) {
    function outputFunction(text) { outputElement.innerHTML += text; }

    Sk.configure({output:outputFunction, read:builtinRead});
    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = canvasElement.id;
    pyPencilCode = ajaxRequest("/lib/pencilcode.py");
    payload = pyPencilCode + payload;

    var myPromise = Sk.misceval.asyncToPromise(function() {
      return Sk.importMainWithBody("<stdin>", false, payload, true);
    });

    myPromise.then(function(mod) {}, function(err) { console.log(err.toString()); });
  }

  var myPre = document.createElement("PRE");
  var myCanvas = document.createElement("DIV");
  var myCanvasId = "minimal_canvas_div";

  document.body.appendChild(myPre);
  document.body.appendChild(myCanvas);
  myCanvas.setAttribute("id", myCanvasId);

  var elements=document.getElementsByTagName('script');

  // Go through script tags and act on ones containing Python.
  for (var index = 0; index < elements.length; index++) {
    var element = elements[index]

    // If this tag links to a source file, load it; otherwise load the content.
    // TODO: What MIME type is correct? python/python3 are from Brython; x-python is in current PC source.
    if(element.type == "text/python" || element.type == "text/python3" || element.type == "text/x-python") {
      if (element.src) {
        code = ajaxRequest(element.src);
      }
      else {
        code = element.innerHTML;
      }

      executePython(code, myPre, myCanvas);
    }
  }

})(___MINIMAL_TEST___);
});


// Brython code for deriving path of source file (potentially useful)
//                    $B.$py_module_path[module_name]=$elt.src
//                    var $src_elts = $elt.src.split('/')
//                    $src_elts.pop()
//                    var $src_path = $src_elts.join('/')
//                    if ($B.path.indexOf($src_path) == -1) {
//                        // insert in first position : folder /Lib with built-in modules
//                        // should be the last used when importing scripts
//                        $B.path.splice(0,0,$src_path)
//                    }
