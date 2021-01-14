'use strict';
const ioHook = require('iohook');
var print = console.log;
ioHook.on("mousemove", event => {
  // console.log(event);
  // result: {type: 'mousemove',x: 700,y: 400}
});

//Register and stark hook 
// result: {keychar: 'f', keycode: 19, rawcode: 15, type: 'keypress'}
ioHook.on("keydown", (e) => {
  var keycode = e.rawcode
  var ch = String.fromCharCode(keycode)
  print(e, ch)
});
ioHook.start();