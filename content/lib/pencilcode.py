import pencilcode_internal

normal = 'normal'
uniform = 'uniform'
position = 'position'
color = 'color'
colour = 'color'
gray = 'gray'
grey = 'gray'
window = "window"

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

    def rt(self, angle, radius=0):
        pencilcode_internal.ra(self.jsSpriteObject, angle, radius)

    def lt(self, angle, radius=0):
        pencilcode_internal.la(self.jsSpriteObject, angle, radius)

    def ra(self, angle, radius=0):
        pencilcode_internal.ra(self.jsSpriteObject, angle, radius)

    def la(self, angle, radius=0):
        pencilcode_internal.la(self.jsSpriteObject, angle, radius)
    
    def speed(self, value):
        pencilcode_internal.speed(self.jsSpriteObject, value)
    
    def home(self):
        pencilcode_internal.home(self.jsSpriteObject)
    
    def turnto(self, value):
        pencilcode_internal.turnto(self.jsSpriteObject, value)
    
    def moveto(self, x, y = None):
        pencilcode_internal.moveto(self.jsSpriteObject, x, y)
    
    def movexy(self, x, y):
        pencilcode_internal.movexy(self.jsSpriteObject, x, y)
    
    def jumpto(self, x, y):
        pencilcode_internal.jumpto(self.jsSpriteObject, x,y)
    
    def jumpxy(self, x, y):
        pencilcode_internal.jumpxy(self.jsSpriteObject, x, y)
    
    def pause(self, value):
        pencilcode_internal.pause(self.jsSpriteObject, value)
	
    def getxy(self):
        return pencilcode_internal.getxy(self.jsSpriteObject)
		
    ######################
    ## Control Commands ##
    ######################
    def button(self, buttonClick, callee):
        pass#pencilcode_internal.button(self.jsSpriteObject, buttonClick, callee)
    
    def keydown(self, func, key = None):
        pass#pencilcode_internal.keydown(self.jsSpriteObject, key)
    
    def click(self, t):
        pass#pencilcode_internal.click(self.jsSpriteObject, t)
		
    ##################
    ## Art Commands ##
    ##################
    
    def hide(self):
        pencilcode_internal.hide(self.jsSpriteObject)
    
    def show(self):
        pencilcode_internal.show(self.jsSpriteObject)
    
    def cs(self):
        pass#pencilcode_internal.cs(self.jsSpriteObject)
		
    def ht(self):
        pencilcode_internal.ht(self.jsSpriteObject)
		
    def st(self):
        pencilcode_internal.st(self.jsSpriteObject)
    
    def pu(self):
        pencilcode_internal.pu(self.jsSpriteObject)
    
    def pd(self):
        pencilcode_internal.pd(self.jsSpriteObject)
    	
    def box(self, a, b):
        pencilcode_internal.box(self.jsSpriteObject,a,b)
    def box(self, a):
	pencilcode_internal.box(self.jsSpriteObject,a,10)

    def grow(self, a):
        pencilcode_internal.grow(self.jsSpriteObject,a)
    
    def pen(self, color=None, size=None):
		pencilcode_internal.pen(self.jsSpriteObject,color, size)

    def dot(self, color=None, size=None):
		pencilcode_internal.dot(self.jsSpriteObject,color,size)

    def arrow(self, color, size):
        pencilcode_internal.arrow(self.jsSpriteObject, color, size)	    
    
    def fill(self, color):
        pencilcode_internal.fill(self.jsSpriteObject,color)
    
    def wear(self, name):
        pencilcode_internal.wear(self.jsSpriteObject,name)
    
    def drawon(self, canvas):
        pencilcode_internal.drawon(self.jsSpriteObject,canvas.jsSpriteObject)
        
    #def cell(self, rows, columns):
    #    pencilcode_internal.cell(self.jsSpriteObject, rows, columns)
	
    def shown(self):
        return pencilcode_internal.shown(self.jsSpriteObject)
        
    def hidden(self):
        return pencilcode_internal.hidden(self.jsSpriteObject)
        
    def touches(self, obj):
        return pencilcode_internal.touches(self.jsSpriteObject, obj)
        
    def inside(self, obj):

        return pencilcode_internal.inside(self.jsSpriteObject, obj if obj == window else obj.jsSpriteObject)

    ####################
    ## Sound Commands ##
    ####################
    
    def play(self, tone):
        pencilcode_internal.play(self.jsSpriteObject, tone)
    	
    def tone(self, a, b, c = None):
        pencilcode_internal.tone(self.jsSpriteObject, a, b, c)
    	
    def silence(self):
        pencilcode_internal.silence(self.jsSpriteObject)
    	
    def say(self, a):
        pencilcode_internal.say(self.jsSpriteObject, a)

    def audioplay(self, url):
	player = pencilcode_internal.audioplay(self.jsSpriteObject, url)
	
