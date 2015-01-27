/*
*
*	Smoke Class
*	
*	Extends: PIXI.Sprite Class
*
*/

var Smoke = function(x, y, vector) {
	var texture = new PIXI.Texture.fromImage('smoke.png');

	PIXI.Sprite.call(this, texture);

	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.scale.x = 0.1;
	this.scale.y = 0.1;
	this.radius = (texture.width / 2) * this.scale.x;
	this.mass = 0.1;
	this.alpha = 0.8;
	this.rotation = Math.random() * 2;

	this.vector = {
		x: vector.x * -5,
		y: vector.y * -5
	};

	this.x = x - (vector.x * 25);
	this.y = y - (vector.y * 25);
};

Smoke.prototype = Object.create(PIXI.Sprite.prototype);

Smoke.prototype.constructor = Smoke;

Smoke.prototype.update = function() {
	this.alpha -= 0.005;
	this.scale.x += 0.005;
	this.scale.y += 0.005;

	var that = this;

	game.planets.forEach(function(planet, index){
		var distance = Math.sqrt(
			Math.pow(planet.x - that.x, 2) +
			Math.pow(planet.y - that.y, 2)
		);

		if ( distance < planet.radius ) {
			that.vector.x = 0;
			that.vector.y = 0;
		}
	});

	this.x += this.vector.x;
	this.y += this.vector.y;

	this.vector.x *= 0.95;
	this.vector.y *= 0.95;
};