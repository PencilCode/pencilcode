###

The Keyboard class provides a rendering of
a piano keyboard that can color notes as they
are played.  Example:

await loadscript '/lib/keyboard.coffee', defer()
k = new Keyboard
k.play "[CEG]"

The function "play" uses the same ABC notation
that is used with the built in Pencil Code play
function.  Google for "ABC notation" on the web.

Here is a an example that with tempo, beats,
a rest, a semitone, an octave, and a chord:

k.play {tempo: 150}, "c G/2 G/2 A G z B [_B,CEGc]"

Implementation notes: currently keyboard drawing is
slower than it should be.  It should be sped up.

A specific key can be highlighted by just saying
something like this:

k.draw(64, blue)

The number used is the midi number for the key,
where 60 is middle C.

###

class Keyboard extends Sprite
  constructor: (options = {}) ->
    defwidth = if options.kh?
        (options.kh / 5)
      else
        10
    @kw = options.kw ? defwidth
    @kh = options.kh ? @kw * 5
    @bkw = options.bkw ? @kw * 3 / 5
    @bkh = options.bkh ? @kh * 3 / 5
    @lowest = options.lowest ? 21
    @highest = options.highest ? 108
    @horiz = @calcHoriz()
    @kt = new Turtle
    @kt.ht()
    @kt.speed Infinity
    @pt = this
    # Render the keyboard as its own sprite
    # that can be moved around.
    super
      width: @horiz.right - @horiz.left + 2
      height: @kh + 2
    @kt.drawon this
    do @drawall

  calcHoriz: () ->
    leftmost = Keyboard.wcp(@lowest)
    rightmost = Keyboard.wcp(@highest) + 1
    # if the highest key is a black key
    # then go right one more space
    if (Keyboard.keyshape(@highest) >= 8)
      rightmost += 1
    return {
      left: leftmost * @kw
      right: rightmost * @kw
      mid: (leftmost + rightmost) * @kw / 2
    }

  # white-key position: gives a number
  # that increases by 1 for every white
  # key, or that is the next lower white
  # key number for every black key.
  @wcp: (n) ->
    floor((n + 7) / 12 * 7) - 4

  # A code for the shape of the key number.
  @keyshape: (n) ->
    [1,8,2,9,3,4,10,5,11,6,12,7][n % 12]

  # A colorful color to use for the key number.
  @keycolor: (n) ->
    hsl(n / 12 * 360, 1, 0.5)

  play: ->
    args = Array.prototype.slice.call(
      arguments, 0)
    if (args.length <= 0 or
        not $.isPlainObject(args[0]))
      args.unshift({})
    args[0].callback = @makecallback(
      args[0].callback)
    Sprite.prototype.play.apply(@pt, args)

  draw: (n, fillcolor) ->
    if not (@lowest <= n <= @highest)
      return
    if not fillcolor?
      if Keyboard.keyshape(n) >= 8
        fillcolor = black
      else
        fillcolor = white
    @kt.pen path
    @keyoutline(@kt, n)
    @kt.fill fillcolor
    @kt.pen black
    @keyoutline(@kt, n)

  drawall: ->
    for n in [@lowest..@highest]
      @draw(n)

  makecallback: (cb2) ->
    pressed = []
    convertfreq = (f) ->
      round(69 + ln(f / 440) * 12 / ln(2))
    callback = (d) =>
      for p in pressed
        @draw(p)
      pressed.length = 0
      if not d?.frequency then return
      for f in d.frequency
        midikey = convertfreq f
        pressed.push midikey
        @draw midikey, Keyboard.keycolor midikey
      if cb2
        cb2(d)
    return callback

  keyoutline: (kt, n) ->
    # TODO: replace this with high-performance
    # canvas drawing code.
    startx = @kw * Keyboard.wcp(n) - @horiz.mid
    starty = -@kh / 2
    kt.jumpto this
    kt.turnto this.direction()
    # top width of the c key
    ckw = (3 * @kw - 2 * @bkw) / 3
    # top width of the f key
    fkw = (4 * @kw - 3 * @bkw) / 4
    ks = Keyboard.keyshape(n)
    # key shapes are modified for the lowest
    # and highest keys on the piano.
    ll = n is @lowest
    hh = n is @highest
    if ks >= 8
      starty += @kh - @bkh
    switch ks
      when 8
        startx += ckw
      when 9
        startx += 2 * ckw + @bkw - @kw
      when 10
        startx += fkw
      when 11
        startx += 2 * fkw + @bkw - @kw
      when 12
        startx += 3 * fkw + 2 * @bkw - 2 * @kw
    kt.jump startx, starty
    switch ks
      when 1
        kt.fd @kh
        kt.slide ckw
        if hh
          kt.slide @kw - ckw
          kt.bk @kh
        else
          kt.bk @bkh
          kt.slide @kw - ckw
          kt.bk @kh - @bkh
        kt.slide -@kw
      when 2
        if ll
          kt.fd @kh
          kt.slide (@kw - ckw) / 2
        else
          kt.fd @kh - @bkh
          kt.slide (@kw - ckw) / 2
          kt.fd @bkh
        kt.slide ckw
        if hh
          kt.slide (@kw  - ckw) / 2
          kt.bk @kh
        else
          kt.bk @bkh
          kt.slide (@kw - ckw) / 2
          kt.bk @kh - @bkh
        kt.slide -@kw
      when 3
        if ll
          kt.fd @kh
          kt.slide @kw - ckw
        else
          kt.fd @kh - @bkh
          kt.slide @kw - ckw
          kt.fd @bkh
        kt.slide ckw
        kt.bk @kh
        kt.slide -@kw
      when 4
        kt.fd @kh
        kt.slide fkw
        if hh
          kt.slide @kw - fkw
          kt.bk @kh
        else
          kt.bk @bkh
          kt.slide @kw - fkw
          kt.bk @kh - @bkh
        kt.slide -@kw
      when 5
        if ll
          kt.fd @kh
          kt.slide fkw + @bkw - @kw
        else
          kt.fd @kh - @bkh
          kt.slide fkw + @bkw - @kw
          kt.fd @bkh
        kt.slide fkw
        if hh
          kt.slide 2 * @kw - 2 * fkw - @bkw
          kt.bk @kh
        else
          kt.bk @bkh
          kt.slide 2 * @kw - 2 * fkw - @bkw
          kt.bk @kh - @bkh
        kt.slide -@kw
      when 6
        if ll
          kt.fd @kh
          kt.slide 2 * @kw - 2 * fkw - @bkw
        else
          kt.fd @kh - @bkh
          kt.slide 2 * @kw - 2 * fkw - @bkw
          kt.fd @bkh
        kt.slide fkw
        if hh
          kt.slide fkw + @bkw - @kw
          kt.bk @kh
        else
          kt.bk @bkh
          kt.slide fkw + @bkw - @kw
          kt.bk @kh - @bkh
        kt.slide -@kw
      when 7
        if ll
          kt.fd @kh
          kt.slide @kw - fkw
        else
          kt.fd @kh - @bkh
          kt.slide @kw - fkw
          kt.fd @bkh
        kt.slide fkw
        kt.bk @kh
        kt.slide -@kw
      when 8, 9, 10, 11, 12
        kt.fd @bkh
        kt.slide @bkw
        kt.bk @bkh
        kt.slide -@bkw

# Export the Keyboard class as a global.
window.Keyboard = Keyboard