# These commands act on the default turtle object (which is not wrapped.).

###################
## Move Commands ##
###################

def fd(value):
    pencilcode_internal.fd(None, value)

def bk(value):
    pencilcode_internal.bk(None, value)

def rt(angle, radius = 0):
    pencilcode_internal.ra(None, angle, radius)

def lt(angle, radius = 0):
    pencilcode_internal.la(None, angle, radius)

def ra(angle, radius=0):
    pencilcode_internal.ra(None, angle, radius)

def la(angle, radius=0):
    pencilcode_internal.la(None, angle, radius)

# Fix the rest, Stevie! ;)# All Done Jem! :)

def speed(value):
    pencilcode_internal.speed(None, value)

def home():
    pencilcode_internal.home(None)

def turnto(value):
    pencilcode_internal.turnto(None, value)

def moveto(x, y = None):
    pencilcode_internal.moveto(None, x, y)

def movexy(x, y):
    pencilcode_internal.movexy(None, x, y)

def jumpto(x, y):
    pencilcode_internal.jumpto(None, x,y)

def jumpxy(x, y):
    pencilcode_internal.jumpxy(None, x, y)

def getxy():
	return pencilcode_internal.getxy(None)
	
def pause(value):
    pencilcode_internal.pause(None, value)

##################
## Art Commands ##
##################

def hide():
    pencilcode_internal.hide(None)

def show():
    pencilcode_internal.show(None)

def cs():
    pencilcode_internal.cs(None)
	
def ht():
    pencilcode_internal.ht(None)
	
def st():
    pencilcode_internal.st(None)

def pu():
    pencilcode_internal.pu(None)

def pd():
    pencilcode_internal.pd(None)
	
def box(a, b):
	pencilcode_internal.box(None,a,b)

def box(a):
	pencilcode_internal.box(None,a,10)

def grow(a):
	pencilcode_internal.grow(None,a)
	
def img(pic):
	return SpriteObject(pencilcode_internal.img(None, pic))

def pen(color=None, size=None):
	pencilcode_internal.pen(None,color, size)

def dot(color=None, size=None):
	pencilcode_internal.dot(None,color,size)
    
def arrow(color, size):
    pencilcode_internal.arrow(None, color, size)

def fill(color):
	pencilcode_internal.fill(None,color)

def wear(name):
    pencilcode_internal.wear(None,name)

def drawon(canvas):
	pencilcode_internal.drawon(None,canvas.jsSpriteObject)
	
def shown():
    return pencilcode_internal.shown(None)
    
def hidden():
    return pencilcode_internal.hidden(None)
    
def touches(obj):
    return pencilcode_internal.touches(None, obj)
    
def inside(obj):

	return pencilcode_internal.inside(None, obj if obj == window else obj.jsSpriteObject)
###################
## Text Commands ##
###################

def write(*args):
    x = 0
    message = ''
    for arg in args:
        message = message + arg + ' '
        x += 1
    if x == 0:
        raise AssertionError('Too few arguments passed in to write()')
    pencilcode_internal.write(message)

def debug(object):
    pencilcode_internal.debug(object)

def type(*args):
    x = 0
    message = ''
    for arg in args:
        message = message + arg
        x += 1
    if x == 0:
        raise AssertionError('Too few arguments passed in to type()')
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

def read(prompt, func = None):
    return pencilcode_internal.read(prompt, func)

def readnum(prompt, func = None):
    return pencilcode_internal.readnum(prompt, func)
	
def readstr(prompt, func = None):
	return pencilcode_internal.readstr(prompt, func)

####################
## Sound Commands ##
####################

def play(tone):
    pencilcode_internal.play(None, tone)
	
def tone(a, b, c = None):
	pencilcode_internal.tone(None, a, b, c)
	
def silence():
	pencilcode_internal.silence(None)
	
def say(a):
	pencilcode_internal.say(None, a)
def audioplay(url):
	pencilcode_internal.audioplay(None, url)
######################
## Control Commands ##
######################


def button(buttonClick, callee):
	pencilcode_internal.button(None, buttonClick, callee)

def keydown(func, key = None):
	pencilcode_internal.keydown(None, key, func)
	
def pressed(key):
	return pencilcode_internal.pressed(key)

def click(t):
	pencilcode_internal.click(None, t)
	
def forever(func):
	pencilcode_internal.forever(func)
	
def tick(tps, func):
	pencilcode_internal.tick(tps, func)
	
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
    
def copy():
    return SpriteObject(pencilcode_internal.copy())
    
def table(rows, columns):
    return SpriteObject(pencilcode_internal.table(rows, columns))
	
def cell(rows, columns):
	return SpriteObject(pencilcode_internal.cell(None, rows, columns))
    
######################
## 	   Operators	##
######################

def random(a):
	return pencilcode_internal.random(a)
	
def min(a, b = None):
	return pencilcode_internal.min(a,b)
	
	
	
