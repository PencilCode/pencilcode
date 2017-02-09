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
        return data.v + " with a lemon"; // Data comes in as a Python string; we have to use the value (v) in JS
    });

	//MOVE
    // Wrapper for functions in jquery-turtle.js; See for more options!
    mod.fd = new Sk.builtin.func(function (sprite, distance) {
        Sk.builtin.pyCheckArgs("fd", arguments, 2, 2);
        if (sprite/* turtle */ === Sk.builtin.none.none$) {
            return fd(distance.v);
        }
        return sprite.fd(distance.v);
    });
	
    mod.bk = new Sk.builtin.func(function (sprite, distance) {
        Sk.builtin.pyCheckArgs("bk", arguments, 2, 2);
        if (sprite === Sk.builtin.none.none$) {
            return bk(distance.v);
        }
        return sprite.bk(distance.v);
    });
	
    mod.rt = new Sk.builtin.func(function (sprite, angle) {
        Sk.builtin.pyCheckArgs("rt", arguments, 2, 2);
        if (sprite === Sk.builtin.none.none$) {
            return rt(angle.v);
        }
        return sprite.rt(angle.v);
    });
	
    mod.lt = new Sk.builtin.func(function (sprite, angle) {
        Sk.builtin.pyCheckArgs("lt", arguments, 2, 2);
        if (sprite === Sk.builtin.none.none$) {
            return lt(angle.v);
        }
        return sprite.lt(angle.v);
    });
	
	mod.ra = new Sk.builtin.func(function (sprite, radius, angle) {
       Sk.builtin.pyCheckArgs("rt", arguments, 2, 3);
	   if (sprite === Sk.builtin.none.none$) {
            return rt((radius).v, angle.v);
        }
        return sprite.rt((radius).v, angle.v);
    });
	
	mod.la = new Sk.builtin.func(function (sprite, radius, angle) {
       Sk.builtin.pyCheckArgs("lt", arguments, 2, 3);
        if (sprite === Sk.builtin.none.none$) {
            return lt((radius).v, angle.v);
        }
        return sprite.lt((radius).v, angle.v);
    });
	
	mod.speed = new Sk.builtin.func(function (sprite, value) {
       Sk.builtin.pyCheckArgs("speed", arguments, 2, 2);
       if (sprite === Sk.builtin.none.none$) {
            return speed(value.v);
        }
       return sprite.speed(value.v);
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
            return turnto(value.v);
        }
       return sprite.turnto(value.v);
    });
	
	mod.moveto = new Sk.builtin.func(function (sprite, value1, value2) {
       Sk.builtin.pyCheckArgs("moveto", arguments, 3, 3);
       if (sprite === Sk.builtin.none.none$) {
            return moveto(value1.v, value2.v);
        }
       return sprite.moveto(value1.v, value2.v);
    });
	
	mod.movexy = new Sk.builtin.func(function (sprite, value1, value2) {
       Sk.builtin.pyCheckArgs("movexy", arguments, 3, 3);
       if (sprite === Sk.builtin.none.none$) {
            return movexy(value1.v, value2.v);
        }
       return sprite.movexy(value1.v, value2.v);
    });
	
	mod.jumpto = new Sk.builtin.func(function (sprite, value1, value2) {
       Sk.builtin.pyCheckArgs("jumpto", arguments, 3, 3);
        if (sprite === Sk.builtin.none.none$) {
            return jumpto(value1.v, value2.v);
        }
       return sprite.jumpto(value1.v, value2.v);
    });
	
	mod.jumpxy = new Sk.builtin.func(function (sprite, value1, value2) {
       Sk.builtin.pyCheckArgs("jumpxy", arguments, 3, 3);
        if (sprite === Sk.builtin.none.none$) {
            return jumpxy(value1.v, value2.v);
        }
       return sprite.jumpxy(value1.v, value2.v);
    });
	
	mod.pause = new Sk.builtin.func(function (sprite, value) {
       Sk.builtin.pyCheckArgs("pause", arguments, 2, 2);
       if (sprite === Sk.builtin.none.none$) {
            return pause(value);
        }
       return sprite.pause(value);
    });
	
    //Control
    //Cannot find control functions for new sprites!!! Possible Fix Needed
	
	mod.button = new Sk.builtin.func(function (sprite, buttonclick, callee) {
       Sk.builtin.pyCheckArgs("button", arguments, 3, 3);
	   if (sprite === Sk.builtin.none.none$) {
            return button(buttonclick.v, function () { Sk.misceval.callsim(callee); } );
        }
       //return sprite.button(buttonclick.v, function () { Sk.misceval.callsim(callee); } );

    });
	
	mod.click = new Sk.builtin.func(function (sprite, fn) {
       Sk.builtin.pyCheckArgs("click", arguments, 2, 2);
	   if (sprite === Sk.builtin.none.none$) {
            return click( function () { Sk.misceval.callsim(fn); } );
        }
       //return sprite.click( function () { Sk.misceval.callsim(fn); } );
    });
	
	mod.keydown = new Sk.builtin.func(function (sprite, key) {
       Sk.builtin.pyCheckArgs("keydown", arguments, 2, 2);
	   if (sprite === Sk.builtin.none.none$) {
            return keydown(function () { Sk.misceval.callsim(key); });
        }
       //return sprite.keydown(function () { Sk.misceval.callsim(key); });
    });
	
	mod.keyup = new Sk.builtin.func(function (sprite, key) {
       Sk.builtin.pyCheckArgs("keyup", arguments, 2, 2);
	   if (sprite === Sk.builtin.none.none$) {
            return keyup(function () { Sk.misceval.callsim(key); });
        }
       //return sprite.keyup(function () { Sk.misceval.callsim(key); });
    });
	
	//Sound/////////////
	mod.play = new Sk.builtin.func(function (sprite, note) {
       Sk.builtin.pyCheckArgs("play", arguments, 2, 2);
       if (sprite === Sk.builtin.none.none$) {
            return play(note.v);
        }
       return sprite.play(note.v);
    });
	
	//mod.tone3 = new Sk.builtin.func(function (a, b, c) {
    //   Sk.builtin.pyCheckArgs("tone", arguments, 3, 3);
    //   return tone(a.v, b.v, c.v);
    //});
	
	mod.tone = new Sk.builtin.func(function (sprite, a, b, c) {
       Sk.builtin.pyCheckArgs("tone", arguments, 3, 4);
	   if (sprite === Sk.builtin.none.none$) {
            return tone(a.v, b.v, c.v);
        }
       return sprite.tone(a.v, b.v, c.v);
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
            return say(a.v);
        }
       return sprite.say(a.v);
    });
	
	 // TEXT METHODS /////////////////////////////////////////////////////////
    mod.write = new Sk.builtin.func(function (message) {
        Sk.builtin.pyCheckArgs("write", arguments, 1, 1);
        return write(message.v);
    });

    mod.debug = new Sk.builtin.func(function (object) {
        Sk.builtin.pyCheckArgs("debug", arguments, 1, 1);
        return debug(object.v);
    });

    mod.type = new Sk.builtin.func(function (message) {
        Sk.builtin.pyCheckArgs("type", arguments, 1, 1);
        return type(message.v);
    });

    mod.typebox = new Sk.builtin.func(function (color) {
        Sk.builtin.pyCheckArgs("typebox", arguments, 1, 1);
        return typebox(color.v);
    });

    mod.typeline = new Sk.builtin.func(function () {
        Sk.builtin.pyCheckArgs("typeline", arguments, 0, 0);
        return typeline();
    });

    mod.label = new Sk.builtin.func(function (name) {
        Sk.builtin.pyCheckArgs("label", arguments, 1, 1);
        return label(name.v);
    });

    /*mod.await = new Sk.builtin.func(function (lambda_expression) {
        Sk.builtin.pyCheckArgs("await", arguments, 1, 1);
        return await(lambda_expression.v);
    });*/
        
    mod.read = new Sk.builtin.func(function (prompt) {
        Sk.builtin.pyCheckArgs("read", arguments, 1, 1);
        return read(prompt.v);
    });

    mod.readnum = new Sk.builtin.func(function (prompt) {
        Sk.builtin.pyCheckArgs("readnum", arguments, 1, 1);
        return readnum(prompt.v);
    });
	
	//SPRITES/////////////////
	
	mod.Turtle = new Sk.builtin.func(function (value) {
       Sk.builtin.pyCheckArgs("Turtle", arguments, 1, 1);
       return new Turtle(value.v);
    });
	
	mod.Sprite = new Sk.builtin.func(function () {
       Sk.builtin.pyCheckArgs("Sprite", arguments, 0, 0);
       return new Sprite();
    });
	
