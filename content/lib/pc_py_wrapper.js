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

    // Wrapper for functions in jquery-turtle.js; See for more options!
    mod.fd = new Sk.builtin.func(function (distance) {
       Sk.builtin.pyCheckArgs("fd", arguments, 1, 1);
       return fd(distance.v);
    });

    return mod;
};
