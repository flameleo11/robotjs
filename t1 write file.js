
var fs = require('fs');
var moment = require('moment'); // require
           

// fs.writeFile('./log/helloworld.txt', 'Hello World!', function (err) {
//   if (err) return console.log(err);
//   console.log('Hello World > helloworld.txt');
// });

var print = console.log;

var id = moment().format();     
var id = moment().format('YYYYMM_DD_hh_mm_ss'); // January 13th 2021, 10:18:13 pm

function easyhash(str) {
  var x = 0;
  if (str.length > 0) {
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        x = ((x<<5)-x)+char;
        x = x & x; // Convert to 32bit integer
    }
  }
  return ("00000000"+(x >>> 0).toString(16)).substr(-4);
}

function get_file_name(id=0, now) {
	var now = now || moment()
	var session_id = easyhash(now.format());
  var str = moment().format('YYYYMMDD') 
						  + "_" + session_id 
						  + "_" + id
						  + ".js";
  return str;
}


function save_replay(id=0, text) {
	var now = moment()
	var name = get_file_name(id, now)
	var path = "./log/"+name;
	fs.writeFile(path, text, function (err) {
	  if (err) return print(err);
	});

}

save_replay()

print(get_file_name(), easyhash(moment().format()))