//	mod.Piano = new Sk.builtin.func(function (keys) {
//       Sk.builtin.pyCheckArgs("Piano", arguments, 1, 1);
//       return new Piano(keys.v);
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
       return new table(rows.v, columns.v);
    });
	
    mod.cell = new Sk.builtin.func(function (sprite, rows, columns) {
        Sk.builtin.pyCheckArgs("cell", arguments, 3, 3);
        return new sprite.cell(rows.v, columns.v);
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
            return pen(color.v, size.v);
        }
       return sprite.pen(color.v, size.v);
    });
	
	mod.dot = new Sk.builtin.func(function (sprite, color, dia) {
        Sk.builtin.pyCheckArgs("dot", arguments, 3, 3);
        if (sprite === Sk.builtin.none.none$) {
            return dot(color.v, dia.v);
        }
       return sprite.dot(color.v, dia.v);
    });
	
	mod.box = new Sk.builtin.func(function (sprite, color, size) {
        Sk.builtin.pyCheckArgs("box", arguments, 3, 3);
		if (sprite === Sk.builtin.none.none$) {
            return box(color.v, size.v);
        }
       return sprite.box(color.v, size.v);
    });
	
	mod.fill = new Sk.builtin.func(function (sprite, color) {
        Sk.builtin.pyCheckArgs("dot", arguments, 2, 2);
		if (sprite === Sk.builtin.none.none$) {
            return fill(color.v);
        }
       return sprite.fill(color.v);
    });
	
	mod.wear = new Sk.builtin.func(function (sprite, color) {
        Sk.builtin.pyCheckArgs("wear", arguments, 2, 2);
		if (sprite === Sk.builtin.none.none$) {
            return wear(color.v);
        }
       return sprite.wear(color.v);
    });
	
	mod.grow = new Sk.builtin.func(function (sprite, size) {
        Sk.builtin.pyCheckArgs("grow", arguments, 2, 2);
		if (sprite === Sk.builtin.none.none$) {
            return grow(size.v);
        }
       return sprite.grow(size.v);
    });
	
	mod.drawon = new Sk.builtin.func(function (sprite, canvas) {
        Sk.builtin.pyCheckArgs("drawon", arguments, 2, 2);
		if (sprite === Sk.builtin.none.none$) {
            return drawon(canvas.v);
        }
       return sprite.drawon(canvas.v);
    });
    
    mod.arrow = new Sk.builtin.func(function (sprite, color, size) {
        Sk.builtin.pyCheckArgs("arrow", arguments, 3, 3);
		if (sprite === Sk.builtin.none.none$) {
            return arrow(color.v, size.v);
        }
       return sprite.arrow(color.v, size.v);
    });
    
    mod.shown = new Sk.builtin.func(function (sprite) {
        Sk.builtin.pyCheckArgs("shown", arguments, 1, 1);
        if (sprite === Sk.builtin.none.none$) {
            return shown();
        }
       return sprite.shown();
    });
    
    mod.hidden = new Sk.builtin.func(function (sprite) {
        Sk.builtin.pyCheckArgs("hidden", arguments, 1, 1);
        if (sprite === Sk.builtin.none.none$) {
            return hidden();
        }
       return sprite.hidden();
    });
    
    //mod.touches = new Sk.builtin.func(function (sprite, obj) {
    //    Sk.builtin.pyCheckArgs("touches", arguments, 2, 2);
    //    if (sprite === Sk.builtin.none.none$) {
    //        return touches(obj.v);
    //    }
    //   return sprite.touches(obj.v);
    //});
    //
    //mod.inside = new Sk.builtin.func(function (sprite, obj) {
    //    Sk.builtin.pyCheckArgs("inside", arguments, 2, 2);
    //    if (sprite === Sk.builtin.none.none$) {
    //        return inside(obj.v);
    //    }
    //   return sprite.inside(obj.v);
    //});
    
    
    
    
	//Operators
	mod.min = new Sk.builtin.func(function (value1, value2) {
        Sk.builtin.pyCheckArgs("min", arguments, 1, 2);
        return min(value1.v, value2.v);
    });
	
	mod.random = new Sk.builtin.func(function (value) {
        Sk.builtin.pyCheckArgs("random", arguments, 1, 1);
        return random(value.v);
    });

    return mod;
};
