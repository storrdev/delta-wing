var Projectile = function(startX, startY, velX, velY, playerId, id) {

	var x = startX,
		y = startY,
		velX = velX,
		velY = velY,
		playerId = playerId,
		id = id;
		
	var getX = function() {
		return x;
	};
	
	var getY = function() {
		return y;
	};
	
	var getVelX = function() {
		return velX;
	};
	
	var getVelY = function() {
		return velY;
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
		getVelX: getVelX,
		getVelY: getVelY,
		getPlayerId: getPlayerId,
		getId: getId
	}

};

exports.Projectile = Projectile;