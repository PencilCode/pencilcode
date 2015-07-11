function filterblocks(a) {
  // Show 'say' block only on browsers that support speech synthesis.
  if (!window.SpeechSynthesisUtterance || !window.speechSynthesis) {
    a = a.filter(function(b) { return !/^@?say\b/.test(b.block); });
  }
  return a.map(function(e) {
    if (!e.id) {
      e.id = e.block.replace(/\W..*$/, '');
    }
    return e;
  });
}

// Recursive copy of a plain javascript object, while mapping
// specified fields.
function fieldmap(obj, map) {
  if (!obj || 'object' != typeof obj) {
    return obj;
  }
  var result;
  if (obj instanceof Array) {
    result = [];
    for (var j = 0; j < obj.length; ++j) {
      result.push(fieldmap(obj[j], map));
    }
  } else {
    result = {};
    for (var k in obj) if (obj.hasOwnProperty(k)) {
      if (map.hasOwnProperty(k)) {
        result[k] = map[k](obj[k]);
      } else {
        result[k] = fieldmap(obj[k], map);
      }
    }
  }
  return result;
}

function expand(palette, thisname) {
  var replacement = !thisname ? '' : (thisname + '.');
  function replacer(s) {
    if (!s) return s;
    return s.replace(/@/, replacement);
  }
  return fieldmap(palette, {
    block: replacer,
    expansion: replacer
  });
}

var distances = ['25', '50', '100', '200'],
    sdistances = ['100', '50', '-50', '-100'],
    angles = ['30', '45', '60', '90', '135', '144'],
    sangles = ['0', '90', '180', '270'],
    sizes = ['10', '25', '50', '100'],
    scales = ['0.5', '2.0', '3.0'],
    colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black'];

