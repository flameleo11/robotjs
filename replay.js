#!/usr/bin/node

const vm = require('vm');
var robot = require("robotjs");
var print = console.log;
const fs = require('fs'); 
const execSync = require('child_process').execSync;
var pathlib = require('path');


var common = require('./common.js');
var trace = common.trace;
var easyhash = common.easyhash

var mouseclick = common.mouseclick
var mousemove  = common.mousemove
var sleep_org  = common.sleep

var isHotkeyEvent = common.isHotkeyEvent
var log_folder = common.log_folder


//----------------------------------------------------------
// config
//----------------------------------------------------------

var hotkey_startRecord = "Ctrl+Shift+R"
var hotkey_stopRecord  = "Ctrl+Shift+S"
var hotkey_quit        = "Ctrl+Shift+Q"
// startReplay = "Ctrl+Alt+J"		
// stopReplay  = "Ctrl+Alt+K"	


var app_folder = pathlib.dirname(__filename);
var log_folder = pathlib.join(app_folder, 'log');

var args = process.argv.slice(1);

var replay_name  = args[1] || "lastreplay.js"
var repeat_times = args[2] || 1;
var modname      = args[3] || "robot.js";
var speed        = args[4] || 1;
var factor = 1 / (speed || 1)

if (replay_name.startsWith("./log/")) {
	replay_name = replay_name.slice(("./log/").length)
} 
var path = replay_name;
if (!replay_name.includes("/")) {
	path = pathlib.join(log_folder, replay_name)
}

// var path = "/drive_d/work/robotjs/log/20210113_f39e_0.js"


//----------------------------------------------------------
// func
//----------------------------------------------------------

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
	var buf = execSync(cmd);
	return (buf.toString())	
}

//----------------------------------------------------------
// main
//----------------------------------------------------------
print(`[info] select window: `)
var winfo = getWindowInfo()
var pid = winfo.id
print(winfo.text)

print(`[replay] repeat ${repeat_times} ${replay_name} (speed: x${speed})`)


function main() {
	var code = fs.readFileSync(path, {encoding:'utf8', flag:'r'}); 
	var script = new vm.Script(code);
	print("[replay] start:")
	// require(replay_name);
	var mod = require("./mods/" + modname);


	// var sandbox = {
	// 	mousemove: mousemove,
	//   mouseclick: mouseclick,
	//   sleep: sleep
	// };
	
	for (var i = 1; i <= repeat_times; i++) {
		var sandbox = mod.init(args, i, repeat_times)
		var context = new vm.createContext(sandbox);
		script.runInContext(context);
	}
}

print(`[replay] count down: windowactivate ${pid}`)
count_down(function (sec) {
	windowactivate(pid)
	if (sec == 0) {
		main()
	} else {
		print(sec)
	}
}, 3)



