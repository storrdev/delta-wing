Vector = function(x1, x2, y1, y2) {

	var dx = x2 - x1;
	var dy = y2 - y1;

	this.mag = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

	this.x = dx / this.mag;
	this.y = dy / this.mag;

};

function getDistance(obj1, obj2) {

	return Math.sqrt(Math.pow(obj1.position.x - obj2.position.x, 2) + Math.pow(obj1.position.y - obj2.position.y, 2));

}

function getAngle(x1, x2, y1, y2) {
	var angle;

	if (x1 == x2) {
		if (y1 < y2) { return 0; }
		else { return 180 * (Math.PI/180); }
	}
	else {
		angle = Math.atan((y2-y1)/(x2-x1));
		if (x1 < x2) {
			return angle - 90 * (Math.PI/180);
		}
		else {
			return angle + 90 * (Math.PI/180);
		}
	}
}
