var robot = require("robotjs");

var print = console.log;
// Include fs module 
const fs = require('fs'); 
   
// Calling the readFileSync() method 
// to read 'input.txt' file 
var path = "/drive_d/work/robotjs/log/20210113_f39e_0.js"
var path = "../log/20210113_f39e_0.js"

const data = fs.readFileSync(path, {encoding:'utf8', flag:'r'}); 
  
// Display the file data 
console.log(data); 