# The recolor function, for Hour of Code 2014.
#
# How to use this function:
# recolor ['/img/400x600-flower', '/img/400x600-red-flower'],
#   (r1, g1, b1, r2, g2, b2) ->
#     red: r1, green: g2, blue: (r2 + b1) / 2
#
# The first argument is an array of image URLs to load.
# The second argument is a recoloring function that takes
#   RGB components of the input functions and outputs RGB
#   components of the output.
# Then recolor will briefly show all the input images on the
#   screen, and then calculate and output image on the
#   screen based on your function.
#   
# Some extra details:
#   Returning a single number creates a grayscale image.
#   Returning an 'alpha' component adds transparency.
#   Grayscale images contribute only 1 channel.
#   Full-color plus alpha images contribute 4 channels.
#   Images are centered on top of each other if different sizes.

global = window
global.recolor = (urls, fn) ->
  # Accept just a function
  if not fn? and _.isFunction(urls) then fn = urls; urls = null
  # Accept also nothing.
  if not urls? then urls = []
  # Accept bare url strings, not in an array.
  if _.isString(urls)
    # Accept any number of arguments.
    args = Array.prototype.slice.call(arguments, 0);
    # If the last one is a function, that's fn.
    if _.isFunction(args[args.length - 1])
      fn = args.pop()
    urls = args
  # If there's no function, just assume identity.
  if not _.isFunction(fn) then fn = _.identity

  # Set things up.  Set a zero sized turtle.
  turtle.speed Infinity
  wear width: 0, height: 0
  if urls.length > 1
    label '...',
      zIndex: 3, color: white, font: '20px sans-serif',
      textShadow: '0px 0px 7px black', turtleSpeed: Infinity
      id: 'recolorlabel'
  turtle.speed 'turtle'
  
  # A couple short timeouts.
  sec = (fn) -> setTimeout(fn, 1000)
  moment = (fn) -> setTimeout(fn, 0)

  # Create a sprite for each argument, wearing the requested image.
  # Load them one at a time, so they are visible briefly.
  sprites = []
  data = []
  for url in urls
    s = new Sprite width: 0, height: 0
    s.speed Infinity
    s.css zIndex: 2
    # Load a url, and wait for it to finish loading.
    s.wear(url)
    await s.done defer()
    # How many color channels does this sprite have?
    d = s.imagedata()
    b = d.data
    # Start assuming one channel.
    d.channels = 1
    for i in [0...b.length] by 4
      # If red or green or blue differ by more than 1%, then three channels.
      # if d.channels is 1 and not (b[i] is b[i + 1] is b[i + 2])
      #   console.log('not gray', i, b[i], b[i+1], b[i+2])
      if abs(b[i] - b[i+1]) > 3 or abs(b[i] - b[i+2]) > 3
        d.channels = 3
      # And also note an alpha channel.
      if b[i + 3] < 255
        d.alpha = true
    if d.alpha and d.channels is 3 then d.channels = 4
    sprites.push s
    data.push d
    # Describe the image, its dimensions, and number of channels.
    $('#recolorlabel').text url.split('/').pop() +
        ": #{d.width}x#{d.height}x#{d.channels}"
    $('#recolorlabel').moveto window
    await sec defer()
  
  # Get the maximum dimensions of all the sprites.
  maxheight = max(64, _.max _.map sprites, (s) -> s.height())
  maxwidth = max(64, _.max _.map sprites, (s) -> s.width())
  for d in data
    d.xoff = floor((maxwidth - d.width) / 2)
    d.yoff = floor((maxheight - d.height) / 2)

  # Make an output sprite.
  out = turtle
  out.wear width: maxwidth, height: maxheight
  out.css zIndex: 5
  a = (0 for [0...maxheight * maxwidth * 4])
  
  # This function fills in one pixel using the student fn.
  dopixel = (x, y) ->
    # Collect this pixel from each of the input channels.
    inputs = []
    for d in data
      for c in [0...d.channels]
        if d.xoff <= x < d.xoff + d.width and
           d.yoff <= y < d.yoff + d.height
          inputs.push d.data[c + 4 *
              (x - d.xoff + (y - d.yoff) * d.width)]
        else
          inputs.push 0
    # Call the student function, providing all inputs.
    result = fn.apply(null, inputs)
    # If the answer is a number, then it's grayscale.
    if $.isNumeric(result) then result = [result]
    # If the answer is an object, look for {red:, green:, blue:}.
    if $.isPlainObject(result) then result = [
      result.red ? result.r ? 0
      result.green ? result.g ? 0
      result.blue ? result.b ? 0
      result.alpha ? result.a ? 255
    ]
    # Nothing returned?  Assume blackness.
    # if not result? then result = [0]
    # If it's less than 3 components, gray-up to 3.
    while result.length < 3 then result.push(result[0] or 0)
    # If less than 4 components, assume it's opaque.
    if result.length < 4 then result.push(255)
    # If longer than 4 components, truncate to 4.
    result.length = 4
    # Now copy in the components, pegging to 0..255.
    loc = (y * maxwidth + x) * 4
    for j in [0...4]
      a[loc + j] = min(255, max(0, round(result[j])))

  # Now go through in 64x64 blocks and call the student
  # function to combine the image data
  for yy in [0...maxheight] by 64
    for xx in [0...maxwidth] by 64
      # Do just 64x64 pieces of work.
      for dy in [0...64]
        y = yy + dy
        if y >= maxheight then continue
        for dx in [0...64]
          x = xx + dx
          if x >= maxwidth then continue
          dopixel x, y
      # draw after each 64x64 block is done
      imd = width: maxwidth, height: maxheight, data: a
      out.imagedata imd
      # wait a moment to let the browser draw
      await moment defer()

  # clean up the temporary objects
  remove $('#recolorlabel'), sprites
  speed 1
