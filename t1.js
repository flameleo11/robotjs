var path = require('path');
var app_folder = path.dirname(__filename);
var log_folder = path.join(app_folder, 'log');


var print = console.log;

print(app_folder)
print(log_folder+"asdf")

name = "sadf"
print(path.join(log_folder, name))

var replay_name = "./log/"+"asdf"
print(111, replay_name)
// ("./log/").length
if (replay_name.startsWith("./log/")) {
	print(2222, replay_name.slice(("./log/").length))
}
