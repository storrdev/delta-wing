/*
*	Ship Class
*	
*	Extends: PIXI.DisplayObjectContainer class
*/

var Ship = function(x, y, image, focused) {

	PIXI.DisplayObjectContainer.call(this);

	this.flame = new Flame();
	this.flame.x = 0;
	this.flame.y = 0;
	this.flame.anchor.x = 0.5;
	this.flame.anchor.y = 0.95;
	this.flame.rotation = Math.PI;
	this.flame.scale.x = 0.1;
	this.flame.scale.y = 0.1;
	//this.flame.play();
	this.flame.visible = false;

	this.addChild(this.flame);

	var texture = PIXI.Texture.fromImage(image);

	this.sprite = new PIXI.Sprite(texture);

	this.addChild(this.sprite);

	this.state = 'hidden';
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
	this.sprite.scale.x = 1;
	this.sprite.scale.y = 1;
	this.radius = (texture.width / 2) * this.scale.x;
	this.mass = 1;
	this.thrust = 0.2;
	this.vector = {
		x: 0,
		y: 0
	};

	//console.log('ship coords: ' + x + ', ' + y);

	this.x = x;
	this.y = y;
	this.screen = {
		x: 0,
		y: 0
	};
	this.image = image;
	this.focused = typeof focused != 'undefined' ? focused : false;
};

Ship.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

Ship.prototype.constructor = Ship;

/*
*	Methods
*/

Ship.prototype.update = function() {
	
};