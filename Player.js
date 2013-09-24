var Player = function(startX, startY, startAngle) {

	var x = startX,
		y = startY,
		oldDeltaX = 0,
		oldDeltaY = 0,
		angle = startAngle,
		id;
		
	var getX = function() {
		return x;
	}
	
	var getY = function() {
		return y;
	}

	var getOldDeltaX = function() {
		return oldDeltaX;
	}

	var getOldDeltaY = function() {
		return oldDeltaY;
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

	var setOldDeltaX = function(odX) {
		oldDeltaX = odX;
	}

	var setOldDeltaY = function(odY) {
		oldDeltaY = odY;
	}
	
	var setAngle = function(newAngle) {
		angle = newAngle;
	}
	
	return {
		getX: getX,
		getY: getY,
		getOldDeltaX: getOldDeltaX,
		getOldDeltaY: getOldDeltaY,
		getAngle: getAngle,
		setX: setX,
		setY: setY,
		setOldDeltaX: setOldDeltaX,
		setOldDeltaY: setOldDeltaY,
		setAngle: setAngle,
		id: id
	}

};

exports.Player = Player;