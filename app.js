#!/usr/bin/node

'use strict';
var fs = require('fs');
var pathlib = require('path');
var moment = require('moment');
           
const iohook = require('iohook');
const robot = require("robotjs");


var common = require('./common.js');
// { trace: [Function: trace],
//   easyhash: [Function: easyhash],
//   mouseclick: [Function: mouseclick],
//   sleep: [Function: sleep],
//   isHotkeyEvent: [Function: isHotkeyEvent],
//   log_folder: '/drive_d/work/robotjs/log' }
// log/data
var trace = common.trace;
var easyhash = common.easyhash
var sleep = common.sleep
var isHotkeyEvent = common.isHotkeyEvent
var log_folder = common.log_folder

var print = console.log;

//----------------------------------------------------------
// config
//----------------------------------------------------------

var arr = []
var arr_click = []

// record
var recording        = false
var replaying        = false
var arr_replay       = []
var arr_click        = []
var m_click_delay    = 0
var m_click_lasttime = 0
var curstate         = "idle"

//----------------------------------------------------------
// tools
//----------------------------------------------------------

function arrtail(arr) {
	return arr[arr.length - 1];
}

//----------------------------------------------------------
// bussness
//----------------------------------------------------------

function gen_file_name(id=0, now) {
	var now = now || moment()
	var session_id = easyhash(now.format());
  var str = moment().format('YYYYMMDD') 
						  + "_" + session_id 
						  + "_" + id
						  + ".js";
  return str;
}

function save_replay(id=0, text) {
	var now = moment()
	var name = gen_file_name(id, now)
	var path = pathlib.join(log_folder, name)
	var lastreplay = pathlib.join(log_folder, "lastreplay.js");

	fs.writeFile(path, text, function (err) {
	  if (err) return print(err);
	});
	fs.writeFile(lastreplay, text, function (err) {
	  if (err) return print(err);
	});
	trace("[save]", path)
}

function startRecord(e) {
	if (curstate !== "idle") {
		print("[warning] not idle: ", curstate)
		return 
	}	
	var replay_id = arr_replay.length;
	arr_click = []
	arr_click.id = replay_id
	arr_replay[replay_id] = arr_click

	var mouse = robot.getMousePos();
	var x = mouse.x;
	var y = mouse.y;
	// start postion
	var init_data = {
		delay: 0,
		pre_nexttime: 0,
		x: x,
		y: y,
		type: 'mousemove'
	}
	arr_click.push(init_data)

	recording = true
	curstate = "recording"
	print("")
	print(`<record id="${replay_id}">`)
	print("")	


	print(`[record] mousemove(${x}, ${y});`)
}

function stopRecord(e) {
	if (curstate !== "recording") {
		print("[warning] not recording: ", curstate)
		return 
	}	
	// arr_click
	var lastreplay = arrtail(arr_replay)

	// push end event
	var now = Date.now()
	var interval = 0;
	if (m_click_lasttime > 0) {
		interval = now - m_click_lasttime;
	}
	if (arr_click.length > 0) {
		var last = arrtail(arr_click);
		last.pre_nexttime = interval;
	}

	// save code when replay tested
	recording = false
	curstate = "idle"
	print("")
	print(`<record/> <!-- replay_id: ${lastreplay.id} -->`)
	print("\n")

	// var lastreplay = arr_replay.pop();
	var lastreplay = arrtail(arr_replay)

	print("")
	print(`[info] start replay: ${lastreplay.id}`)
	print(`<replay id="${lastreplay.id}">`)
	print("")

	var arr_line = [];
	var line = "";

	lastreplay.map((e)=>{
		var x = e.x;
		var y = e.y;
		var action = e.type;

		var ms = e.pre_nexttime;
	  if (ms > 0 ) {
	  	line = `${action}(${x}, ${y}); sleep(${ms});`;
	  } else {
	  	line = `${action}(${x}, ${y});`;
	  }
		arr_line.push(line)
	})

	var text = arr_line.join('\n');
	save_replay(lastreplay.id, text)
}

