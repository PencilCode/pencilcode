/*
 Implementation of the Python Pencil Code internal calls; holds functions which can only be called from JavaScript.

 Note: __name__ is implicit (see Python documentation.)

 ['__doc__', '__file__', '__name__', '__package__', 'accept2dyear', 'altzone', 'asctime', 'clock', 'ctime', 'daylight', 'gmtime', 'localtime', 'mktime', 'sleep', 'strftime', 'strptime', 'struct_time', 'time', 'timezone', 'tzname', 'tzset']

 */

var $builtinmodule = function (name) {
    var mod = {};

    // These are set for compatibility with Python conventions; normally these are handled internally by Python.
    mod.__file__ = "/lib/pencilcode_internal/__init__.js";
    mod.__package__ = Sk.builtin.none.none$;

    // The doc string cannot be added in code as is usually done in Python, so we set it manually here.
    mod.__doc__ = "This module provides implemention of the Pencil Code internal functions in Python.";

    // Sk.builtin.func creates a Python function out of a JS function
    mod.addalemon = new Sk.builtin.func(function (data) {
        // Check arguments: func name, arguments passed, min number, max number
        Sk.builtin.pyCheckArgs("dumps", arguments, 1, 1);
        return Sk.ffi.remapToJs(data) + " with a lemon";
    });

	//MOVE
    // Wrapper for functions in jquery-turtle.js; See for more options!
    mod.fd = new Sk.builtin.func(function (sprite, distance) {
        Sk.builtin.pyCheckArgs("fd", arguments, 2, 2);
        if (sprite/* turtle */ === Sk.builtin.none.none$) {
            return fd(Sk.ffi.remapToJs(distance));
        }
        return sprite.fd(Sk.ffi.remapToJs(distance));
    });
	
    mod.bk = new Sk.builtin.func(function (sprite, distance) {
        Sk.builtin.pyCheckArgs("bk", arguments, 2, 2);
        if (sprite === Sk.builtin.none.none$) {
            return bk(Sk.ffi.remapToJs(distance));
        }
        return sprite.bk(Sk.ffi.remapToJs(distance));
    });
	
	mod.ra = new Sk.builtin.func(function (sprite, radius, angle) {
       Sk.builtin.pyCheckArgs("rt", arguments, 2, 3);
	   if (sprite === Sk.builtin.none.none$) {
            return rt(Sk.ffi.remapToJs(radius), Sk.ffi.remapToJs(angle));
        }
        return sprite.rt(Sk.ffi.remapToJs(radius), Sk.ffi.remapToJs(angle));
    });
	
	mod.la = new Sk.builtin.func(function (sprite, radius, angle) {
       Sk.builtin.pyCheckArgs("lt", arguments, 2, 3);
        if (sprite === Sk.builtin.none.none$) {
            return lt(Sk.ffi.remapToJs(radius), Sk.ffi.remapToJs(angle));
        }
        return sprite.lt(Sk.ffi.remapToJs(radius), Sk.ffi.remapToJs(angle));
    });
	
	mod.speed = new Sk.builtin.func(function (sprite, value) {
       Sk.builtin.pyCheckArgs("speed", arguments, 2, 2);
       if (sprite === Sk.builtin.none.none$) {
            return speed(Sk.ffi.remapToJs(value));
        }
       return sprite.speed(Sk.ffi.remapToJs(value));
    });
	
	mod.home = new Sk.builtin.func(function (sprite) {
       Sk.builtin.pyCheckArgs("home", arguments, 1, 1);
       if (sprite === Sk.builtin.none.none$) {
            return home();
        }
       return sprite.home();
    });
	
	mod.turnto = new Sk.builtin.func(function (sprite, value) {
       Sk.builtin.pyCheckArgs("turnto", arguments, 2, 3);
       if (sprite === Sk.builtin.none.none$) {
            return turnto(Sk.ffi.remapToJs(value));
        }
       return sprite.turnto(Sk.ffi.remapToJs(value));
    });
	
	mod.moveto = new Sk.builtin.func(function (sprite, value1, value2) {
       Sk.builtin.pyCheckArgs("moveto", arguments, 3, 3);
       if (sprite === Sk.builtin.none.none$) {
            return moveto(Sk.ffi.remapToJs(value1), Sk.ffi.remapToJs(value2));
        }
       return sprite.moveto(Sk.ffi.remapToJs(value1), Sk.ffi.remapToJs(value2));
    });
	
	mod.movexy = new Sk.builtin.func(function (sprite, value1, value2) {
       Sk.builtin.pyCheckArgs("movexy", arguments, 3, 3);
       if (sprite === Sk.builtin.none.none$) {
            return movexy(Sk.ffi.remapToJs(value1), Sk.ffi.remapToJs(value2));
        }
       return sprite.movexy(Sk.ffi.remapToJs(value1), Sk.ffi.remapToJs(value2));
    });
	
	mod.jumpto = new Sk.builtin.func(function (sprite, value1, value2) {
       Sk.builtin.pyCheckArgs("jumpto", arguments, 3, 3);
        if (sprite === Sk.builtin.none.none$) {
            return jumpto(Sk.ffi.remapToJs(value1), Sk.ffi.remapToJs(value2));
        }
       return sprite.jumpto(Sk.ffi.remapToJs(value1), Sk.ffi.remapToJs(value2));
    });
	
	mod.jumpxy = new Sk.builtin.func(function (sprite, value1, value2) {
       Sk.builtin.pyCheckArgs("jumpxy", arguments, 3, 3);
        if (sprite === Sk.builtin.none.none$) {
            return jumpxy(Sk.ffi.remapToJs(value1), Sk.ffi.remapToJs(value2));
        }
       return sprite.jumpxy(Sk.ffi.remapToJs(value1), Sk.ffi.remapToJs(value2));
    });
	
	mod.pause = new Sk.builtin.func(function (sprite, value) {
       Sk.builtin.pyCheckArgs("pause", arguments, 2, 2);
       if (sprite === Sk.builtin.none.none$) {
            return pause(Sk.ffi.remapToJs(value));
        }
       return sprite.pause(Sk.ffi.remapToJs(value));
    });
	
	mod.getxy = new Sk.builtin.func(function (sprite) {
       Sk.builtin.pyCheckArgs("getxy", arguments, 1, 1);
       if (sprite === Sk.builtin.none.none$) {
            return new Sk.ffi.remapToPy(getxy());
        }
       return new Sk.ffi.remapToPy(sprite.getxy());
    });
	
    //Control
    //Cannot find control functions for new sprites!!! Possible Fix Needed
	
	mod.button = new Sk.builtin.func(function (sprite, buttonclick, callee) {
       Sk.builtin.pyCheckArgs("button", arguments, 3, 3);
	   if (sprite === Sk.builtin.none.none$) {
            return button(Sk.ffi.remapToJs(buttonclick), function () { Sk.misceval.callsim(callee); } );
        }
       //return sprite.button(Sk.ffi.remapToJs(buttonclick), function () { Sk.misceval.callsim(callee); } );

    });
	
	mod.click = new Sk.builtin.func(function (sprite, func) {
       Sk.builtin.pyCheckArgs("click", arguments, 2, 2);
	   if (sprite === Sk.builtin.none.none$) {
            return click(function(eventData){
				var data = [eventData.x, eventData.y];
				Sk.misceval.callsim(func, Sk.ffi.remapToPy(data)); } );
        }
       //return sprite.click( function () { Sk.misceval.callsim(fn); } );
    });
	
	mod.forever = new Sk.builtin.func(function (func) {
		Sk.builtin.pyCheckArgs("forever", arguments, 1, 1);
		return forever(function(){ Sk.misceval.callsim(func); } );
	});
	
	mod.keydown = new Sk.builtin.func(function (sprite, key, func) {
       Sk.builtin.pyCheckArgs("keydown", arguments, 3, 3);
	   if (sprite === Sk.builtin.none.none$) {
            return keydown(Sk.ffi.remapToJs(key), Sk.misceval.callsim(func));
        }
       //return sprite.keydown(function () { Sk.misceval.callsim(key); });
    });
	
	mod.keyup = new Sk.builtin.func(function (sprite, key, func) {
       Sk.builtin.pyCheckArgs("keyup", arguments, 2, 2);
	   if (sprite === Sk.builtin.none.none$) {
            return keyup(Sk.ffi.remapToJs(key), function () { Sk.misceval.callsim(func); });
        }
       //return sprite.keyup(function () { Sk.misceval.callsim(key); });
    });
	
	//Sound/////////////
	mod.play = new Sk.builtin.func(function (sprite, note) {
       Sk.builtin.pyCheckArgs("play", arguments, 2, 2);
       if (sprite === Sk.builtin.none.none$) {
            return play(Sk.ffi.remapToJs(note));
        }
       return sprite.play(Sk.ffi.remapToJs(note));
    });
	
	//mod.tone3 = new Sk.builtin.func(function (a, b, c) {
    //   Sk.builtin.pyCheckArgs("tone", arguments, 3, 3);
    //   return tone(Sk.ffi.remapToJs(a), Sk.ffi.remapToJs(b), Sk.ffi.remapToJs(c));
    //});
	
	mod.tone = new Sk.builtin.func(function (sprite, a, b, c) {
       Sk.builtin.pyCheckArgs("tone", arguments, 3, 4);
	   if (sprite === Sk.builtin.none.none$) {
            return tone(Sk.ffi.remapToJs(a), Sk.ffi.remapToJs(b), Sk.ffi.remapToJs(c));
        }
       return sprite.tone(Sk.ffi.remapToJs(a), Sk.ffi.remapToJs(b), Sk.ffi.remapToJs(c));
    });
	
	mod.silence = new Sk.builtin.func(function (sprite) {
       Sk.builtin.pyCheckArgs("silence", arguments, 1, 1);
	   if (sprite === Sk.builtin.none.none$) {
            return silence();
        }
       return sprite.silence();
    });
	
	mod.say = new Sk.builtin.func(function (sprite, a) {
       Sk.builtin.pyCheckArgs("say", arguments, 2, 2);
	   if (sprite === Sk.builtin.none.none$) {
            return say(Sk.ffi.remapToJs(a));
        }
       return sprite.say(Sk.ffi.remapToJs(a));
    });
	
	 // TEXT METHODS /////////////////////////////////////////////////////////
    mod.write = new Sk.builtin.func(function (message) {
        Sk.builtin.pyCheckArgs("write", arguments, 1, 1);
        return write(Sk.ffi.remapToJs(message));
    });

    mod.debug = new Sk.builtin.func(function (object) {
        Sk.builtin.pyCheckArgs("debug", arguments, 1, 1);
        return debug(Sk.ffi.remapToJs(object));
    });

    mod.type = new Sk.builtin.func(function (message) {
        Sk.builtin.pyCheckArgs("type", arguments, 1, 1);
        return type(Sk.ffi.remapToJs(message));
    });

    mod.typebox = new Sk.builtin.func(function (color) {
        Sk.builtin.pyCheckArgs("typebox", arguments, 1, 1);
        return typebox(Sk.ffi.remapToJs(color));
    });

    mod.typeline = new Sk.builtin.func(function () {
        Sk.builtin.pyCheckArgs("typeline", arguments, 0, 0);
        return typeline();
    });

    mod.label = new Sk.builtin.func(function (name) {
        Sk.builtin.pyCheckArgs("label", arguments, 1, 1);
        return label(Sk.ffi.remapToJs(name));
    });

    /*mod.await = new Sk.builtin.func(function (lambda_expression) {
        Sk.builtin.pyCheckArgs("await", arguments, 1, 1);
        return await(lambda_expression.v);
    });*/
        
    mod.read = new Sk.builtin.func(function (prompt, func) {
        Sk.builtin.pyCheckArgs("read", arguments, 2, 2);
		if(func == Sk.builtin.none.none$)
		{
			return Sk.ffi.remapToPy(read(Sk.ffi.remapToJs(prompt)));
		}
        return Sk.ffi.remapToPy(read(Sk.ffi.remapToJs(prompt), function (w) { Sk.misceval.callsim(func, Sk.ffi.remapToPy(w)); }));
    });

    mod.readnum = new Sk.builtin.func(function (prompt, func) {
        Sk.builtin.pyCheckArgs("readnum", arguments, 2, 2);
		if(func == Sk.builtin.none.none$)
		{
			return Sk.ffi.remapToPy(readnum(Sk.ffi.remapToJs(prompt)));
		}
        return Sk.ffi.remapToPy(readnum(Sk.ffi.remapToJs(prompt), function (w) { Sk.misceval.callsim(func, Sk.ffi.remapToPy(w)); }));
    });
	
	mod.readstr = new Sk.builtin.func(function (prompt, func) {
	Sk.builtin.pyCheckArgs("readstr", arguments, 2, 2);
		if(func == Sk.builtin.none.none$)
		{
			return Sk.ffi.remapToPy(readstr(Sk.ffi.remapToJs(prompt)));
		}
		return Sk.ffi.remapToPy(readstr(Sk.ffi.remapToJs(prompt), function (w) { Sk.misceval.callsim(func, Sk.ffi.remapToPy(w)); }));
    });
	
	//SPRITES/////////////////
	
	mod.Turtle = new Sk.builtin.func(function (value) {
       Sk.builtin.pyCheckArgs("Turtle", arguments, 1, 1);
       return new Turtle(Sk.ffi.remapToJs(value));
    });
	
	mod.Sprite = new Sk.builtin.func(function () {
       Sk.builtin.pyCheckArgs("Sprite", arguments, 0, 0);
       return new Sprite();
    });
	
//	mod.Piano = new Sk.builtin.func(function (keys) {
//       Sk.builtin.pyCheckArgs("Piano", arguments, 1, 1);
//       return new Piano(Sk.ffi.remapToJs(keys));
//    });
	mod.Piano = new Sk.builtin.func(function () {
       Sk.builtin.pyCheckArgs("Piano", arguments, 0, 0);
       return new Piano();
    });
	
    mod.Pencil = new Sk.builtin.func(function () {
       Sk.builtin.pyCheckArgs("Pencil", arguments, 0, 0);
       return new Pencil();
    });
    
    mod.copy = new Sk.builtin.func(function () {
        Sk.builtin.pyCheckArgs("copy", arguments, 0, 0);
        return new copy();
    });
    
    mod.table = new Sk.builtin.func(function (rows, columns) {
       Sk.builtin.pyCheckArgs("table", arguments, 2, 2);
       return new table(Sk.ffi.remapToJs(rows), Sk.ffi.remapToJs(columns));
    });
	
    mod.cell = new Sk.builtin.func(function (sprite, rows, columns) {
        Sk.builtin.pyCheckArgs("cell", arguments, 3, 3);
		if(sprite === Sk.builtin.none.none$){
			return cell(Sk.ffi.remapToJs(rows), Sk.ffi.remapToJs(columns));
		}
        return new sprite.cell(Sk.ffi.remapToJs(rows), Sk.ffi.remapToJs(columns));
    });
    
	//ART//////
	
	mod.hide = new Sk.builtin.func(function (sprite) {
        Sk.builtin.pyCheckArgs("ht", arguments, 1, 1);
		if (sprite === Sk.builtin.none.none$) {
            return ht();
        }
       return sprite.ht();
    });
	
	mod.show = new Sk.builtin.func(function (sprite) {
        Sk.builtin.pyCheckArgs("st", arguments, 1, 1);
		if (sprite === Sk.builtin.none.none$) {
            return st();
        }
       return sprite.st();
    });
	
	mod.cs = new Sk.builtin.func(function (sprite) {
        Sk.builtin.pyCheckArgs("cs", arguments, 1, 1);
        if (sprite === Sk.builtin.none.none$) {
            return cs();
        }
       return sprite.cs();
    });
	
	mod.st = new Sk.builtin.func(function (sprite) {
        Sk.builtin.pyCheckArgs("st", arguments, 1, 1);
        if (sprite === Sk.builtin.none.none$) {
            return st();
        }
       return sprite.st();
    });
	
	mod.ht = new Sk.builtin.func(function (sprite) {
        Sk.builtin.pyCheckArgs("ht", arguments, 1, 1);
        if (sprite === Sk.builtin.none.none$) {
            return ht();
        }
       return sprite.ht();
    });
	
	mod.pu = new Sk.builtin.func(function (sprite) {
        Sk.builtin.pyCheckArgs("pu", arguments, 1, 1);
        if (sprite === Sk.builtin.none.none$) {
            return pu();
        }
       return sprite.pu();
    });
	
	mod.pd = new Sk.builtin.func(function (sprite) {
        Sk.builtin.pyCheckArgs("pd", arguments, 1, 1);
        if (sprite === Sk.builtin.none.none$) {
            return pd();
        }
       return sprite.pd();
    });
	
	mod.pen = new Sk.builtin.func(function (sprite, color, size) {
        Sk.builtin.pyCheckArgs("pen", arguments, 3, 3);
        if (sprite === Sk.builtin.none.none$) {
            return pen(Sk.ffi.remapToJs(color), Sk.ffi.remapToJs(size));
        }
       return sprite.pen(Sk.ffi.remapToJs(color), Sk.ffi.remapToJs(size));
    });
	
	mod.dot = new Sk.builtin.func(function (sprite, color, dia) {
        Sk.builtin.pyCheckArgs("dot", arguments, 3, 3);
        if (sprite === Sk.builtin.none.none$) {
            return dot(Sk.ffi.remapToJs(color), Sk.ffi.remapToJs(dia));
        }
       return sprite.dot(Sk.ffi.remapToJs(color), Sk.ffi.remapToJs(dia));
    });
	
	mod.box = new Sk.builtin.func(function (sprite, color, size) {
        Sk.builtin.pyCheckArgs("box", arguments, 3, 3);
		if (sprite === Sk.builtin.none.none$) {
            return box(Sk.ffi.remapToJs(color), Sk.ffi.remapToJs(size));
        }
       return sprite.box(Sk.ffi.remapToJs(color), Sk.ffi.remapToJs(size));
    });
	
	mod.fill = new Sk.builtin.func(function (sprite, color) {
        Sk.builtin.pyCheckArgs("dot", arguments, 2, 2);
		if (sprite === Sk.builtin.none.none$) {
            return fill(Sk.ffi.remapToJs(color));
        }
       return sprite.fill(Sk.ffi.remapToJs(color));
    });
	
	mod.img = new Sk.builtin.func(function (sprite, pic) {
        Sk.builtin.pyCheckArgs("img", arguments, 2, 2);
		if (sprite === Sk.builtin.none.none$) {
            return img(Sk.ffi.remapToJs(pic));
        }
       return new sprite.img(Sk.ffi.remapToJs(pic));
    });
	
	mod.wear = new Sk.builtin.func(function (sprite, color) {
        Sk.builtin.pyCheckArgs("wear", arguments, 2, 2);
		if (sprite === Sk.builtin.none.none$) {
            return wear(Sk.ffi.remapToJs(color));
        }
       return sprite.wear(Sk.ffi.remapToJs(color));
    });
	
	mod.grow = new Sk.builtin.func(function (sprite, size) {
        Sk.builtin.pyCheckArgs("grow", arguments, 2, 2);
		if (sprite === Sk.builtin.none.none$) {
            return grow(Sk.ffi.remapToJs(size));
        }
       return sprite.grow(Sk.ffi.remapToJs(size));
    });
	
	mod.drawon = new Sk.builtin.func(function (sprite, canvas) {
        Sk.builtin.pyCheckArgs("drawon", arguments, 2, 2);
		if (sprite === Sk.builtin.none.none$) {
            return drawon(Sk.ffi.remapToJs(canvas));
        }
       return sprite.drawon(Sk.ffi.remapToJs(canvas));
    });
    
    mod.arrow = new Sk.builtin.func(function (sprite, color, size) {
        Sk.builtin.pyCheckArgs("arrow", arguments, 3, 3);
		if (sprite === Sk.builtin.none.none$) {
            return arrow(Sk.ffi.remapToJs(color), Sk.ffi.remapToJs(size));
        }
       return sprite.arrow(Sk.ffi.remapToJs(color), Sk.ffi.remapToJs(size));
    });
    
    mod.shown = new Sk.builtin.func(function (sprite) {
        Sk.builtin.pyCheckArgs("shown", arguments, 1, 1);
        if (sprite === Sk.builtin.none.none$) {	
            return Sk.ffi.remapToPy(shown());
        }
		return Sk.ffi.remapToPy(shown());
    });
    
    mod.hidden = new Sk.builtin.func(function (sprite) {
        Sk.builtin.pyCheckArgs("hidden", arguments, 1, 1);
        if (sprite === Sk.builtin.none.none$) {
            return Sk.ffi.remapToPy(hidden());
        }
		return Sk.ffi.remapToPy(hidden());
    });
    
    mod.touches = new Sk.builtin.func(function (sprite, obj) {
        Sk.builtin.pyCheckArgs("touches", arguments, 2, 2);
        if (sprite === Sk.builtin.none.none$) {
            return Sk.ffi.remap.Py(touches(Sk.ffi.remapToJs(obj)));
        }
       return Sk.ffi.remap.Py(sprite.touches(Sk.ffi.remapToJs(obj)));
    });
    
    mod.inside = new Sk.builtin.func(function (sprite, obj) {
        Sk.builtin.pyCheckArgs("inside", arguments, 2, 2);
        if (sprite === Sk.builtin.none.none$) {
            return Sk.ffi.remap.Py(inside(Sk.ffi.remapToJs(obj)));
        }
       return Sk.ffi.remap.Py(sprite.inside(Sk.ffi.remapToJs(obj)));
    });    
    
	//Operators
	mod.min = new Sk.builtin.func(function (value1, value2) {
        Sk.builtin.pyCheckArgs("min", arguments, 1, 2);
        return min(Sk.ffi.remapToJs(value1), Sk.ffi.remapToJs(value2));
    });
	
	mod.random = new Sk.builtin.func(function (value) {
        Sk.builtin.pyCheckArgs("random", arguments, 1, 1);
        return Sk.ffi.remapToPy(random(Sk.ffi.remapToJs(value)));
    });

    return mod;
};
