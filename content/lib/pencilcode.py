import turtle
import time
import pencilcode_internal

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
    pencilcode_internal.fd(value)

def bk(value):
    pencilcode_internal.bk(value)

def rt(value):
    pencilcode_internal.rt(value)

def lt(value):
    pencilcode_internal.lt(value)

def ra(angle, radius):
    pencilcode_internal.ra(-radius, angle)

def la(angle, radius):
    pencilcode_internal.la(radius, angle)

def speed(value):
    pencilcode_internal.speed(value * 1.25)

def home():
    #penInfo, _, _ = __getStateAndHide()
    #myTurtle.home()
    #__restoreStateAndShow(penInfo, None, 90)
	pencilcode_internal.home()

def turnto(value):
    #myTurtle.setheading(value)
	pencilcode_internal.turnto(value)

def moveto(x, y):
   pencilcode_internal.moveto(x, y)

def movexy(x, y):
    pencilcode_internal.moveto(myTurtle.xcor() + x, myTurtle.ycor() + y)

def jumpto(x, y):
    #penInfo, _, _ = __getStateAndHide()
    #__restoreStateAndShow(penInfo, [x, y], None)
	pencilcode_internal.jumpto(x,y)

def jumpxy(x, y):
    pencilcode_internal.jumpto(myTurtle.xcor() + x, myTurtle.ycor() + y)

def pause(value):
    pencilcode_internal.sleep(value)

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

def play(tone):
    pencilcode_internal.play(tone)

def tone(a, b):
	pencilcode_internal.tone(a, b)
	
#def tone(a, s):
#	pencilcode_internal.tone(a, s)
	
def silence():
	pencilcode_internal.silence()
	
def say(a):
	pencilcode_internal.say(a)
	
######################
## Control Commands ##
######################


def button(buttonClick):
	pencilcode_internal.button(buttonClick)

def keydown(key):
	pencilcode_internal.keydown(key)

def click(click):
	pencilcode_internal.click(click)
	
######################
## 		Sprites	    ##
######################

def Turtle(a):
	pass
	
def Sprite():
	pass
	
def Piano():
	pass
	
def Pencil():
	pass
	
######################
## 	   Operators	##
######################

def random(a):
	pass
	
###################
## Text Commands ##
###################

def write(message):
    # TODO
    pass

def debug(object):
    myTurtle.debug(object)

def type(message):
    myTurtle.write(message)

def typebox(color):
	myTurtle.typebox(color)
	
def typeline():
    print('\n')

def label(name):
    myTurtle.write(name)

def await(lamda_exp):
    # TODO - this might be tricky
    pass

def read(prompt):
    # TODO - this might be tricky
    pass

def readnum(prompt):
    # TODO - this might be tricky
    pass

myTurtle = turtle.Turtle()
myTurtle.speed(0)
myTurtle.setheading(90)
myTurtle.penup()
myTurtle.pensize(2)
myTurtle.pencolor("red")
myTurtle.speed(1.25)
