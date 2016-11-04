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
    mod.fd = new Sk.builtin.func(function (distance) {
       Sk.builtin.pyCheckArgs("fd", arguments, 1, 1);
       return fd(distance.v);
    });
	
	mod.bk = new Sk.builtin.func(function (distance) {
       Sk.builtin.pyCheckArgs("bk", arguments, 1, 1);
       return bk(distance.v);
    });
	
	mod.rt = new Sk.builtin.func(function (angle) {
       Sk.builtin.pyCheckArgs("rt", arguments, 1, 1);
       return rt(angle.v);
    });
	
	mod.ra = new Sk.builtin.func(function (radius, angle) {
       Sk.builtin.pyCheckArgs("rt", arguments, 1, 2);
       return rt((-radius).v, angle.v);
    });
	
	mod.lt = new Sk.builtin.func(function (angle) {
       Sk.builtin.pyCheckArgs("lt", arguments, 1, 1);
       return lk(angle.v);
    });
	
	mod.la = new Sk.builtin.func(function (radius, angle) {
       Sk.builtin.pyCheckArgs("lt", arguments, 1, 2);
       return lt((-radius).v, angle.v);
    });
	
	mod.speed = new Sk.builtin.func(function (value) {
       Sk.builtin.pyCheckArgs("speed", arguments, 1, 1);
       return speed(value.v);
    });
	
	mod.home = new Sk.builtin.func(function () {
       Sk.builtin.pyCheckArgs("home", arguments, 0, 0);
       return home();
    });
	
	mod.turnto = new Sk.builtin.func(function (value) {
       Sk.builtin.pyCheckArgs("turnto", arguments, 1, 2);
       return turnto(value.v);
    });
	
	mod.moveto = new Sk.builtin.func(function (value1, value2) {
       Sk.builtin.pyCheckArgs("moveto", arguments, 1, 2);
       return moveto(value1.v, value2.v);
    });
	
	mod.movexy = new Sk.builtin.func(function (value1, value2) {
       Sk.builtin.pyCheckArgs("movexy", arguments, 2, 2);
       return movexy(value1.v, value2.v);
    });
	
	mod.jumpto = new Sk.builtin.func(function (value1, value2) {
       Sk.builtin.pyCheckArgs("jumpto", arguments, 2, 2);
       return jumpto(value1.v, value2.v);
    });
	
	mod.jumpxy = new Sk.builtin.func(function (value1, value2) {
       Sk.builtin.pyCheckArgs("jumpxy", arguments, 2, 2);
       return jumpxy(value1.v, value2.v);
    });
	
	mod.pause = new Sk.builtin.func(function (value) {
       Sk.builtin.pyCheckArgs("pause", arguments, 1, 1);
       return pause(value);
    });
	
	//Control
	
	mod.button = new Sk.builtin.func(function (buttonclick, callee) {
       Sk.builtin.pyCheckArgs("button", arguments, 2, 2);
       return button(buttonclick.v, function () { Sk.misceval.callsim(callee); } );
    });
	
	mod.click = new Sk.builtin.func(function (fn) {
       Sk.builtin.pyCheckArgs("click", arguments, 1, 1);
       return click( function () { Sk.misceval.callsim(fn); } );
    });
	
	mod.keydown = new Sk.builtin.func(function (key) {
       Sk.builtin.pyCheckArgs("keydown", arguments, 1, 1);
       return keydown(function () { Sk.misceval.callsim(key); });
    });
	
	mod.keyup = new Sk.builtin.func(function (key) {
       Sk.builtin.pyCheckArgs("keyup", arguments, 1, 1);
       return keyup(key.v);
    });
	
	//Sound/////////////
	mod.play = new Sk.builtin.func(function (note) {
       Sk.builtin.pyCheckArgs("play", arguments, 1, 1);
       return play(note.v);
    });
	
	//mod.tone3 = new Sk.builtin.func(function (a, b, c) {
    //   Sk.builtin.pyCheckArgs("tone", arguments, 3, 3);
    //   return tone(a.v, b.v, c.v);
    //});
	
	mod.tone = new Sk.builtin.func(function (a, b, c) {
       Sk.builtin.pyCheckArgs("tone", arguments, 2, 3);
       return tone(a.v, b.v, c.v);
    });
	
	mod.silence = new Sk.builtin.func(function () {
       Sk.builtin.pyCheckArgs("silence", arguments, 0, 0);
       return silence();
    });
	
	mod.say = new Sk.builtin.func(function (a) {
       Sk.builtin.pyCheckArgs("say", arguments, 1, 1);
       return say(a.v);
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
       return Turtle(value.v);
    });
	
	mod.Sprite = new Sk.builtin.func(function () {
       Sk.builtin.pyCheckArgs("Sprite", arguments, 0, 0);
       return Sprite();
    });
	
	mod.Piano = new Sk.builtin.func(function (keys) {
       Sk.builtin.pyCheckArgs("Piano", arguments, 1, 1);
       return Piano(keys.v);
    });
	
	//mod.Pencil = new Sk.builtin.func(function () {
    //   Sk.builtin.pyCheckArgs("Pencil", arguments, 0, 0);
    //   return Pencil();
    //});
	
	//ART//////
	
	mod.hide = new Sk.builtin.func(function () {
        Sk.builtin.pyCheckArgs("ht", arguments, 0, 0);
        return ht();
    });
	
	mod.show = new Sk.builtin.func(function () {
        Sk.builtin.pyCheckArgs("st", arguments, 0, 0);
        return st();
    });
	
	mod.cs = new Sk.builtin.func(function () {
        Sk.builtin.pyCheckArgs("cs", arguments, 0, 0);
        return cs();
    });
	
	mod.pu = new Sk.builtin.func(function () {
        Sk.builtin.pyCheckArgs("pu", arguments, 0, 0);
        return pu();
    });
	
	mod.pd = new Sk.builtin.func(function () {
        Sk.builtin.pyCheckArgs("pd", arguments, 0, 0);
        return pd();
    });
	
	mod.pen = new Sk.builtin.func(function (color, size) {
        Sk.builtin.pyCheckArgs("pen", arguments, 2, 2);
        return pen(color.v, size.v);
    });
	
	mod.dot = new Sk.builtin.func(function (color, dia) {
        Sk.builtin.pyCheckArgs("dot", arguments, 2, 2);
        return dot(color.v, dia.v);
    });
	
	mod.box = new Sk.builtin.func(function (color, size) {
        Sk.builtin.pyCheckArgs("box", arguments, 2, 2);
        return box(color.v, size.v);
    });
	
	mod.fill = new Sk.builtin.func(function (color) {
        Sk.builtin.pyCheckArgs("dot", arguments, 1, 1);
        return fill(color.v);
    });
	
	mod.wear = new Sk.builtin.func(function (color) {
        Sk.builtin.pyCheckArgs("wear", arguments, 1, 1);
        return wear(color.v);
    });
	
	mod.grow = new Sk.builtin.func(function (size) {
        Sk.builtin.pyCheckArgs("grow", arguments, 1, 1);
        return grow(size.v);
    });
	
	mod.drawon = new Sk.builtin.func(function (canvas) {
        Sk.builtin.pyCheckArgs("drawon", arguments, 1, 1);
        return drawon(canvas.v);
    });
	
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
