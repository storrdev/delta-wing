/*
*	Radar Class
*	
*	Extends: PIXI.Container class
*/

var Radar = function() {

	PIXI.Container.call(this);

	this.objects = [];

	this.zoom = 0.1;

	// this.width = 300;
	// this.height = 300;

	var width = 250;
	var height = 250;

	this.position = {
		x: game.width - width,
		y: game.height - height
	};

	console.log(this.position);

	this.view = new PIXI.Graphics();
	this.view.beginFill(0x000000);
	this.view.lineStyle(2, 0x17E4FF, 0.4);
	this.view.fillAlpha = 0.4;

	this.anchor = {
		x: 0.5,
		y: 0.5
	};

	this.view.drawRect(0, 0, width, height);
	this.view.endFill();

	this.mask = new PIXI.Graphics();
	this.mask.beginFill();
	this.mask.drawRect(0, 0, width, height);
	this.mask.endFill();

	this.addChild(this.mask);

	this.addChild(this.view);

	// this.view = mask;
};

Radar.prototype = Object.create(PIXI.Container.prototype);

Radar.prototype.constructor = Radar;

/*
*	Methods
*/

Radar.prototype.update = function() {

};

Radar.prototype.addObject = function(object) {
	this.objects.push(object);

	console.log(object instanceof Planet);
	console.log(object.radius);

	var graphics = new PIXI.Graphics();
	graphics.beginFill(0xFFFFFF);
	graphics.drawCircle(object.position.x * this.zoom, object.position.y * this.zoom, 15);
	graphics.endFill();

	this.addChild(graphics);

	graphics.mask = this.mask;
};