'use strict';
const iohook = require('iohook');
var print = console.log;



var hotkey_startRecord = "Ctrl+Shift+R"
var hotkey_stopRecord  = "Ctrl+Shift+S"
var hotkey_quit        = "Ctrl+Shift+Q"




var common = require('../common.js');
var trace = common.trace;
var easyhash = common.easyhash
// var isHotkeyEvent = common.isHotkeyEvent
var log_folder = common.log_folder

//----------------------------------------------------------
// rem
//----------------------------------------------------------

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
	// print(111, arr, event, arr.ctrlKey !== event.ctrlKey)
	if (arr.ctrlKey !== event.ctrlKey ) {
		return false;
	}
	// print(222, arr, event, arr.shiftKey !== event.shiftKey)
	if (arr.shiftKey !== event.shiftKey ) {
		return false;
	}
	// print(333, arr, event, arr.altKey !== event.altKey)
	if (arr.altKey !== event.altKey ) {
		return false;
	}
	// print(444, arr)
	var keycode = event.rawcode
  var str = String.fromCharCode(keycode)
  // print(555, str, keycode)
  if (caseSensitive) {
  	return arr.includes(str);
  }
	return (arr.includes(str.toLowerCase()) || arr.includes(str.toUpperCase()));
}


//----------------------------------------------------------
// rem
//----------------------------------------------------------




// { button: 1, clicks: 1, x: 545, y: 696, type: 'mousedown' }
// { button: 1, clicks: 1, x: 545, y: 696, type: 'mouseclick' }

//Register and stark hook 
// iohook.on("mouseclick", (e) => {
//   dispatch(e)
// });


// {keychar: 'f', keycode: 19, rawcode: 15, type: 'keypress'}
iohook.on("keydown", (e) => {
	print(100, e)
	if (isHotkeyEvent(e, hotkey_startRecord)) {
		print("")
		print(1, hotkey_startRecord)
	}
	if (isHotkeyEvent(e, hotkey_stopRecord)) {
		print("")
		print(2, hotkey_stopRecord)
	}

	if (isHotkeyEvent(e, hotkey_quit)) {
		print("")
		print(0, hotkey_quit)
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
