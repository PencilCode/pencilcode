# The code is clearer if we name the global scope.
global = this

# Hide the turtle by default
ht()

# Format the document like an old teletype.
$("body").css
  fontFamily: "monospace"
  whiteSpace: "pre"

counts = [] # A map of char: counts for each line.
keys = {}   # A map of char: true for unique chars.
lineno = 0  # The current line number, start at 0.

# Define a function print that just appends text
# to the document body.
global.print = print = (text) ->
  for c in text
    countchar(c)
  $('body').append(text)

# The countchar function takes a single character
# and counts it in the count map for the line.
# It also keeps track of the current line number.
countchar = (text) ->
  if '\n' in text then lineno += 1
  else
    if text not of keys
      keys[text] = true
    if not counts[lineno]
      counts[lineno] = {}
    if text not of counts[lineno]
      counts[lineno][text] = 0
    counts[lineno][text] += 1

# The tally function displays the countchar
# as a nice table in the corner of the screen.
global.tally = tally = ->
  t = table(counts.length + 1, _.size(keys) + 1)
  t.css
    position: 'absolute'
    top: 10
    right: 10
    background: yellow
  
  t.cell(0, 0).text(' Characters ')
  
  col = 0
  for y of keys
    col += 1
    t.cell(0, col).text("'#{y}'")
  for x in [0...counts.length]
    t.cell(x + 1, 0).text(" Line #{x + 1} ")
    col = 0
    for y of keys
      col += 1
      t.cell(x + 1, col).text("#{counts[x][y] || 0}")

