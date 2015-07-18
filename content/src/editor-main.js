'use strict';

console.log = function(x) { (window._log = window._log || []).push(x); }

// Start the app...
require('controller');
