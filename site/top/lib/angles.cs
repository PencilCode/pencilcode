window.showangle = (x, c) ->
  turtle.plan ->
    t = hatch """
      <code>#{abs(x).toFixed(2).replace(/\.00$/, '')}&deg;</code>"""
    t.speed Infinity
    t.ht()
    t.moveto turtle
    t.turnto turtle.direction()
    t.css { turtleScale: turtle.css('turtleScale') }
    t.pen c
    t.fd 100
    t.bk 50
    t.rt 90
    t.speed turtle.css 'turtleSpeed'
    t.rt x, 50
    t.speed Infinity
    t.rt -x / 2, 50
    t.lt 90
    t.pen null
    t.fd 25
    t.turnto 0
    t.st()

window.showarc = (a, r, c) ->
  turtle.plan ->
    t = hatch """
      <code>#{abs(a).toFixed(2).replace(/\.00$/, '')}&deg;</code>"""
    t.speed Infinity
    t.ht()
    t.moveto turtle
    t.turnto turtle.direction()
    t.css { turtleScale: turtle.css('turtleScale') }
    t.pen c
    t.rt 90
    t.fd r
    t.dot c
    t.lt 180
    t.speed turtle.css 'turtleSpeed'
    t.rt a
    t.speed Infinity
    t.fd r
    t.pen null
    t.bk r
    t.lt a / 2
    t.fd r / 2
    t.turnto 0
    t.st()
    
window.rt = (x, r) ->
  if r
    showarc x, r, orange
  else
    showangle x, orange
  turtle.rt.apply turtle, arguments

window.lt = (x, r) ->
  if r
    showarc -x, -r, orange
  else
    showangle -x, orange
  turtle.lt.apply turtle, arguments
