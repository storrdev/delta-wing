var Projectile = function(startX, startY, deltaX, deltaY, playerId, id) {

	var x = startX,
		y = startY,
		deltaX = deltaX,
		deltaY = deltaY,
		playerId = playerId,
		id = id;
		
	var getX = function() {
		return x;
	};
	
	var getY = function() {
		return y;
	};
	
	var getDeltaX = function() {
		return deltaX;
	};
	
	var getDeltaY = function() {
		return deltaY;
	};
	
	var getPlayerId = function() {
		return playerId;
	};
	
	var getId = function() {
		return id;
	};
	
	return {
		getX: getX,
		getY: getY,
		getDeltaX: getDeltaX,
		getDeltaY: getDeltaY,
		getPlayerId: getPlayerId,
		getId: getId
	}

};

exports.Projectile = Projectile;