#!/usr/bin/node

const vm = require('vm');
var robot = require("robotjs");
var print = console.log;
const fs = require('fs'); 
const execSync = require('child_process').execSync;
var pathlib = require('path');

var common = require('./common.js');
// { trace: [Function: trace],
//   easyhash: [Function: easyhash],
//   mouseclick: [Function: mouseclick],
//   sleep: [Function: sleep],
//   isHotkeyEvent: [Function: isHotkeyEvent],
//   log_folder: '/drive_d/work/robotjs/log' }
// log/data


//----------------------------------------------------------
// config
//----------------------------------------------------------

var app_folder = pathlib.dirname(__filename);
var log_folder = pathlib.join(app_folder, 'log');

var args = process.argv.slice(1);

var replay_name  = args[1] || "lastreplay.js"
var repeat_times = args[2] || 1;
var speed        = args[3] || 1;

if (replay_name.startsWith("./log/")) {
	replay_name = replay_name.slice(("./log/").length)
}

// var path = "/drive_d/work/robotjs/log/20210113_f39e_0.js"
var path = pathlib.join(log_folder, replay_name)

var factor = 1 / (speed || 1)
robot.setMouseDelay(10);

//----------------------------------------------------------
// func
//----------------------------------------------------------

function mousemove(x, y) {
	robot.moveMouse(x, y);
	// robot.moveMouseSmooth(x, y);
}

function mouseclick(x, y) {
	robot.moveMouse(x, y);
	// robot.moveMouseSmooth(x, y);
	robot.mouseClick();
	// robot.mouseToggle("up");
}

function sleep_org(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function sleep(ms) {
	sleep_org(ms*factor)
}

function parseWindowId(text) {
	var ret = text.match(/Window id:\s+(\w+)/)
	var hex= ret[1]
	return Number(hex)
}

function getWindowInfo() {
	var buf = execSync('xwininfo');
	var text = buf.toString();
	var id = parseWindowId(text);
	var info = {
		id: id,
		pid: id,
		text: buf.toString()
	}
	return info
}

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

function windowactivate(pid) {
	// var pid = 31457291
	var cmd = `xdotool windowactivate ${pid}`
	print(111, cmd)
	var buf = execSync(cmd);
	return (buf.toString())	
}

//----------------------------------------------------------
// sandbox
//----------------------------------------------------------


var sandbox = {
	mousemove: mousemove,
  mouseclick: mouseclick,
  sleep: sleep
};

var context = new vm.createContext(sandbox);

//----------------------------------------------------------
// rem
//----------------------------------------------------------
print(`[info] Please select window first: `)
var winfo = getWindowInfo()
var pid = winfo.id
print(winfo.text)

print(`[replay] repeat ${repeat_times} ${replay_name} (speed: x${speed})`)

var code = fs.readFileSync(path, {encoding:'utf8', flag:'r'}); 
// var prefix = `sleep(1000)`;
// code = prefix + code;

var script = new vm.Script(code);

function main() {
	print("[replay] start:")
	// require(replay_name);
	for (var i = 1; i <= repeat_times; i++) {
		script.runInContext(context);
	}
}

print("[replay] count down:")
count_down(function (sec) {
	windowactivate(pid)
	if (sec == 0) {
		main()
	} else {
		print(sec)
	}
}, 3)



