import turtle
import time

###################
## Move Commands ##
###################

def __getPenDictionary():
    return { "shown": myTurtle.isvisible(), "pendown": myTurtle.isdown(), "pencolor": myTurtle.pencolor(),
             "fillcolor": myTurtle.fillcolor, "pensize": myTurtle.pensize(), "speed": myTurtle.speed() }

def __setPenState(penstate):
    myTurtle.pencolor(penstate["pencolor"])
    myTurtle.fillcolor(penstate["fillcolor"])
    myTurtle.pensize(penstate["pensize"])
    myTurtle.speed(penstate["speed"])

    if penstate["shown"]:
        myTurtle.showturtle()
    else:
        myTurtle.hideturtle()

    if penstate["pendown"]:
        myTurtle.pendown()
    else:
        myTurtle.penup()


def __getStateAndHide():
    result = (__getPenDictionary(), myTurtle.pos(), myTurtle.heading())
    myTurtle.hideturtle()
    myTurtle.penup()
    myTurtle.speed(0)
    return result

def __restoreStateAndShow(penInfo, position, heading):
    if (position != None):
        myTurtle.setpos(position)
    if (heading != None):
        myTurtle.setheading(heading)
    if (penInfo != None):
        __setPenState(penInfo)

def fd(value):
    myTurtle.fd(value)

def bk(value):
    myTurtle.back(value)

def rt(value):
    myTurtle.right(value)

def lt(value):
    myTurtle.left(value)

def ra(angle, radius):
    myTurtle.circle(-radius, angle)

def la(angle, radius):
    myTurtle.circle(radius, angle)

def speed(value):
    myTurtle.speed(value * 1.25)

def home():
    penInfo, _, _ = __getStateAndHide()
    myTurtle.home()
    __restoreStateAndShow(penInfo, None, 90)

def turnto(value):
    myTurtle.setheading(value)

def moveto(x, y):
    myTurtle.goto(x, y)

def movexy(x, y):
    moveto(myTurtle.xcor() + x, myTurtle.ycor() + y)

def jumpto(x, y):
    penInfo, _, _ = __getStateAndHide()
    __restoreStateAndShow(penInfo, [x, y], None)

def jumpxy(x, y):
    jumpto(myTurtle.xcor() + x, myTurtle.ycor() + y)

def pause(value):
    time.sleep(value)

##################
## Art Commands ##
##################

def hide():
    myTurtle.hideturtle()

def show():
    myTurtle.showturtle()

def cs():
    myTurtle.clear()

def pu():
    myTurtle.penup()

def pd():
    myTurtle.pendown()

def pen(color, size=None):
    myTurtle.pencolor(color)
    if (size != None):
        myTurtle.pensize(size)
    myTurtle.pendown()

def dot(color, size):
    myTurtle.dot(size, color)

def begin_fill(color):
    myTurtle.fillcolor(color)
    myTurtle.begin_fill()

def end_fill():
    myTurtle.end_fill()

def begin_poly():
    myTurtle.begin_poly()

def end_poly():
    myTurtle.end_poly()

def get_poly():
    return myTurtle.get_poly()

def make_shape(name, polygon, fillcolor, outlineColor):
    s = turtle.Shape(name)
    s.addcomponent(polygon, fillcolor, outlineColor)

def wear(name):
    myTurtle.shape(name)

def img(path):
    print "**img(path) not implemented**\n"
    # TODO

###################
## Text Commands ##
###################

def write(message):
    # TODO
    pass

def debug(object):
    # TODO
    pass

def type(message):
    # TODO - typewrites on document
    pass

def typebox(color):
    # TODO
    pass

def typeline():
    # TODO - type a newline
    pass

def label(name):
    # TODO
    pass

def await(lamda_exp):
    # TODO - this might be tricky
    pass

def read(prompt):
    # TODO - this might be tricky
    pass

def readnum(prompt):
    # TODO - this might be tricky
    pass

####################
## Sound Commands ##
####################

myTurtle = turtle.Turtle()
myTurtle.speed(0)
myTurtle.setheading(90)
myTurtle.penup()
myTurtle.pensize(2)
myTurtle.pencolor("red")
myTurtle.speed(1.25)
