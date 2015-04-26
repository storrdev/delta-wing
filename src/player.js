//var Player = function(startX, startY, name) {

var Player = function(attr) {

	var x = attr.x,
		y = attr.y,
		velX = 0,
		velY = 0,
		angle = 0,
		id = attr.id,
		kills = 0,
		deaths = 0;

	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var getvelX = function() {
		return velX;
	};

	var getvelY = function() {
		return velY;
	};

	var getAngle = function() {
		return angle;
	};

	var getKills = function() {
		return kills;
	};

	var getDeaths = function() {
		return deaths;
	};

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	var setVelX = function(odX) {
		velX = odX;
	};

	var setVelY = function(odY) {
		velY = odY;
	};

	var setAngle = function(newAngle) {
		angle = newAngle;
	};

	var setKills = function(newKills) {
		kills = newKills;
	};

	var setDeaths = function(newDeaths) {
		deaths = newDeaths;
	};

	return {
		getX: getX,
		getY: getY,
		getvelX: getvelX,
		getvelY: getvelY,
		getAngle: getAngle,
		getKills: getKills,
		getDeaths: getDeaths,
		setX: setX,
		setY: setY,
		setVelX: setVelX,
		setVelY: setVelY,
		setAngle: setAngle,
		setKills: setKills,
		setDeaths: setDeaths,
		name: name,
		id: id,
		kills: kills,
		deaths: deaths
	};

};

exports.Player = Player;
