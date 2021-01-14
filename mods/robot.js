'use strict';
var fs = require('fs');
var path = require('path');
var moment = require('moment');
const robot = require("robotjs");

var print = console.log;
//----------------------------------------------------------
// config
//----------------------------------------------------------

robot.setMouseDelay(0);
// robot.setMouseDelay(1);
// robot.setMouseDelay(10);
// robot.setMouseDelay(30);

var self = self || {}
self.factor = self.factor || 1

//----------------------------------------------------------
// api
//----------------------------------------------------------

function trace(...args) {
	print(moment().format('YYYYMM_DD_hh_mm_ss'), ...args)
}

function line(i) {
	trace("[line]", i)
}

function sleep_org(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function sleep(ms) {
	print(`sleep(${ms})`)	
	sleep_org(ms*self.factor)
}

function mousemove(x, y, smooth=false) {
	if (smooth) {
		robot.moveMouseSmooth(x, y);
	} else {
		robot.moveMouse(x, y);
	}
}

function mouseclick(x, y, smooth=false, fix=false) {
	print(`mouseclick(${x}, ${y})`)	
	mousemove(x, y, smooth)
	robot.mouseClick();
	sleep_org(100)
}

//----------------------------------------------------------
// init
//----------------------------------------------------------

function init(args, i, max) {
	var replay_name  = args[1] || "lastreplay.js"
	var repeat_times = args[2] || 1;
	var modname      = args[3] || "robot.js";
	var speed        = args[4] || 1;
	var factor = 1 / (speed || 1)	
	self.factor = factor

	var sandbox = {
		line: line,
		mousemove: mousemove,
	  mouseclick: mouseclick,
	  sleep: sleep
	};
	return sandbox;
}

module.exports = exports = {
	init: init
};
