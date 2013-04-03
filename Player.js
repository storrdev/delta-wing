var Player = function(startX, startY, startAngle) {

	var x = startX,
		y = startY,
		angle = startAngle,
		id;
		
	var getX = function() {
		return x;
	}
	
	var getY = function() {
		return y;
	}
	
	var getAngle = function() {
		return angle;
	}
	
	var setX = function(newX) {
		x = newX;
	}
	
	var setY = function(newY) {
		y = newY;
	}
	
	var setAngle = function(newAngle) {
		angle = newAngle;
	}
	
	return {
		getX: getX,
		getY: getY,
		getAngle: getAngle,
		setX: setX,
		setY: setY,
		setAngle: setAngle,
		id: id
	}

};

exports.Player = Player;