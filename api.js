#!/usr/bin/node

'use strict';
var fs = require('fs');
var path = require('path');
var moment = require('moment');
const robot = require("robotjs");

var print = console.log;
//----------------------------------------------------------
// config
//----------------------------------------------------------
var app_folder = path.dirname(__filename);
var log_folder = path.join(app_folder, 'log');

robot.setMouseDelay(10);

//----------------------------------------------------------
// func
//----------------------------------------------------------

function trace(...args) {
	print(moment().format('YYYYMM_DD_hh_mm_ss'), ...args)
}

function easyhash(str) {
  var x = 0;
  if (str.length > 0) {
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        x = ((x<<5)-x)+char;
        x = x & x; // Convert to 32bit integer
    }
  }
  return ("00000000"+(x >>> 0).toString(16)).substr(-4);
}

function parseHotkeyText(text) {
	var arr = text.split("+")
  // var keycode = e.rawcode
  // var ch = String.fromCharCode(keycode)

	var ctrlKey  = false;
	var shiftKey = false;
	var altKey   = false;
	arr.map(function(v, i) {
		if ("ctrl" == v.toLowerCase()) {
			ctrlKey  = true
		}
		if ("shift" == v.toLowerCase()) {
			shiftKey = true
		}
		if ("alt" == v.toLowerCase()) {
			altKey = true
		}
	});

	arr.ctrlKey = ctrlKey;
	arr.shiftKey = shiftKey;
	arr.altKey = altKey;
	return arr
}

function isHotkeyEvent(event, hotkey, caseSensitive = false) {
	var arr = parseHotkeyText(hotkey)
	if (arr.ctrlKey !== event.ctrlKey ) {
		return false;
	}
	if (arr.shiftKey !== event.shiftKey ) {
		return false;
	}
	if (arr.altKey !== event.ctrlKey ) {
		return false;
	}

	var keycode = event.rawcode
  var str = String.fromCharCode(keycode)
  if (caseSensitive) {
  	return arr.includes(str);
  }
	return (arr.includes(str.toLowerCase()) || arr.includes(str.toUpperCase()));
}

function mouseclick(x, y) {
	robot.moveMouse(x, y);
	robot.moveMouseSmooth(x, y);
	robot.mouseClick();
	robot.mouseToggle("up");
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

module.exports = exports = {
	trace         : trace,
  easyhash      : easyhash,

	mouseclick    : mouseclick,
  sleep         : sleep,

	isHotkeyEvent : isHotkeyEvent,
	log_folder    : log_folder
};
