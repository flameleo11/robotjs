#!/usr/bin/node

'use strict';
var fs = require('fs');
var pathlib = require('path');
var moment = require('moment');
           
const iohook = require('iohook');
const robot = require("robotjs");


var common = require('./common.js');
var trace = common.trace;
var easyhash = common.easyhash
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


var hotkey_startRecord = "Ctrl+Shift+R"
var hotkey_stopRecord  = "Ctrl+Shift+S"
var hotkey_quit        = "Ctrl+Shift+Q"
// startReplay = "Ctrl+Alt+J"		
// stopReplay  = "Ctrl+Alt+K"	

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

	lastreplay.map((e, index)=>{
		var fn = e.type;
		var x = e.x;
		var y = e.y;
		var ms = e.pre_nexttime;

		var sz_x = (`${x}`).padStart(4, ' ')
		var sz_y = (`${y}`).padStart(4, ' ')
		var sz_ms = (`${ms}`).padStart(5, ' ')
		var sz_fn = (`${fn}`).padStart(10, ' ')
		var sz_index = (`${index+1}`).padStart(4, ' ')

		var part1 = `line(${sz_index});`
		var part2 = `${sz_fn}(${sz_x}, ${sz_y});`;
		var part3 = `sleep(${sz_ms});`;
	  if (ms <= 0 ) {
	  	part3 = "";
	  }

	  line = part1 + part2 + part3;
		arr_line.push(line)
	})

	var text = arr_line.join('\n');
	save_replay(lastreplay.id, text)
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
	if (isHotkeyEvent(e, hotkey_startRecord)) {
		print("")
		print(1, hotkey_startRecord)
		startRecord(e)
	}
	if (isHotkeyEvent(e, hotkey_stopRecord)) {
		print("")
		print(2, hotkey_stopRecord)
		stopRecord(e)
	}

	if (isHotkeyEvent(e, hotkey_quit)) {
		print("")
		print(0, hotkey_quit)
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
----------------------------------------
--  
--              Menu
--  
--          ------------
--  
--    Start | ${hotkey_startRecord}
--    Stop  | ${hotkey_stopRecord}
--    Quit  | ${hotkey_quit}
--    
----------------------------------------
`);
