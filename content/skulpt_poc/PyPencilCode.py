import turtle
import time

myTurtle = turtle.Turtle()
myTurtle.penup()
myTurtle.speed(5)

###################
## Move Commands ##
###################

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
    myTurtle.speed(value)

def home():
    myTurtle.home()

def turnto(value):
    myTurtle.setheading(value)

def moveto(x, y):
    myTurtle.goto(x, y)

def movexy(x, y):
    moveto(myTurtle.xcor() + x, myTurtle.ycor() + y)

def jumpto(x, y):
    penDown = myTurtle.isdown()
    mySpeed = myTurtle.speed()
    myTurtle.penup()
    myTurtle.speed(0)
    myTurtle.goto(x, y)
    myTurtle.speed(mySpeed)
    if (penDown): myTurtle.pendown()

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

def pen(color, size):
    myTurtle.pencolor(color)
    myTurtle.pensize(size)
#    myTurtle.pen(pencolor=color, pensize=size)
    myTurtle.pendown()

def dot(color, size):
    myTurtle.dot(size, color)

def box(color, size):
    print "**box(color,size) not implemented**\n"
    # TODO

def fill(color):
    print "**fill(color) not implemented**\n"
    # TODO
    pass

def wear(name):
    print "**wear(name) not implemented**\n"
    # TODO

def img(path):
    print "**img(path) not implemented**\n"
    # TODO

def grow(value):
    print "**grow(value) not implemented**\n"
    # TODO

def drawon(sprite):
    print "**drawon(sprite) not implemented**\n"
    # TODO - one option is document?

##################
## Art Commands ##
##################

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

# TODO
