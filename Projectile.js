var Projectile = function(startX, startY, playerId, id) {

	var x = startX,
		y = startY,
		playerId = playerId,
		id = id;
		
	var getX = function() {
		return x;
	};
	
	var getY = function() {
		return y;
	};
	
	return {
		getX: getX,
		getY: getY,
		id: id
	}

};

exports.Projectile = Projectile;