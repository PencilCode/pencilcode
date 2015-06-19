define(function() {

function filterblocks(a) {
  // Show 'say' block only on browsers that support speech synthesis.
  if (!window.SpeechSynthesisUtterance || !window.speechSynthesis) {
    a = a.filter(function(b) { return !/^say\b/.test(b.block); });
  }
  return a.map(function(e) {
    if (!e.id) {
      e.id = e.block.replace(/\W..*$/, '');
    }
    return e;
  });
}

return {

  // The following palette description
  // is copied from compiled CoffeeScript.
  COFFEESCRIPT_PALETTE: [
    {
      name: 'Draw',
      color: 'blue',
      blocks: filterblocks([
        {
          block: 'pen purple',
          title: 'Set the pen color'
        }, {
          block: 'fd 100',
          title: 'Move forward'
        }, {
          block: 'rt 90',
          title: 'Turn right'
        }, {
          block: 'lt 90',
          title: 'Turn left'
        }, {
          block: 'bk 100',
          title: 'Move backward'
        }, {
          block: 'fill blue',
          title: 'Fill traced shape'
        }, {
          block: 'dot green, 50',
          title: 'Make a dot'
        }, {
          block: 'box yellow, 50',
          title: 'Make a square'
        }, {
          block: 'home()',
          title: 'Move the turtle back to start'
        }, {
          block: 'cs()',
          title: 'Clear screen'
        }, {
          block: 'cg()',
          title: 'Clear graphics'
        }, {
          block: 'pu()',
          title: 'Lift the pen up'
        }, {
          block: 'pd()',
          title: 'Put the pen down'
        }, {
          block: 'scale 3',
          title: 'Scale turtle drawing'
        }, {
          block: 'pen purple, 10',
          title: 'Set pen color and size',
          id: 'penthick'
        }, {
          block: 'rt 180, 100',
          title: 'Make a wide right arc',
          id: 'rtarc'
        }, {
          block: 'lt 180, 100',
          title: 'Make a wide left arc',
          id: 'ltarc'
        }
      ])
    }, {
      name: 'Control',
      color: 'orange',
      blocks: filterblocks([
        {
          block: 'for [1..3]\n  ``',
          title: 'Do something multiple times'
        }, {
          block: 'for x in [1..3]\n  ``',
          title: 'Do something multiple times...?',
          id: 'forvar'
        }, {
          block: 'if `` is ``\n  ``',
          title: 'Do something only if a condition is true'
        }, {
          block: 'if `` is ``\n  ``\nelse\n  ``',
          title:
              'Do something if a condition is true, otherwise something else',
          id: 'ifelse'
        }, {
          block: "forever 1, ->\n  fd 25\n  if not inside window\n    stop()",
          title: 'Repeat something forever at qually-spaced times'
        }, {
          block: "button \'Click\', ->\n  write 'clicked'",
          title: 'Make a button and do something when clicked'
        }, {
          block: "keydown \'X\', ->\n  write 'x pressed'",
          title: 'Do something when a keyboard key is pressed'
        }
      ])
    }, {
      name: 'Move',
      color: 'red',
      blocks: filterblocks([
        {
          block: 'speed 10',
          title: 'Set the speed of the turtle'
        }, {
          block: 'speed Infinity',
          title: 'Use infinite speed',
          id: 'speedinf'
        }, {
          block: 'ht()',
          title: 'Hide the main turtle'
        }, {
          block: 'st()',
          title: 'Show the main turtle'
        }, {
          block: 'moveto 100, 50',
          title: 'Move to coordinates'
        }, {
          block: 'movexy 30, 20',
          title: 'Move by changing x and y'
        }, {
          block: 'move 10, 5',
          title: "Move sideways or diagonal from turtle's angle"
        }, {
          block: 'jumpto 100, 50',
          title: 'Jump to coordinates without drawing'
        }, {
          block: 'jumpxy 30, 20',
          title: 'Jump changing x and y without drawing'
        }, {
          block: 'jump 10, 5',
          title: "Move sideways or diagonal without drawing"
        }, {
          block: 'turnto 270',
          title: 'Turn to an absolute direction'
        }, {
          block: 'turnto lastclick',
          title: 'Turn toward a located object',
          id: 'turntoobj'
        }, {
          block: "forever ->\n  turnto lastmouse\n  fd 2",
          title: 'Turn and move at regularly-spaced times'
        }, {
          block: "forever ->\n  if pressed 'W'\n    fd 2",
          title: 'Poll a key and move while it is depressed',
          id: 'foreverif'
        }, {
          block: "click (e) ->\n  moveto e",
          title: 'Move to a location when document is clicked'
        }
      ])
    }, {
      name: 'Math',
      color: 'green',
      blocks: filterblocks([
        {
          block: 'x = ``',
          title: 'Set a variable',
          id: 'assign'
        }, {
          block: '`` + ``',
          title: 'Add two numbers',
          id: 'add'
        }, {
          block: '`` - ``',
          title: 'Subtract two numbers',
          id: 'subtract'
        }, {
          block: '`` * ``',
          title: 'Multiply two numbers',
          id: 'multiply'
        }, {
          block: '`` / ``',
          title: 'Divide two numbers',
          id: 'divide'
        }, {
          block: '`` is ``',
          title: 'Compare two values',
          id: 'is'
        }, {
          block: '`` < ``',
          title: 'Compare two values',
          id: 'lessthan'
        }, {
          block: '`` > ``',
          title: 'Compare two values',
          id: 'greaterthan'
        }, {
          block: 'random 1, 7',
          title: 'Get a random number in a range'
        }, {
          block: 'round ``',
          title: 'Round to the nearest integer'
        }, {
          block: 'abs ``',
          title: 'Absolute value'
        }, {
          block: 'max ``, ``',
          title: 'Get the larger of two numbers'
        }, {
          block: 'min ``, ``',
          title: 'Get the smaller on two numbers'
        }, {
          block: 'text.match /pattern/',
          title: 'Test if pattern is found in text',
          id: 'textmatch'
        }, {
          block: 'f = (param) ->\n  ``',
          title: 'Define a new function',
          id: 'funcdef'
        }, {
          block: 'myfunc(arg)',
          title: 'Use a custom function',
          id: 'funccall'
        }
      ])
    }, {
      name: 'Text',
      color: 'yellow',
      blocks: filterblocks([
        {
          block: 'label \'spot\'',
          title: 'Write text at the turtle'
        }, {
          block: 'type \'zz*(-.-)*zz\'',
          title: 'Typewrite text in the document'
        }, {
          block: 'write \'Hello.\'',
          title: 'Write text in the document'
        }, {
          block: 'say \'Try this.\'',
          title: 'Speak text aloud'
        }, {
          block: 'read \'Name?\', (n) ->\n  write \'Hello\' + n',
          title: 'Read input from the user'
        }, {
          block: 'readnum \'Side\', (n) ->\n  write \'A\' + n * n',
          title: 'Read a number from the user'
        }, {
          block: 'readstr \'Idea?\', (n) ->\n  write n.length',
          title: 'Read a whole line of text'
        }, {
          block: "table [\n  ['a','b','c']\n  [1,2,3]\n]",
          title: 'Write a table in the document'
        }, {
          block: 'log [1..10]',
          title: 'Log an object to debug'
        }, {
          block: 'd = write \'dice\'',
          title: 'Remember d as a text element',
          id: 'writevar'
        }, {
          block: 'forever 1, ->\n  d.text random [1..6]',
          title: 'Change d text content',
          id: 'forevertext'
        }
      ])
    }, {
      name: 'Sprites',
      color: 'violet',
      blocks: filterblocks([
        {
          block: 'wear \'/img/apple\'',
          title: 'Use an image for the turtle'
        }, {
          block: 't = new Turtle red',
          title: 'Make a new turtle',
          id: 'newturtle'
        }, {
          block: 't.fd 100',
          title: 'Move turtle t forward',
          id: 'objfd'
        }, {
          block: 't.rt 90',
          title: 'Turn turtle t right',
          id: 'objrt'
        }, {
          block: 't.lt 90',
          title: 'Turn turtle t left',
          id: 'objlt'
        }, {
          block: 't.bk 100',
          title: 'Move turtle t backward',
          id: 'objbk'
        }, {
          block: 's = new Sprite',
          title: 'Make a blank sprite',
          id: 'newsprite'
        }, {
          block: 's.wear \'/img/dragon\'',
          title: 'Load an image in sprite s',
          id: 'objwear'
        }, {
          block: 'drawon s',
          title: 'Draw on sprite s'
        }, {
          block: 'drawon document',
          title: 'Draw on the document'
        }, {
          block: 'p = new Piano',
          title: 'Make a visible instrument',
          id: 'newpiano'
        }, {
          block: 'p.play \'CDEDC\'',
          title: 'Play and show music notes',
          id: 'objplay'
        }, {
          block: 'q = new Pencil',
          title: 'Make an invisible and fast drawing sprite',
          id: 'newpencil'
        }, {
          block: 'q.pen black, 1',
          title: 'Use a thin black pen',
          id: 'objpen'
        }, {
          block: 'q.drawon s',
          title: 'Use q to draw on sprite s',
          id: 'objdrawon'
        }, {
          block: 'q.rt 360, 100',
          title: 'Trace a circle on the right',
          id: 'objrtarc'
        }, {
          block: 'q.lt 360, 100',
          title: 'Trace a circle on the left',
          id: 'objltarc'
        }, {
          block: 'q.fill pink',
          title: 'Fill the traced path',
          id: 'objfill'
        }
      ])
    }
  ],

  JAVASCRIPT_PALETTE: [
    {
      name: 'Draw',
      color: 'blue',
      blocks: [
        {
          block: 'pen(red);',
          title: 'Set the pen color'
        }, {
          block: 'fd(100);',
          title: 'Move forward'
        }, {
          block: 'rt(90);',
          title: 'Turn right'
        }, {
          block: 'lt(90);',
          title: 'Turn left'
        }, {
          block: 'bk(100);',
          title: 'Move backward'
        }, {
          block: 'speed(10);',
          title: 'Set the speed of the turtle'
        }, {
          block: 'dot(blue, 50);',
          title: 'Make a dot'
        }, {
          block: 'box(green, 50);',
          title: 'Make a square'
        }, {
          block: 'write(\'hello\');',
          title: 'Write text on the screen'
        }, {
          block: 'label(\'hello\');',
          title: 'Write text at the turtle'
        }, {
          block: 'ht();',
          title: 'Hide the turtle'
        }, {
          block: 'st();',
          title: 'Show the turtle'
        }, {
          block: 'pu();',
          title: 'Pick the pen up'
        }, {
          block: 'pd();',
          title: 'Put the pen down'
        }, {
          block: 'pen(purple, 10);',
          title: 'Set the pen color and thickness'
        }, {
          block: 'rt(180, 100);',
          title: 'Make a wide right turn'
        }, {
          block: 'lt(180, 100);',
          title: 'Make a wide left turn'
        }, {
          block: 'slide(100, 20);',
          title: 'Slide sideways or diagonally'
        }, {
          block: 'jump(100, 20);',
          title: 'Jump without drawing'
        }, {
          block: 'play(\'GEC\');',
          title: 'Play music notes'
        }, {
          block: 'wear(\'/img/cat-icon\');',
          title: 'Change the turtle image'
        }
      ]
    }, {
      name: 'Control',
      color: 'orange',
      blocks: [
        {
          block: 'for (var i = 0; i < 4; i++) {\n  __;\n}',
          title: 'Do something multiple times'
        }, {
          block: 'if (__) {\n  __;\n}',
          title: 'Do something only if a condition is true'
        }, {
          block: 'if (__) {\n  __;\n} else {\n  __;\n}',
          title: 'Do something if a condition is true, otherwise do something else'
        }, {
          block: 'while (__) {\n  __;\n}',
          title: 'Repeat something while a condition is true'
        }
      ]
    }, {
      name: 'Math',
      color: 'green',
      blocks: [
        {
          block: 'var x = __;',
          title: 'Create a variable for the first time'
        }, {
          block: 'x = __;',
          title: 'Reassign a variable'
        }, {
          block: '__ + __',
          title: 'Add two numbers'
        }, {
          block: '__ - __',
          title: 'Subtract two numbers'
        }, {
          block: '__ * __',
          title: 'Multiply two numbers'
        }, {
          block: '__ / __',
          title: 'Divide two numbers'
        }, {
          block: '__ === __',
          title: 'Compare two numbers'
        }, {
          block: '__ > __',
          title: 'Compare two numbers'
        }, {
          block: '__ < __',
          title: 'Compare two numbers'
        }, {
          block: 'random(1, 100)',
          title: 'Get a random number in a range'
        }, {
          block: 'round(__)',
          title: 'Round to the nearest integer'
        }, {
          block: 'abs(__)',
          title: 'Absolute value'
        }, {
          block: 'max(__, __)',
          title: 'Absolute value'
        }, {
          block: 'min(__, __)',
          title: 'Absolute value'
        }
      ]
    }, {
      name: 'Functions',
      color: 'violet',
      blocks: [
        {
          block: 'function myFunction() {\n  __;\n}',
          title: 'Create a function without an argument'
        }, {
          block: 'function myFunction(n) {\n  __;\n}',
          title: 'Create a function with an argument'
        }, {
          block: 'myFunction()',
          title: 'Use a function without an argument'
        }, {
          block: 'myFunction(n)',
          title: 'Use a function with argument'
        }
      ]
    }
  ],

  HTML_PALETTE: [
    {
      "name": "Metadata",
      "color": "blue",
      "blocks": [
        {"block":"<!DOCTYPE html>", "title":"Defines document type"},
        {"block":"<html>\n  \n</html>"},
        {"block":"<head>\n  \n</head>"},
        {"block":"<title></title>"},
        {"block":"<base href=\"\" />"},
        {"block":"<link rel=\"\" href=\"\" />"},
        {"block":"<meta charset=\"\" />"},
        {"block":"<style>\n  \n</style>"}
      ]
    }, {
      "name": "Sections",
      "color": "orange",
      "blocks": [
        {"block":"<body>\n  \n</body>"},
        {"block":"<article>\n  \n</article>"},
        {"block":"<section>\n  \n</section>"},
        {"block":"<nav>\n  \n</nav>"},
        {"block":"<aside>\n  \n</aside>"},
        {"block":"<h1></h1>"},
        {"block":"<hgroup>\n  \n</hgroup>"},
        {"block":"<header>\n  \n</header>"},
        {"block":"<footer>\n  \n</footer>"},
        {"block":"<address>\n  \n</address>"}
      ]
    }, {
      "name": "Grouping",
      "color": "green",
      "blocks": [
        {"block":"<p>\n  \n</p>"},
        {"block":"<hr />"},
        {"block":"<pre>\n  \n</pre>"},
        {"block":"<blockquote>\n  \n</blockquote>"},
        {"block":"<ol>\n  \n</ol>"},
        {"block":"<ul>\n  \n</ul>"},
        {"block":"<li></li>"},
        {"block":"<dl>\n  \n</dl>"},
        {"block":"<dt></dt>"},
        {"block":"<dd></dd>"},
        {"block":"<figure>\n  \n</figure>"},
        {"block":"<figcaption></figcaption>"},
        {"block":"<main>\n  \n</main>"},
        {"block":"<div>\n  \n</div>"}
      ]
    }, {
      "name": "Text",
      "color": "red",
      "blocks": [
        {"block":"<a href=\"\"></a>"},
        {"block":"<em></em>"},
        {"block":"<strong></strong>"},
        {"block":"<small></small>"},
        {"block":"<big></big>"},
        {"block":"<cite></cite>"},
        {"block":"<q></q>"},
        {"block":"<dfn></dfn>"},
        {"block":"<abbr title=\"\"></abbr>"},
        {"block":"<ruby>\n  \n</ruby>"},
        {"block":"<rt></rt>"},
        {"block":"<rp></rp>"},
        {"block":"<data></data>"},
        {"block":"<data value=\"\"></data>"},
        {"block":"<time></time>"},
        {"block":"<code></code>"},
        {"block":"<var></var>"},
        {"block":"<samp></samp>"},
        {"block":"<kbd></kbd>"},
        {"block":"<sub></sub>"},
        {"block":"<sup></sup>"},
        {"block":"<i></i>"},
        {"block":"<b></b>"},
        {"block":"<u></u>"},
        {"block":"<mark></mark>"},
        {"block":"<bdi></bdi>"},
        {"block":"<bdo dir=\"\">\n  \n</bdo>"},
        {"block":"<span></span>"},
        {"block":"<br />"},
        {"block":"<wbr />"},
        {"block":"text"}
      ]
    }, {
      "name": "Other",
      "color": "yellow",
      "blocks": [
        {"block":"<ins></ins>"},
        {"block":"<del></del>"},
        {"block":"<details>\n  \n</details>"},
        {"block":"<summary></summary>"},
        {"block":"<menu>\n  \n</menu>"},
        {"block":"<menuitem></menuitem>"},
        {"block":"<dialog open></dialog>"},
        {"block":"<script>\n  \n</script>"},
        {"block":"<script src=\"\"></script>"},
        {"block":"<noscript></noscript>"},
        {"block":"<template>\n  \n</template>"},
        {"block":"<canvas></canvas>"},
        {"block":"<applet code=\"\">\n  \n</applet>"},
        {"block":"<basefont color=\"\" size=\"\" />"},
        {"block":"<bgsound src=\"\" />"},
        {"block":"<center>\n  \n</center>"},
        {"block":"<command type=\"\" label=\"\" />"},
        {"block":"<font sixe=\"\" color=\"\">\n  \n</font>"},
        {"block":"<frameset cols=\"\">\n  \n</frameset>"},
        {"block":"<marquee></marquee>"},
        {"block":"<strike></strike>"},
        {"block":"<tt></tt>"},
        {"block":"<svg>\n  \n</svg>"}
      ]
    }, {
      "name": "Embedded",
      "color": "violet",
      "blocks": [
        {"block":"<img src=\"\" alt=\"\" />"},
        {"block":"<iframe>\n  \n</iframe>"},
        {"block":"<embed src=\"\" />"},
        {"block":"<object data=\"\">\n  \n</object>"},
        {"block":"<param name=\"\" value=\"\" />"},
        {"block":"<video width=\"\" height=\"\" controls>\n  \n</video>"},
        {"block":"<audio controls>\n  \n</audio>"},
        {"block":"<source src=\"\" type=\"\" />"},
        {"block":"<track src=\"\" />"},
        {"block":"<map name=\"\">\n  \n</map>"},
        {"block":"<area shape=\"\" href=\"\" />"}
      ]
    }, {
      "name": "Table",
      "color": "blue",
      "blocks": [
        {"block":"<table>\n  \n</table>"},
        {"block":"<caption></caption>"},
        {"block":"<colgroup>\n  \n</colgroup>"},
        {"block":"<col style=\"\"/>"},
        {"block":"<tbody>\n  \n</tbody>"},
        {"block":"<thead>\n  \n</thead>"},
        {"block":"<tfoot>\n  \n</tfoot>"},
        {"block":"<tr>\n  \n</tr>"},
        {"block":"<td></td>"},
        {"block":"<th></th>"}
      ]
    }, {
      "name": "Form",
      "color": "orange",
      "blocks": [
        {"block":"<form action=\"\">\n  \n</form>"},
        {"block":"<label for=\"\"></label>"},
        {"block":"<input type=\"\" />"},
        {"block":"<button></button>"},
        {"block":"<select>\n  \n</select>"},
        {"block":"<datalist>\n  \n</datalist>"},
        {"block":"<optgroup>\n  \n</optgroup>"},
        {"block":"<option value=\"\"></option>"},
        {"block":"<textarea>\n  \n</textarea>"},
        {"block":"<keygen />"},
        {"block":"<output for=\"\"></output>"},
        {"block":"<progress value=\"\" max=\"\"></progress>"},
        {"block":"<meter value=\"\"></meter>"},
        {"block":"<fieldset>\n  \n</fieldset>"},
        {"block":"<legend></legend>"}
      ]
    }
  ],

  KNOWN_FUNCTIONS: {
    fd: {},
    bk: {},
    rt: {},
    lt: {},
    slide: {},
    move: {color:'red'},
    movexy: {color:'red'},
    moveto: {color:'red'},
    jump: {color:'red'},
    jumpxy: {color:'red'},
    jumpto: {color:'red'},
    turnto: {color:'red'},
    home: {},
    pen: {},
    fill: {},
    dot: {},
    box: {},
    mirror: {},
    twist: {},
    scale: {},
    pause: {},
    st: {color:'red'},
    ht: {color:'red'},
    cs: {},
    cg: {},
    ct: {},
    pu: {},
    pd: {},
    pe: {},
    pf: {},
    say: {color: 'yellow'},
    play: {},
    tone: {},
    silence: {},
    speed: {color:'red'},
    wear: {},
    drawon: {},
    label: {color: 'yellow'},
    reload: {},
    see: {},
    sync: {},
    send: {},
    recv: {},
    click: {color: 'orange'},
    mousemove: {color: 'orange'},
    mouseup: {color: 'orange'},
    mousedown: {color: 'orange'},
    keyup: {color: 'orange'},
    keydown: {color:'orange'},
    keypress: {color:'orange'},
    alert: {},
    prompt: {},
    done: {},
    tick: {color:'orange'},
    forever: {color:'orange'},
    stop: {color:'orange'},
    type: {color:'yellow'},
    sort: {},
    log: {color: 'yellow'},
    abs: {value: true},
    acos: {value: true},
    asin: {value: true},
    atan: {value: true},
    atan2: {value: true},
    cos: {value: true},
    sin: {value: true},
    tan: {value: true},
    ceil: {value: true},
    floor: {value: true},
    round: {value: true},
    exp: {value: true},
    ln: {value: true},
    log10: {value: true},
    pow: {value: true},
    sqrt: {value: true},
    max: {value: true},
    min: {value: true},
    random: {value: true},
    pagexy: {value: true},
    getxy: {value: true},
    direction: {value: true},
    distance: {value: true},
    shown: {value: true},
    hidden: {value: true},
    inside: {value: true},
    touches: {value: true},
    within: {value: true},
    notwithin: {value: true},
    nearest: {value: true},
    pressed: {value: true},
    canvas: {value: true},
    hsl: {value: true},
    hsla: {value: true},
    rgb: {value: true},
    rgba: {value: true},
    cell: {value: true},
    '$': {value: true},
    match: {value: true},
    toString: {value: true},
    charCodeAt: {value: true},
    fromCharCode: {value: true},
    exec: {value: true},
    test: {value: true},
    split: {value: true},
    join: {value: true},
    button: {value: true, command: true, color: 'orange'},
    read: {value: true, command: true, color: 'yellow'},
    readstr: {value: true, command: true, color: 'yellow'},
    readnum: {value: true, command: true, color: 'yellow'},
    write: {value: true, command: true, color: 'yellow'},
    table: {value: true, command: true, color: 'yellow'},
    splice: {value: true, command: true},
    append: {value: true, command: true},
    finish: {value: true, command: true},
    loadscript: {value: true, command: true},
    text: {value: true, command: true},
    html: {value: true, command: true}
  }
};

});