// [info]  { button: 1, clicks: 1, x: 924, y: 854, type: 'mouseclick' }
// [info]  { button: 1, clicks: 1, x: 987, y: 803, type: 'mouseclick' }
// [info]  { button: 1, clicks: 1, x: 1133, y: 829, type: 'mouseclick' }
function startReplay(e) {
	print(111)
	if (curstate !== "idle") {
		print(222)
		print("[warning] not idle: ", curstate)
		return 
	}
	print(333)
	replaying = true
	curstate = "replaying"

	// var lastreplay = arr_replay.pop();
	var lastreplay = arrtail(arr_replay)

	print("")
	print(`[info] start replay: ${lastreplay.id}`)
	print(`<replay id="${lastreplay.id}">`)
	print("")

	var arr_line = [];
	var line = "";

	lastreplay.map((e)=>{
		if (curstate !== "replaying") {
			return 
		}	
		var x = e.x;
		var y = e.y;
		var ms = e.pre_nexttime;

	  sleep(e.delay)
	  mouseclick(e.x, e.y)

	  if (ms > 0 ) {
	  	line = `mouseclick(${x}, ${y}); sleep(${ms});`;
	  } else {
	  	line = `mouseclick(${x}, ${y});`;
	  }

		// arr_line.push(line)

		print(`[replay] ${line}`)
	})

	stopReplay(e, "ok")

	// var text = arr_line.join('\n');
	// save_replay(lastreplay.id, text)
}

function stopReplay(e, tag) {
	if (curstate !== "replaying") {
		print("[warning] not replaying: ", curstate)
		return 
	}		
	var lastreplay = arrtail(arr_replay)
	replaying = false
	curstate = "idle"
	print("")
	print(`<replay/> <!-- id: ${lastreplay.id} [${tag}] -->`)
	print("\n")
}

// [info] mouseclick { button: 1, clicks: 1, x: 924, y: 854, type: 'mouseclick' }
function dispatch(e) {
	if (e.type == 'mouseclick') {
		if (curstate == 'replaying') {
			return
		}	

		var now = Date.now()
		var interval = 0;
		var x = e.x;
		var y = e.y;

		var data = {
			delay: 0,
			pre_nexttime: 0,
			x: x,
			y: y,
			type: 'mouseclick'
		}

		if (curstate == 'recording') {
			if (m_click_lasttime > 0) {
				interval = now - m_click_lasttime;
			}

			if (arr_click.length > 0) {
				var last = arrtail(arr_click);
				last.pre_nexttime = interval
			}

			data.delay = interval;
			arr_click.push(data)

			m_click_lasttime = now;
			if (interval > 0) {
				print(`[record] sleep(${interval})`)
			}
			print(`[record] mouseclick(${x}, ${y})`)
			return 
		}

		// [idle] mouseclick(1172, 332)
		trace(`[${curstate}] mouseclick(${x}, ${y})`)
	}

}

//----------------------------------------------------------
// rem
//----------------------------------------------------------

// [info] mouseclick { button: 1, clicks: 1, x: 987, y: 803, type: 'mouseclick' }
iohook.on("mouseclick", (e) => {
  dispatch(e)
  
});

// {keychar: 'f', keycode: 19, rawcode: 15, type: 'keypress'}
iohook.on("keydown", (e) => {
	if (isHotkeyEvent(e, "Ctrl+Alt+G")) {
		print("")
		print(1, "Ctrl+Alt+G")
		startRecord(e)
	}
	if (isHotkeyEvent(e, "Ctrl+Alt+H")) {
		print("")
		print(2, "Ctrl+Alt+H")
		stopRecord(e)
	}
	if (isHotkeyEvent(e, "Ctrl+Alt+J")) {
		print("")
		print(3, "Ctrl+Alt+J")
		startReplay(e)
	}
	if (isHotkeyEvent(e, "Ctrl+Alt+K")) {
		print("")
		print(4, "Ctrl+Alt+K")
		stopReplay(e, "interrupt")
	}
	if (isHotkeyEvent(e, "Ctrl+Alt+L")) {
		print("")
		print(0, "Ctrl+Alt+L")
		process.exit(0);
	}
});

process.on('exit', () => {
  iohook.unload();
});

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})

iohook.start();

print(`
[Help]
startRecord = "Ctrl+Alt+G"		
stopRecord  = "Ctrl+Alt+H"		
startReplay = "Ctrl+Alt+J"		
stopReplay  = "Ctrl+Alt+K"		
exit        = "Ctrl+Alt+L"
`);