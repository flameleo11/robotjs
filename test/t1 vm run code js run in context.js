var robot = require("robotjs");

var print = console.log;

const vm = require('vm');


function mouseclick(x, y) {
	robot.moveMouse(x, y);
	robot.mouseClick();
	// body...
}

// not working
// var sandbox = new vm.createContext({print: print});
// var code = 'console.log(123);';
// vm.runInContext(code, sandbox);


var sandbox = {
  console: console
};

var context = new vm.createContext(sandbox);
var script = new vm.Script('console.log("foo")');

script.runInContext(context);

// mouseclick(34, 34)
// // robot.mouseToggle("down");
// // robot.dragMouse(100, 100);
// // robot.mouseToggle("up");
// print(11, robot.getMousePos())