module.exports = {

  expand: expand,

  // The following palette description
  // is copied from compiled CoffeeScript.
  COFFEESCRIPT_PALETTE: [
    {
      name: 'Move',
      color: 'lightblue',
      blocks: filterblocks([
        {
          block: '@fd 100',
          title: 'Move forward'
        }, {
          block: '@rt 90',
          title: 'Turn right'
        }, {
          block: '@lt 90',
          title: 'Turn left'
        }, {
          block: '@bk 100',
          title: 'Move backward'
        }, {
          block: '@rt 180, 100',
          title: 'Make a wide right arc'
        }, {
          block: '@lt 180, 100',
          title: 'Make a wide left arc'
        }, {
          block: '@speed 10',
          title: 'Set the speed of the turtle'
        }, {
          block: '@speed Infinity',
          title: 'Use infinite speed'
        }, {
          block: '@home()',
          title: 'Jump to the origin, turned up'
        }, {
          block: '@turnto 270',
          title: 'Turn to an absolute direction'
        }, {
          block: '@turnto lastclick',
          title: 'Turn toward a located object'
        }, {
          block: '@moveto 100, 50',
          title: 'Move to coordinates'
        }, {
          block: '@movexy 30, 20',
          title: 'Move by changing x and y'
        }, {
          block: '@jumpto 100, 50',
          title: 'Jump to coordinates without drawing'
        }, {
          block: '@jumpxy 30, 20',
          title: 'Jump changing x and y without drawing'
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
          block: 'while ``\n  ``',
          title: '  Repeat while a condition is true'
        }, {
          block: 'if `` is ``\n  ``',
          title: 'Do something only if a condition is true'
        }, {
          block: 'if `` is ``\n  ``\nelse\n  ``',
          title:
              'Do something if a condition is true, otherwise something else',
          id: 'ifelse'
        }, {
          block: "forever 1, ->\n  ``",
          title: 'Repeat something forever at qually-spaced times'
        }, {
          block: "button \'Click\', ->\n  ``",
          title: 'Make a button and do something when clicked'
        }, {
          block: "keydown \'X\', ->\n  ``",
          title: 'Do something when a keyboard key is pressed'
        }, {
          block: "click (e) ->\n  ``",
          title: 'Do something when the mouse is clicked'
        }
      ])
    }, {
      name: 'Art',
      color: 'purple',
      blocks: filterblocks([
         {
          block: '@pen purple, 10',
          title: 'Set pen color and size'
        }, {
          block: '@dot green, 50',
          title: 'Make a dot'
        }, {
          block: '@box yellow, 50',
          title: 'Make a square'
        }, {
          block: '@fill blue',
          title: 'Fill traced shape'
        }, {
          block: '@wear \'/img/apple\'',
          title: 'Use an image for the turtle'
        }, {
          block: '@scale 3',
          title: 'Scale turtle drawing'
        }, {
          block: '@ht()',
          title: 'Hide the main turtle'
        }, {
          block: '@st()',
          title: 'Show the main turtle'
        }, {
          block: 'cs()',
          title: 'Clear screen'
        }, {
          block: '@pu()',
          title: 'Lift the pen up'
        }, {
          block: '@pd()',
          title: 'Put the pen down'
        }, {
          block: '@drawon s',
          title: 'Draw on sprite s'
        }, {
          block: '@drawon document',
          title: 'Draw on the document'
        }
      ])
    }, {
      name: 'Operators',
      color: 'lightgreen',
      blocks: filterblocks([
        {
          block: 'x = ``',
          title: 'Set a variable',
          id: 'assign'
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
          block: 'random 6',
          title: 'Get a random number less than n'
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
          block: 'x.match /pattern/',
          title: 'Test if a text pattern is found in x'
        }, {
          block: 'f = (x) ->\n  ``',
          title: 'Define a new function'
        }, {
          block: 'f(x)',
          title: 'Use a custom function'
        }
      ])
    }, {
      name: 'Text',
      color: 'pink',
      blocks: filterblocks([
        {
          block: 'write \'Hello.\'',
          title: 'Write text in the document'
        }, {
          block: 'type \'zz*(-.-)*zz\'',
          title: 'Typewrite text in the document'
        }, {
          block: 'typebox yellow',
          title: 'Type out a colored square'
        }, {
          block: 'typeline()',
          title: 'Type in a new line'
        }, {
          block: '@label \'spot\'',
          title: 'Write text at the turtle'
        }, {
          block: "await read '?', defer x",
          title: "Pause for input from the user"
        }, {
          block: "await readnum '?', defer x",
          title: "Pause for a number from the user"
        }, {
          block: 'read \'?\', (x) ->\n  write x',
          title: 'Send input from the user to a function'
        }, {
          block: 'readnum \'?\', (x) ->\n  write x',
          title: 'Send a number from the user to a function'
        }, {
          block: 'log [1..10]',
          title: 'Log an object to debug'
        }
      ])
    }, {
      name: 'Sprites',
      color: 'teal',
      blocks: filterblocks([
        {
          block: 't = new Turtle red',
          title: 'Make a new turtle',
          id: 'newturtle'
        }, {
          block: 's = new Sprite()',
          title: 'Make a blank sprite',
          id: 'newsprite'
        }, {
          block: 'p = new Piano()',
          title: 'Make a visible instrument',
          id: 'newpiano'
        }, {
          block: 'q = new Pencil()',
          title: 'Make an invisible and fast drawing sprite'
        }, {
          block: 'if @touches x\n  ``',
          title: 'Do something only if touching the object x'
        }, {
          block: 'if @inside window\n  ``',
          title: 'Do something only if inside the window'
        }
      ])
    }, {
      name: 'Sound',
      color: 'indigo',
      blocks: filterblocks([
        {
          block: '@play \'c G/G/ AG z\'',
          title: 'Play music notes in sequence'
        }, {
          block: '@play \'[fA] [ecG]2\'',
          title: 'Play notes in a chord'
        }, {
          block: '@tone \'B\', 2, 1',
          title: 'Sound a note immediately'
        }, {
          block: '@tone \'B\', 0',
          title: 'Silence a note immediately'
        }, {
          block: '@tone 440, 2, 1',
          title: 'Sound a frequency immediately'
        }, {
          block: '@tone 440, 0',
          title: 'Silence a frequency immediately'
        }, {
          block: '@silence()',
          title: 'Silence all notes'
        }, {
          block: '@say \'hello\'',
          title: 'Speak a word'
        }
      ])
    }, {
      name: 'Snippets',
      color: 'deeporange',
      blocks: filterblocks([
        {
          block: "forever 10, ->\n  turnto lastmouse\n  fd 2",
          title: 'Continually move towards the last mouse position'
        }, {
          block: "forever 10, ->\n  if pressed 'W'\n    fd 2",
          title: 'Poll a key and move while it is depressed'
        }, {
          block: "forever 1, ->\n  fd 25\n  if not inside window\n    stop()",
          title: 'Move once per second until not inside window'
        }, {
          block: "click (e) ->\n  moveto e",
          title: 'Move to a location when document is clicked'
        }, {
          block: "button \'Click\', ->\n  write 'clicked'",
          title: 'Make a button and do something when clicked'
        }, {
          block: "keydown \'X\', ->\n  write 'x pressed'",
          title: 'Do something when a keyboard key is pressed'
        }, {
          block: "click (e) ->\n  moveto e",
          title: 'Move to a location when document is clicked'
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
      name: "Metadata",
      color: "lightblue",
      blocks: [
        {
          block: "<!DOCTYPE html>",
          title: "Defines document type"
        }, {
          block: "<html>\n  \n</html>",
          title: "Root of an HTML document"
        }, {
          block: "<head>\n  \n</head>",
          title: "Represents a collection of metadata"
        }, {
          block: "<title></title>",
          title: "Document's title or name"
        }, {
          block: "<base href=\"\" />",
          title: "Base URL/target for all relative URLs in a document"
        }, {
          block: "<link rel=\"\" href=\"\" />",
          title: "Link between a document and an external resource"
        }, {
          block: "<meta charset=\"\" />",
          title: "Metadata about the HTML document"
        }, {
          block: "<style>\n  \n</style>",
          title: "Define style information"
        }, {
          block: "<script>\n  \n</script>",
          title: "Define a client-side script, such as a JavaScript"
        }
      ]
    }, {
      name: "Sections",
      color: "orange",
      blocks: [
        {
          block: "<body>\n  \n</body>",
          title: "Main content of the document"
        }, {
          block: "<article>\n  \n</article>",
          title: "Independent, self-contained content"
        }, {
          block: "<section>\n  \n</section>",
          title: "Generic section of a document or application"
        }, {
          block: "<nav>\n  \n</nav>",
          title: "Set of navigation links"
        }, {
          block: "<aside>\n  \n</aside>",
          title: "Content aside from the content it is placed in"
        }, {
          block: "<h1></h1>",
          title: "Heading for its section - Can use h1..h6 for different sizes"
        }, {
          block: "<hgroup>\n  \n</hgroup>",
          title: "Group of headings h1-h6"
        }, {
          block: "<header>\n  \n</header>",
          title: "Group of introductory or navigational aids"
        }, {
          block: "<footer>\n  \n</footer>",
          title: "Footer for a document or section"
        }, {
          block: "<address>\n  \n</address>",
          title: "Contact information for the author/owner"
        }
      ]
    }, {
      name: "Grouping",
      color: "purple",
      blocks: [
        {
          block: "<p>\n  \n</p>",
          title: "Represents a paragraph"
        }, {
          block: "<hr />",
          title: "Paragraph-level thematic break"
        }, {
          block: "<pre>\n  \n</pre>",
          title: "Block of preformatted text"
        }, {
          block: "<blockquote>\n  \n</blockquote>",
          title: "Section that is quoted from another source"
        }, {
          block: "<ol>\n  \n</ol>",
          title: "Ordered list"
        }, {
          block: "<ul>\n  \n</ul>",
          title: "Unordered list"
        }, {
          block: "<li></li>",
          title: "List item"
        }, {
          block: "<dl>\n  \n</dl>",
          title: "Description list"
        }, {
          block: "<dt></dt>",
          title: "Term/name in a description list"
        }, {
          block: "<dd></dd>",
          title: "Description of a term"
        }, {
          block: "<figure>\n  \n</figure>",
          title: "Self-contained content, like illustrations, diagrams, photos, code listings, etc"
        }, {
          block: "<figcaption></figcaption>",
          title: "Defines a caption for a <figure> element"
        }, {
          block: "<main>\n  \n</main>",
          title: "Container for the dominant contents of another element"
        }, {
          block: "<div>\n  \n</div>",
          title: "Defines a division"
        }
      ]
    }, {
      name: "Text",
      color: "lightgreen",
      blocks: [
        {
          block: "<a href=\"\"></a>",
          title: "Defines a hyperlink, which is used to link from one page to another"
        }, {
          block: "<em></em>",
          title: "Stress emphasis of its contents"
        }, {
          block: "<strong></strong>",
          title: "Strong importance, seriousness, or urgency for its contents"
        }, {
          block: "<small></small>",
          title: "Side comments such as small print"
        }, {
          block: "<s></s>",
          title: "Contents that are no longer accurate/relevant"
        }, {
          block: "<cite></cite>",
          title: "Title of a work"
        }, {
          block: "<q></q>",
          title: "Short quotation"
        }, {
          block: "<dfn></dfn>",
          title: "Defining instance of a term"
        }, {
          block: "<abbr title=\"\"></abbr>",
          title: "Abbreviation or acronym, optionally with its expansion"
        }, {
          block: "<ruby>\n  \n</ruby>",
          title: "Ruby annotation(small extra text, attached to the main text to indicate the pronunciation or meaning of the corresponding characters)"
        }, {
          block: "<rt></rt>",
          title: "Marks the ruby text component of a ruby annotation"
        }, {
          block: "<rp></rp>",
          title: "Provide parentheses or other content around a ruby text"
        }, {
          block: "<data value=\"\"></data>",
          title: "Represents its contents, along with a machine-readable form of those contents in the value attribute"
        }, {
          block: "<time datetime=\"\"></time>",
          title: "Human-readable date/time"
        }, {
          block: "<code></code>",
          title: "Fragment of computer code"
        }, {
          block: "<var></var>",
          title: "Variable"
        }, {
          block: "<samp></samp>",
          title: "Sample or quoted output from another program"
        }, {
          block: "<kbd></kbd>",
          title: "User input (typically keyboard input)"
        }, {
          block: "<sub></sub>",
          title: "Subscript"
        }, {
          block: "<sup></sup>",
          title: "Superscript"
        }, {
          block: "<i></i>",
          title: "Italic"
        }, {
          block: "<b></b>",
          title: "Bold"
        }, {
          block: "<u></u>",
          title: "Underline"
        }, {
          block: "<mark></mark>",
          title: "Marked text"
        }, {
          block: "<bdi></bdi>",
          title: "Bi-directional Isolation"
        }, {
          block: "<bdo dir=\"\">\n  \n</bdo>",
          title: "Bi-Directional Override"
        }, {
          block: "<span></span>",
          title: "Group inline-elements"
        }, {
          block: "<br />",
          title: "Line break"
        }, {
          block: "<wbr />",
          title: "Line break opportunity"
        }, {
          block: "text",
          title: "Text content"
        }
      ]
    }, {
      name: "Other",
      color: "pink",
      blocks: [
        {
          block: "<ins></ins>",
          title: "Addition to the document"
        }, {
          block: "<del></del>",
          title: "Removal from a document"
        }, {
          block: "<details>\n  \n</details>",
          title: "Additional details that the user can view or hide on demand"
        }, {
          block: "<summary></summary>",
          title: "Visible Heading of a <details> element"
        }, {
          block: "<menu>\n  \n</menu>",
          title: "List/menu of commands"
        }, {
          block: "<menuitem></menuitem>",
          title: "Command/menuitem inside a menu"
        }, {
          block: "<dialog open></dialog>",
          title: "Dialog box or window"
        }, {
          block: "<noscript></noscript>",
          title: "Alternate content for users that have disabled scripts"
        }, {
          block: "<template>\n  \n</template>",
          title: "Declare fragments of HTML that can be cloned and inserted in the document by script"
        }, {
          block: "<canvas></canvas>",
          title: "Draw graphics, on the fly, via scripting"
        }, {
          block: "<svg>\n  \n</svg>",
          title: "Define graphics for the Web"
        }, {
          block: "<frameset cols=\"\">\n  \n</frameset>",
          title: "Holds one or more <frame> elements each of which contains a separate document"
        }
      ]
    }, {
      name: "Embedded",
      color: "teal",
      blocks: [
        {
          block: "<img src=\"\" alt=\"\" />",
          title: "Image"
        }, {
          block: "<iframe>\n  \n</iframe>",
          title: "Nested browsing context"
        }, {
          block: "<embed src=\"\" />",
          title: "Integration point for an external (typically non-HTML) application or interactive content"
        }, {
          block: "<object data=\"\">\n  \n</object>",
          title: "Embedded object within an HTML document"
        }, {
          block: "<param name=\"\" value=\"\" />",
          title: "Parameters for plugins invoked by <object> elements"
        }, {
          block: "<video width=\"\" height=\"\" controls>\n  \n</video>",
          title: "Playing videos or movies, and audio files with captions"
        }, {
          block: "<audio controls>\n  \n</audio>",
          title: "Sound or audio stream"
        }, {
          block: "<source src=\"\" type=\"\" />",
          title: "Specify multiple alternative media resources for media elements"
        }, {
          block: "<track src=\"\" />",
          title: "Explicit external timed text tracks for media elements"
        }, {
          block: "<map name=\"\">\n  \n</map>",
          title: "Define a client-side image-map(image with clickable areas)"
        }, {
          block: "<area shape=\"\" href=\"\" />",
          title: "Area inside an image-map"
        }
      ]
    }, {
      name: "Table",
      color: "indigo",
      blocks: [
        {
          block: "<table>\n  \n</table>",
          title: "Defines a table"
        }, {
          block: "<caption></caption>",
          title: "Table Caption"
        }, {
          block: "<colgroup>\n  \n</colgroup>",
          title: "Group of 1 or more columns"
        }, {
          block: "<col style=\"\"/>",
          title: "Column properties for a single column"
        }, {
          block: "<tbody>\n  \n</tbody>",
          title: "Body of a table"
        }, {
          block: "<thead>\n  \n</thead>",
          title: "Table header"
        }, {
          block: "<tfoot>\n  \n</tfoot>",
          title: "Table footer"
        }, {
          block: "<tr>\n  \n</tr>",
          title: "Row in a table"
        }, {
          block: "<td></td>",
          title: "Standard cell inside a table row"
        }, {
          block: "<th></th>",
          title: "Header cell inside a table row"
        }
      ]
    }, {
      name: "Form",
      color: "deeporange",
      blocks: [
        {
          block: "<form action=\"\">\n  \n</form>",
          title: "Create an HTML form"
        }, {
          block: "<input type=\"\" />",
          title: "Input field where user can enter data"
        }, {
          block: "<label for=\"\"></label>",
          title: "Label for an <input> element"
        }, {
          block: "<button></button>",
          title: "Clickable button"
        }, {
          block: "<select>\n  \n</select>",
          title: "Drop-down list"
        }, {
          block: "<option value=\"\"></option>",
          title: "Option in a <select> list"
        }, {
          block: "<optgroup>\n  \n</optgroup>",
          title: "Group related options in a <select> list"
        }, {
          block: "<datalist>\n  \n</datalist>",
          title: "Pre-defined list of inputs for <input> element with autocomplete"
        }, {
          block: "<textarea>\n  \n</textarea>",
          title: "Multi-line text input"
        }, {
          block: "<keygen />",
          title: "Key-pair generator field"
        }, {
          block: "<output for=\"\"></output>",
          title: "Results of a calculation"
        }, {
          block: "<progress value=\"\" max=\"\"></progress>",
          title: "Progress of a task"
        }, {
          block: "<meter value=\"\"></meter>",
          title: "Scalar measurement within a known range, or a fractional value"
        }, {
          block: "<fieldset>\n  \n</fieldset>",
          title: "Group related items in a form"
        }, {
          block: "<legend></legend>",
          title: "Caption for a <fieldset> element"
        }
      ]
    }
  ],

  KNOWN_FUNCTIONS: {
    '?.fd': {color: 'lightblue', dropdown: [distances]},
    '?.bk': {color: 'lightblue', dropdown: [distances]},
    '?.rt': {color: 'lightblue', dropdown: [angles]},
    '?.lt': {color: 'lightblue', dropdown: [angles]},
    '?.slide': {color: 'lightblue', dropdown: [sdistances]},
    '?.move': {color: 'lightblue', dropdown: [sdistances, sdistances]},
    '?.movexy': {color: 'lightblue', dropdown: [sdistances, sdistances]},
    '?.moveto': {color: 'lightblue', dropdown: [sdistances, sdistances]},
    '?.jump': {color: 'lightblue', dropdown: [sdistances, sdistances]},
    '?.jumpxy': {color: 'lightblue', dropdown: [sdistances, sdistances]},
    '?.jumpto': {color: 'lightblue', dropdown: [sdistances, sdistances]},
    '?.turnto': {color: 'lightblue', dropdown: [sangles]},
    '?.home': {color: 'lightblue'},
    '?.pen': {color: 'purple', dropdown: [colors]},
    '?.fill': {color: 'purple', dropdown: [colors]},
    '?.dot': {color: 'purple', dropdown: [colors, sizes]},
    '?.box': {color: 'purple', dropdown: [colors, sizes]},
    '?.mirror': {color: 'purple'},
    '?.twist': {color: 'purple', dropdown: [sangles]},
    '?.scale': {color: 'purple', dropdown: [scales]},
    '?.pause': {},
    '?.st': {color: 'purple'},
    '?.ht': {color: 'purple'},
    '?.cs': {color: 'purple'},
    '?.cg': {color: 'purple'},
    '?.ct': {color: 'purple'},
    '?.pu': {color: 'purple'},
    '?.pd': {color: 'purple'},
    '?.pe': {},
    '?.pf': {},
    '?.say': {color: 'indigo'},
    '?.play': {color: 'indigo'},
    '?.tone': {color: 'indigo'},
    '?.silence': {color: 'indigo'},
    '?.speed': {color:'lightblue'},
    '?.wear': {color:'purple'},
    '?.drawon': {color:'purple'},
    '?.label': {color: 'pink'},
    '?.reload': {},
    see: {},
    sync: {},
    send: {},
    recv: {},
    '?.click': {color: 'orange'},
    '?.mousemove': {color: 'orange'},
    '?.mouseup': {color: 'orange'},
    '?.mousedown': {color: 'orange'},
    '?.keyup': {color: 'orange'},
    '?.keydown': {color: 'orange'},
    '?.keypress': {color: 'orange'},
    alert: {},
    prompt: {},
    '?.done': {},
    tick: {color: 'orange'},
    forever: {color: 'orange'},
    stop: {color: 'orange'},
    await: {color: 'orange'},
    defer: {color: 'orange'},
    type: {color: 'pink'},
    typebox: {color: 'pink', dropdown: [colors]},
    typeline: {color: 'pink'},
    '*.sort': {},
    log: {color: 'pink'},
    abs: {value: true, color: 'lightgreen'},
    acos: {value: true, color: 'lightgreen'},
    asin: {value: true, color: 'lightgreen'},
    atan: {value: true, color: 'lightgreen'},
    atan2: {value: true, color: 'lightgreen'},
    cos: {value: true, color: 'lightgreen'},
    sin: {value: true, color: 'lightgreen'},
    tan: {value: true, color: 'lightgreen'},
    ceil: {value: true, color: 'lightgreen'},
    floor: {value: true, color: 'lightgreen'},
    round: {value: true, color: 'lightgreen'},
    exp: {value: true, color: 'lightgreen'},
    ln: {value: true, color: 'lightgreen'},
    log10: {value: true, color: 'lightgreen'},
    pow: {value: true, color: 'lightgreen'},
    sqrt: {value: true, color: 'lightgreen'},
    max: {value: true, color: 'lightgreen'},
    min: {value: true, color: 'lightgreen'},
    random: {value: true, color: 'lightgreen'},
    'Math.abs': {value: true, color: 'lightgreen'},
    'Math.acos': {value: true, color: 'lightgreen'},
    'Math.asin': {value: true, color: 'lightgreen'},
    'Math.atan': {value: true, color: 'lightgreen'},
    'Math.atan2': {value: true, color: 'lightgreen'},
    'Math.cos': {value: true, color: 'lightgreen'},
    'Math.sin': {value: true, color: 'lightgreen'},
    'Math.tan': {value: true, color: 'lightgreen'},
    'Math.ceil': {value: true, color: 'lightgreen'},
    'Math.floor': {value: true, color: 'lightgreen'},
    'Math.round': {value: true, color: 'lightgreen'},
    'Math.exp': {value: true, color: 'lightgreen'},
    'Math.log10': {value: true, color: 'lightgreen'},
    'Math.log2': {value: true, color: 'lightgreen'},
    'Math.log': {value: true, color: 'lightgreen'},
    'Math.pow': {value: true, color: 'lightgreen'},
    'Math.sqrt': {value: true, color: 'lightgreen'},
    'Math.max': {value: true, color: 'lightgreen'},
    'Math.min': {value: true, color: 'lightgreen'},
    'Math.random': {value: true, color: 'lightgreen'},
    '?.pagexy': {value: true},
    '?.getxy': {value: true, color:'lightblue'},
    '?.direction': {value: true, color:'lightblue'},
    '?.distance': {value: true, color:'lightblue'},
    '?.shown': {value: true, color:'lightgreen'},
    '?.hidden': {value: true, color:'lightgreen'},
    '?.inside': {value: true, color:'lightgreen'},
    '?.touches': {value: true, color:'lightgreen'},
    '?.within': {value: true, color:'lightgreen'},
    '?.notwithin': {value: true, color:'lightgreen'},
    '?.nearest': {value: true},
    '?.pressed': {value: true, color:'lightgreen'},
    '?.canvas': {value: true},
    hsl: {value: true},
    hsla: {value: true},
    rgb: {value: true},
    rgba: {value: true},
    '*.cell': {value: true},
    '$': {value: true},
    '*.match': {value: true, color:'lightgreen'},
    '*.toString': {value: true},
    '*.charCodeAt': {value: true},
    '*.fromCharCode': {value: true},
    '*.exec': {value: true},
    '*.test': {value: true},
    '*.split': {value: true},
    '*.join': {value: true},
    button: {value: true, command: true, color: 'orange'},
    read: {value: true, command: true, color: 'pink'},
    readstr: {value: true, command: true, color: 'pink'},
    readnum: {value: true, command: true, color: 'pink'},
    write: {value: true, command: true, color: 'pink'},
    table: {value: true, command: true, color: 'yellow'},
    '*.splice': {value: true, command: true},
    '*.append': {value: true, command: true},
    '*.finish': {value: true, command: true},
    '*.text': {value: true, command: true, color: 'pink'},
    loadscript: {value: true, command: true},
    Turtle: {value: true, color: 'teal'},
    Sprite: {value: true, color: 'teal'},
    Piano: {value: true, color: 'teal'},
    Pencil: {value: true, color: 'teal'}
  },

  CATEGORIES: {
    functions: {color: 'lightgreen'},
    returns: {color: 'yellow'},
    comments: {color: 'gray'},
    arithmetic: {color: 'lightgreen'},
    logic: {color: 'lightgreen'},
    containers: {color: 'teal'},
    assignments: {color: 'lightgreen'},
    loops: {color: 'orange'},
    conditionals: {color: 'orange'},
    value: {color: 'lightgreen'},
    command: {color: 'lightgreen'},
    errors: {color: '#f00'}
  }
};
