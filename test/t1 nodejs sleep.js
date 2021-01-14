'use strict';
const robot = require("robotjs");

var arr_click = {}


function mouseclick(x, y) {
	robot.moveMouse(x, y);
	robot.mouseClick();
}

// not working
// SyntaxError: await is only valid in async function
// function sleep(ms) {
// 	var sleep_async = new Promise(resolve => setTimeout(resolve, ms));
// 	return await sleep_async(ms)
// }
// mouseclick(34, 34)
// sleep(ms)
// mouseclick(34, 34)

//----------------------------------------------------------
// demo1 ok
//----------------------------------------------------------


// 2017 — 2019 update
// Since 2009 when this question was asked, JavaScript has evolved significantly. All other answers are now obsolete or overly complicated. Here is the current best practice:

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// async function demo() {
// 	mouseclick(34, 34)
// 	await sleep(2000)
// 	mouseclick(34, 34)	
// }

// demo()

//----------------------------------------------------------
// test 2 not pass, wired bug
//----------------------------------------------------------


// async function sleep(ms) {
// 	var sleep_async = new Promise(resolve => setTimeout(resolve, ms));
// 	return await sleep_async(ms)
// }

// function replay() {
// 	mouseclick(34, 34)
// 	sleep(2000)
// 	mouseclick(34, 34)	
// }

// replay()


// var slp = require("sleep")
// function sleep(n) {
//   msleep(n*1000);
// }

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function demo2() {
	mouseclick(34, 34)
	sleep(500)
	mouseclick(34, 34)	
}

demo2()