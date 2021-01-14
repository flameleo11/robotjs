'use strict';


var key = "Ctrl+Alt+A"
var key = "Ctrl+Shift+A"
var key = "Ctrl+F7"
var key = "Ctrl+~"

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

function isHotkeyEvent(hotkey, event) {
	var res = parseHotkeyText(hotkey)
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
	return arr.includes(str);
}



