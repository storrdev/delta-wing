/*
*	Radar Class
*	
*	Extends: PIXI.Container class
*/

var Radar = function() {

	PIXI.Container.call(this);

	this.objects = [];
	this.objectContainer = new PIXI.Container();
	// this.objectContainer.scale = {
	// 	x: 0.1,
	// 	y: 0.1
	// };

	this.zoom = 0.01;

	var width = 250;
	var height = 250;

	this.position = {
		x: game.width - width,
		y: game.height - height
	};

	this.objectContainer.position = {
		x: this.position.x * this.zoom,
		y: this.position.y * this.zoom
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

	// Clips the graphic objects in the rader so they
	// don't show up outside the radar boundaries.
	// this.mask = new PIXI.Graphics();
	// this.mask.beginFill();
	// this.mask.drawRect(0, 0, width, height);
	// this.mask.endFill();

	// this.addChild(this.mask);

	this.addChild(this.view);

	this.addChild(this.objectContainer);

	// Draw local player to middle of radar
	this.player = new PIXI.Graphics();
	this.player.beginFill(0xFF00FF);
	this.player.drawCircle(width/2, height/2, 3);
	this.player.endFill();

	this.addChild(this.player);
};

Radar.prototype = Object.create(PIXI.Container.prototype);

Radar.prototype.constructor = Radar;

/*
*	Methods
*/

Radar.prototype.update = function() {
	this.objectContainer.position.x = ( 250/2 ) - game.ship.x * this.zoom;
	this.objectContainer.position.y = ( 250/2 ) - game.ship.y * this.zoom;
};

Radar.prototype.addObject = function(object) {
	this.objects.push(object);

	console.log(this.zoom);
	console.log(object.radius);

	var graphics = new PIXI.Graphics();
	graphics.beginFill(0xFFFFFF);
	graphics.drawCircle(object.screenX * this.zoom, object.screenY * this.zoom, object.radius * this.zoom);
	// graphics.drawCircle(0, 0, 5);
	graphics.endFill();

	this.objectContainer.addChild(graphics);

	// graphics.mask = this.mask;
};

Radar.prototype.addChunk = function(chunk) {
	console.log(chunk);
};