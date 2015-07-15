// Derived from code in the Brython project:
//
// Copyright (c) 2012, Pierre Quentel pierre.quentel@gmail.com
// All rights reserved.

;var ___MINIMAL_TEST___ = { };

document.addEventListener('DOMContentLoaded', function($myInstance){
(function($myInstance) {

  function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
      throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
  }

  function executePython(codeElement, outputElement, canvasElement) {
    function outputFunction(text) { outputElement.innerHTML += text; }

    Sk.configure({output:outputFunction, read:builtinRead});
    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = canvasElement.id;

    var myPromise = Sk.misceval.asyncToPromise(function() {
      return Sk.importMainWithBody("<stdin>", false, codeElement.innerHTML, true);
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

  for (var index = 0; index < elements.length; index++) {
    var element = elements[index]

    if(element.type == "text/python" || element.type == "text/python3") {
      executePython(element, myPre, myCanvas);
    }
  }

})(___MINIMAL_TEST___);
});
