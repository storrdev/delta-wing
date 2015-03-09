/*
*	Planet Class
*	
*	Extends: PIXI.DisplayObjectContainer class
*/

var Planet = function(attributes) {

	PIXI.DisplayObjectContainer.call(this);

	var texture = PIXI.Texture.fromImage(attributes.texture);

	this.sprite = new PIXI.Sprite(texture);

	this.addChild(this.sprite);

	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
	this.sprite.scale.x = attributes.scale.x;
	this.sprite.scale.y = attributes.scale.y;
	this.radius = (attributes.texture.width / 2) * this.scale.x;
	this.mass = attributes.scale.x * attributes.density;

	this.x = x;
	this.y = y;
	this.screen = {
		x: 0,
		y: 0
	};
};

Planet.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

Planet.prototype.constructor = Planet;

/*
*	Methods
*/

Planet.prototype.update = function() {
	
};