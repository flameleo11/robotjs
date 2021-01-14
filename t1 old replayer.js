
// [info]  { button: 1, clicks: 1, x: 924, y: 854, type: 'mouseclick' }
// [info]  { button: 1, clicks: 1, x: 987, y: 803, type: 'mouseclick' }
// [info]  { button: 1, clicks: 1, x: 1133, y: 829, type: 'mouseclick' }
function startReplay(e) {
	if (curstate !== "idle") {
		print("[warning] not idle: ", curstate)
		return 
	}
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
