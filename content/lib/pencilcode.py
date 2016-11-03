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
    pencilcode_internal.hide()

def show():
    pencilcode_internal.show()

def cs():
    pencilcode_internal.cs()

def pu():
    pencilcode_internal.pu()

def pd():
    pencilcode_internal.pd()
	
def box(a, b):
	pencilcode_internal.box(a,b)

def grow(a):
	pencilcode_internal.grow(a)

def pen(color, size):
	pencilcode_internal.pen(color, size)

def dot(color, size):
    pencilcode_internal.dot(color, size)

def fill(color):
	pencilcode_internal.fill(color)

def wear(name):
    pencilcode_internal.wear(name)

def drawon(path):
	pencilcode_internal.drawon(path)
	

###################
## Text Commands ##
###################

def write(message):
    pencilcode_internal.write(message)

def debug(object):
    pencilcode_internal.debug(object)

def type(message):
    pencilcode_internal.type(message)

def typebox(color):
    pencilcode_internal.typebox(color)

def typeline():
    pencilcode_internal.typeline()

def label(name):
    pencilcode_internal.label(name)

def await(lamda_exp):
    # TODO - this might be tricky
    pass

def read(prompt):
    pencilcode_internal.read(prompt)

def readnum(prompt):
    pencilcode_internal.readnum(prompt)

####################
## Sound Commands ##
####################

def play(tone):
    pencilcode_internal.play(tone)
	
def tone(a, b, c = None):
	pencilcode_internal.tone(a, b, c)
	
def silence():
	pencilcode_internal.silence()
	
def say(a):
	pencilcode_internal.say(a)
	
######################
## Control Commands ##
######################


def button(buttonClick, callee):
	pencilcode_internal.button(buttonClick, callee)

def keydown(key):
	pencilcode_internal.keydown(key)

def click(click):
	pencilcode_internal.click(click)
	
######################
## 		Sprites	    ##
######################

def Turtle(a):
	pass#pencilcode_internal.Turtle(a)
	
def Sprite():
	pass#pencilcode_internal.Sprite()
	
def Piano():
	pass#pencilcode_internal.Piano()
	
def Pencil():
	pass#pencilcode_internal.Pencil()
	
######################
## 	   Operators	##
######################

def random(a):
	pass
	

myTurtle = turtle.Turtle()
myTurtle.speed(0)
myTurtle.setheading(90)
myTurtle.penup()
myTurtle.pensize(2)
myTurtle.pencolor("red")
myTurtle.speed(1.25)
