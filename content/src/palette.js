define(function() {

return {

  // The following palette description
  // is copied from compiled CoffeeScript.
  COFFEESCRIPT_PALETTE: [
    {
      name: 'Move',
      color: 'red',
      blocks: [
        {
          block: 'speed 10',
          title: 'Set the speed of the turtle'
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
          block: 'rt 180, 100',
          title: 'Make a wide right arc'
        }, {
          block: 'lt 180, 100',
          title: 'Make a wide left arc'
        }, {
          block: 'speed Infinity',
          title: 'Use infinite speed'
        }, {
          block: 'home()',
          title: 'Jump to the origin, turned up'
        }, {
          block: 'turnto 270',
          title: 'Turn to an absolute direction'
        }, {
          block: 'turnto lastclick',
          title: 'Turn toward a located object'
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
          block: "tick 10, ->\n  turnto lastmouse\n  fd 2",
          title: 'Turn and move at regularly-spaced times'
        }, {
          block: "tick 10, ->\n  if pressed 'W'\n    fd 2",
          title: 'Poll a key and move while it is depressed'
        }, {
          block: "click (e) ->\n  moveto e",
          title: 'Move to a location when document is clicked'
        }
      ]
    }, {
      name: 'Control',
      color: 'orange',
      blocks: [
        {
          block: 'for [1..3]\n  ``',
          title: 'Do something multiple times'
        }, {
          block: 'for x in [1..3]\n  ``',
          title: 'Do something multiple times...?'
        }, {
          block: 'if `` is ``\n  ``',
          title: 'Do something only if a condition is true'
        }, {
          block: 'if `` is ``\n  ``\nelse\n  ``',
          title: 'Do something if a condition is true, otherwise something else'
        }, {
          block: "tick 1, ->\n  write 'ticked'",
          title: 'Repeat something forever at qually-spaced times'
        }, {
          block: "button \'Click\', ->\n  write 'clicked'",
          title: 'Make a button and do something when clicked'
        }, {
          block: "keydown \'X\', ->\n  write 'x pressed'",
          title: 'Do something when a keyboard key is pressed'
        }
      ]
    }, {
      name: 'Draw',
      color: 'blue',
      blocks: [
        {
          block: 'pen purple, 10',
          title: 'Set pen color and size'
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
        }
      ]
    }, {
      name: 'Math',
      color: 'green',
      blocks: [
        {
          block: 'x = ``',
          title: 'Set a variable'
        }, {
          block: '`` + ``',
          title: 'Add two numbers'
        }, {
          block: '`` - ``',
          title: 'Subtract two numbers'
        }, {
          block: '`` * ``',
          title: 'Multiply two numbers'
        }, {
          block: '`` / ``',
          title: 'Divide two numbers'
        }, {
          block: '`` is ``',
          title: 'Compare two values'
        }, {
          block: '`` < ``',
          title: 'Compare two values'
        }, {
          block: '`` > ``',
          title: 'Compare two values'
        }, {
          block: 'random [1..100]',
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
          title: 'Test if pattern is found in text'
        }, {
          block: 'f = (param) ->\n  ``',
          title: 'Define a new function'
        }, {
          block: 'myfunc(arg)',
          title: 'Use a custom function'
        }
      ]
    }, {
      name: 'Text',
      color: 'yellow',
      blocks: [
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
          title: 'Remember d as a text element'
        }, {
          block: 'tick 1, ->\n  d.text random [1..6]',
          title: 'Change d text content'
        }
      ]
    }, {
      name: 'Sprites',
      color: 'violet',
      blocks: [
        {
          block: 'wear \'/img/apple\'',
          title: 'Use an image for the turtle'
        }, {
          block: 't = new Turtle red',
          title: 'Make a new turtle'
        }, {
          block: 't.fd 100',
          title: 'Move turtle t forward'
        }, {
          block: 't.rt 90',
          title: 'Turn turtle t right'
        }, {
          block: 't.lt 90',
          title: 'Turn turtle t left'
        }, {
          block: 't.bk 100',
          title: 'Move turtle t backward'
        }, {
          block: 'ht()',
          title: 'Hide the main turtle'
        }, {
          block: 'st()',
          title: 'Show the main turtle'
        }, {
          block: 's = new Sprite',
          title: 'Make a blank sprite'
        }, {
          block: 's.wear \'/img/dragon\'',
          title: 'Load an image in sprite s'
        }, {
          block: 'drawon s',
          title: 'Draw on sprite s'
        }, {
          block: 'drawon document',
          title: 'Draw on the document'
        }, {
          block: 'p = new Piano',
          title: 'Make a visible insturment'
        }, {
          block: 'p.play \'CDEDC\'',
          title: 'Play and show music notes'
        }, {
          block: 'q = new Pencil',
          title: 'Make an invisible and fast drawing sprite'
        }, {
          block: 'q.pen black, 1',
          title: 'Use a thin black pen'
        }, {
          block: 'q.drawon s',
          title: 'Use q to draw on sprite s'
        }, {
          block: 'q.rt 360, 100',
          title: 'Trace a circle on the right'
        }, {
          block: 'q.lt 360, 100',
          title: 'Trace a circle on the left'
        }, {
          block: 'q.fill pink',
          title: 'Fill the traced path'
        }
      ]
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
  ]
};

});
