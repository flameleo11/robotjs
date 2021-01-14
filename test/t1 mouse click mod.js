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


function mousemove(x, y, smooth=false) {
	if (smooth) {
		robot.moveMouseSmooth(x, y);
	} else {
		robot.moveMouse(x, y);
	}
}

function mousereturn(x, y, smooth=false) {
	var mouse = robot.getMousePos();
	var x1 = mouse.x;
	var y1 = mouse.y;

	mousemove(x, y, smooth)

	setTimeout(() => {
	  mousemove_org(x1, y1, smooth)
	}, 100);
}

function mouseclick(x, y, smooth=false, fix=false) {
	mousemove(x, y, smooth)
	robot.mouseClick();
	sleep_org(100)
}

function sleep_org(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function sleep(ms) {
	sleep_org(ms*self.factor)
}

//----------------------------------------------------------
// init
//----------------------------------------------------------

var [x, y] = [315, 773];
var smooth = false
// mousemove(315, 773, true);
mouseclick(315, 773, smooth);
sleep(500);
mouseclick(358, 734, smooth);


function count_down(fn, sec) {
	fn(sec)
  var tm = setInterval(function(){
    sec--;
    fn(sec)
    if (sec <= 0) {
      clearInterval(tm);
    }
  }, 1000);
}    

// count_down(function (sec) {
// 	print(sec)
// },5)


