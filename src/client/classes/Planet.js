/*
*	Planet Class
*	
*	Extends: PIXI.DisplayObjectContainer class
*/

var Planet = function(attributes) {

	//console.log('planet attributes');
	//console.log(attributes);

	PIXI.DisplayObjectContainer.call(this);

	//console.log(attributes.texture);

	//var texture = PIXI.Texture.fromImage('../../assets/planets/' + attributes.texture);
	// var texture = PIXI.Texture.fromImage(attributes.texture);

	this.graphics = new PIXI.Graphics();

	//console.log('planet texture: ' + texture);

	this.graphics.beginFill(0xFF3300);

	//this.sprite = new PIXI.Sprite(texture);

	//console.log(this.sprite);

	//this.addChild(this.sprite);

	//console.log('planet texture sprite added to planet object container');

	//this.sprite.anchor.x = 0.5;
	//this.sprite.anchor.y = 0.5;

	this.anchor = {
		x: 0.5,
		y: 0.5
	};

	//console.log('planet sprite anchors set');

	// this.sprite.scale.x = attributes.scale;
	// this.sprite.scale.y = attributes.scale;

	this.scale.x = attributes.scale;
	this.scale.y = attributes.scale;

	//console.log('planet sprite scale set');

	//this.radius = (attributes.texture.width / 2) * this.scale.x;

	this.radius = 200;

	//console.log('planet object container radius set');

	this.mass = attributes.scale * attributes.density;

	//console.log('planet object container mass set');

	this.x = attributes.x;
	this.y = attributes.y;

	this.graphics.drawCircle( this.x, this.y, this.radius );
	this.graphics.endFill();

	//console.log('planet object container x and y set');

	this.screen = {
		x: 0,
		y: 0
	};

	//console.log('planet object screen.x and screen.y set');

	//console.log('end of planet constructor');
};

Planet.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

Planet.prototype.constructor = Planet;

/*
*	Methods
*/

Planet.prototype.update = function() {
	
};