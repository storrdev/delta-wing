var Player = function(startX, startY, name) {

	var x = startX,
		y = startY,
		velX = 0,
		velY = 0,
		angle = 0,
		name = name,
		id;
		
	var getX = function() {
		return x;
	}
	
	var getY = function() {
		return y;
	}

	var getvelX = function() {
		return velX;
	}

	var getvelY = function() {
		return velY;
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

	var setVelX = function(odX) {
		velX = odX;
	}

	var setVelY = function(odY) {
		velY = odY;
	}
	
	var setAngle = function(newAngle) {
		angle = newAngle;
	}
	
	return {
		getX: getX,
		getY: getY,
		getvelX: getvelX,
		getvelY: getvelY,
		getAngle: getAngle,
		setX: setX,
		setY: setY,
		setVelX: setVelX,
		setVelY: setVelY,
		setAngle: setAngle,
		name: name,
		id: id
	}

};

exports.Player = Player;