
function mouseclick(x, y, smooth=false, fix=false) {
	var mouse = robot.getMousePos();
	var x1 = mouse.x;
	var y1 = mouse.y;
	// start postion
	mousemove(x, y, smooth)

	robot.mouseClick();
	if (fix) {
		robot.mouseToggle("up");
	}
	sleep_org(100)
	mousemove(x1, y1, smooth)
}
