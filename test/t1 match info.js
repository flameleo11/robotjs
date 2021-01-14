const execSync = require('child_process').execSync;
var print = console.log;




// const paragraph = 'The quick brown fox jumps over the lazy dog. It barked.';
// const regex = /[A-Z]/g;
// const found = paragraph.match(regex);
// console.log(found);


var text = `
xwininfo: Please select the window about which you
          would like information by clicking the
          mouse in that window.

xwininfo: Window id: 0x1e0000b "Albion Online Client"

  Absolute upper-left X:  856
  Absolute upper-left Y:  92
  Relative upper-left X:  1
  Relative upper-left Y:  29
  Width: 1024
  Height: 768
  Depth: 24
  Visual: 0x22
  Visual Class: DirectColor
  Border width: 0
  Class: InputOutput
  Colormap: 0x1e0000a (not installed)
  Bit Gravity State: ForgetGravity
  Window Gravity State: NorthWestGravity
  Backing Store State: NotUseful
  Save Under State: no
  Map State: IsViewable
  Override Redirect State: no
  Corners:  +856+92  -40+92  -40-220  +856-220
  -geometry 1024x768-39+63
`


var ret = text.match(/Window id:\s+(\w+)/)

function parseWindowId(text) {
	var ret = text.match(/Window id:\s+(\w+)/)
	var hex= ret[1]
	return Number(hex)
}


var print = console.log;

print(ret[1])
var hex= ret[1]
print( Number(hex))