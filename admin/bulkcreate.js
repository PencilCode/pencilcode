#!/usr/bin/env node

var fs = require('fs');
var seedrandom = require('../content/seedrandom');
var filename = process.argv[2];

if (!filename) {
  console.log('Usage: bulkcreate.js jsonfile');
  console.log('The file should contain an array of {name:, pass:} records.');
  return;
}

function keyFromPassword(username, p) {
  if (!p) { return ''; }
  if (/^[0-9]{3}$/.test(p)) { return p; }
  var key = '';
  var prng = seedrandom('turtlebits:' + username + ':' + p + '.');
  for (var j = 0; j < 3; j++) {
    key += Math.floor(prng() * 10);
  }
  return key;
}

var text = fs.readFileSync(filename, 'utf8');
var accounts = JSON.parse(text);

var basedir = './';

for (var j = 0; j < accounts.length; ++j) {
  var a = accounts[j];
  var k = keyFromPassword(accounts[j].name, accounts[j].pass);
  fs.mkdirSync(basedir + a.name);
  fs.mkdirSync(basedir + a.name + '/.key');
  fs.writeFileSync(basedir + a.name + '/.key/k' + k, '');
}
