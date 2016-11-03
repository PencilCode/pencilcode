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
	
	mod.button = new Sk.builtin.func(function (buttonclick) {
       Sk.builtin.pyCheckArgs("button", arguments, 1, 2);
       return button(buttonclick.v);
    });
	
	mod.click = new Sk.builtin.func(function (click) {
       Sk.builtin.pyCheckArgs("click", arguments, 1, 1);
       return click(click.v);
    });
	
	mod.keydown = new Sk.builtin.func(function (key) {
       Sk.builtin.pyCheckArgs("keydown", arguments, 1, 1);
       return keydown(key.v);
    });
	
	mod.keyup = new Sk.builtin.func(function (key) {
       Sk.builtin.pyCheckArgs("keyup", arguments, 1, 1);
       return keyup(key.v);
    });
	
	//Sound
	mod.play = new Sk.builtin.func(function (note) {
       Sk.builtin.pyCheckArgs("play", arguments, 1, 1);
       return play(note.v);
    });
	
	//mod.tone = new Sk.builtin.func(function (a) {
    //   Sk.builtin.pyCheckArgs("tone", arguments, 1, 3);
    //   return tone(a.v);
    //});
	
	mod.tone = new Sk.builtin.func(function (a, b) {
       Sk.builtin.pyCheckArgs("tone", arguments, 2, 2);
       return tone(a.v, b.v);
    });
	
	mod.silence = new Sk.builtin.func(function () {
       Sk.builtin.pyCheckArgs("silence", arguments, 0, 0);
       return silence();
    });
	
	mod.say = new Sk.builtin.func(function (a) {
       Sk.builtin.pyCheckArgs("say", arguments, 1, 1);
       return say(a.v);
    });
	
	/*mod.Piano = new Sk.builtin.func(function () {
       Sk.builtin.pyCheckArgs("Piano", 1, 1);
       return Piano();
    });*/

    return mod;
};
