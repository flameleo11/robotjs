'use strict';
const ioHook = require('iohook');

const id = ioHook.registerShortcut([29, 65], (keys) => {
  console.log('Shortcut called with keys:', keys)
});

ioHook.unregisterShortcut(id);


ioHook.unregisterAllShortcuts();



// { button: 1, clicks: 1, x: 545, y: 696, type: 'mousedown' }
// { button: 1, clicks: 1, x: 545, y: 696, type: 'mouseclick' }

//Register and stark hook 
ioHook.start();