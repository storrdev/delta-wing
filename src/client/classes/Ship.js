/*
*	Ship Class
*/

var Ship = function(x, y, image, focused) {
	var texture = PIXI.Texture.fromImage(image);

	PIXI.Sprite.call(this, texture);

	this.state = 'launched';
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.scale.x = 1;
	this.scale.y = 1;
	this.radius = (texture.width / 2) * this.scale.x;
	this.mass = 1;
	this.thrust = 0.2;
	this.vector = {
		x: 0,
		y: 0
	};

	this.x = x;
	this.y = y;
	this.image = image;
	this.focused = typeof focused != 'undefined' ? focused : false;
};

Ship.prototype = Object.create(PIXI.Sprite.prototype);

Ship.prototype.constructor = Ship;