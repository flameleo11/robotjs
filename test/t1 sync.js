const execSync = require('child_process').execSync;
code = execSync('xwininfo');

var print = console.log;

var print = console.log;
print(code.toString())