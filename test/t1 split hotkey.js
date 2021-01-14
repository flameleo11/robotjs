
var key = "Ctrl+Alt+A"
var key = "Ctrl+~"
var key = "Ctrl+F7"
var key = "Ctrl+Shift+A"
var key = "Shift+A"
var key = "Alt+A"
var key = "Ctrl+Shift+Alt+A"



var print = console.log;

var print = console.log;

print(key.split("+"))

var arr = key.split("+")


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
	if (true) {

	}
});

  // var keycode = e.rawcode
  // var ch = String.fromCharCode(keycode)


print(1, ctrlKey)
print(1, shiftKey)
print(1, altKey)

print('a')
print(String.fromCharCode('a'))
print(arr.includes('A'))

// if (string1.toLowerCase() === string2.toLowerCase())
