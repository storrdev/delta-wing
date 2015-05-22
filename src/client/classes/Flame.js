/*
*	Flame Class
*	
*	Extends: PIXI.extras.MovieClip class
*/

var Flame = function() {
	var textures = [];

	for (i = 1; i <= 3; i++) {
		var texture = PIXI.Texture.fromFrame('flames/blue_flame_0' + i + '.png');
		textures.push(texture);
	}

	PIXI.extras.MovieClip.call(this, textures);

	this.animationSpeed = 0.5;
};

Flame.prototype = Object.create(PIXI.extras.MovieClip.prototype);

Flame.prototype.constructor = Flame;