import pencilcode_internal

# The SpriteObject class wraps a jQuery-turtle object so it can be used in Python.
# This includes Turtle, Sprite, Piano, and Pencil objects.
class SpriteObject():
    def __init__(self, jsSpriteObject):
        self.jsSpriteObject = jsSpriteObject

    ###################
    ## Move Commands ##
    ###################

    def fd(self, distance):
        pencilcode_internal.fd(self.jsSpriteObject, distance)

    def bk(self, distance):
        pencilcode_internal.bk(self.jsSpriteObject, distance)

    def rt(self, angle):
        pencilcode_internal.rt(self.jsSpriteObject, angle)

    def lt(self, angle):
        pencilcode_internal.lt(self.jsSpriteObject, angle)
	
    def ra(self, radius, angle):
        pencilcode_internal.ra(self.jsSpriteObject, radius, angle)
    
    def la(self, radius, angle):
        pencilcode_internal.la(self.jsSpriteObject, radius, angle)
    
    def speed(self, value):
        pencilcode_internal.speed(self.jsSpriteObject, value)
    
    def home(self):
        pencilcode_internal.home(self.jsSpriteObject)
    
    def turnto(self, value):
        pencilcode_internal.turnto(self.jsSpriteObject, value)
    
    def moveto(self, x, y):
        pencilcode_internal.moveto(self.jsSpriteObject, x, y)
    
    def movexy(self, x, y):
        pencilcode_internal.movexy(self.jsSpriteObject, x, y)
    
    def jumpto(self, x, y):
        pencilcode_internal.jumpto(self.jsSpriteObject, x,y)
    
    def jumpxy(self, x, y):
        pencilcode_internal.jumpxy(self.jsSpriteObject, x, y)
    
    def pause(self, value):
        pencilcode_internal.sleep(self.jsSpriteObject, value)


# These commands act on the default turtle object (which is not wrapped.).

###################
## Move Commands ##
###################

def fd(value):
    pencilcode_internal.fd(None, value)

def bk(value):
    pencilcode_internal.bk(None, value)

def rt(value):
    pencilcode_internal.rt(None, value)

def lt(value):
    pencilcode_internal.lt(None, value)

# Fix the rest, Stevie! ;)
def ra(radius, angle):
    pencilcode_internal.ra(None, radius, angle)

def la(radius, angle):
    pencilcode_internal.la(None, radius, angle)

def speed(value):
    pencilcode_internal.speed(None, value)

def home():
    pencilcode_internal.home(None)

def turnto(value):
    pencilcode_internal.turnto(None, value)

def moveto(x, y):
    pencilcode_internal.moveto(None, x, y)

def movexy(x, y):
    pencilcode_internal.movexy(None, x, y)

def jumpto(x, y):
    pencilcode_internal.jumpto(None, x,y)

def jumpxy(x, y):
    pencilcode_internal.jumpxy(None, x, y)

def pause(value):
    pencilcode_internal.sleep(None, value)

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

def click(t):
	pencilcode_internal.click(t)
	
######################
## 		Sprites	    ##
######################
def Turtle(color):
    return SpriteObject(pencilcode_internal.Turtle(color))

def Sprite():
    return SpriteObject(pencilcode_internal.Sprite())
	
def Piano():
    return SpriteObject(pencilcode_internal.Piano())
	
def Pencil():
    return SpriteObject(pencilcode_internal.Pencil())

######################
## 	   Operators	##
######################

def random(a):
	return pencilcode_internal.random(a)
	
def min(a, b = None):
	return pencilcode_internal.min(a,b)
	
