/*
*	Planet Class
*	
*	Extends: PIXI.DisplayObjectContainer class
*/

var Planet = function(attributes) {

	PIXI.DisplayObjectContainer.call(this);

	this.graphics = new PIXI.Graphics();
	this.graphics.beginFill(0x3399FF);

	this.anchor = {
		x: 0.5,
		y: 0.5
	};

	this.radius = attributes.radius;

	this.mass = this.radius * attributes.density;

	console.log(this.mass);

	this.x = attributes.x;
	this.y = attributes.y;

	this.graphics.drawCircle( this.x, this.y, this.radius );
	this.graphics.endFill();

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