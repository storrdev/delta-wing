/*
*	Chunk Class
*	
*	Extends: PIXI.Container class
*/

var Chunk = function(data) {
	
	PIXI.Container.call(this);

	this.height = data.height;
	this.width = data.width;
	this.coords = {
		x: data.x,
		y: data.y
	};
	this.x = data.x * this._width;
	this.y = data.y * this._height;

	this.planets = [];

	var border = new PIXI.Graphics();
	border.lineStyle(2, 0xFF0000, 1);
	border.drawRect(0, 0, this._width, this._height);
	this.addChild(border);

	for (var c = 0; c < data.layers.length; c++) {
		for (var o = 0; o < data.layers[c].objects.length; o++) {
	 		var planet = new Planet(data.layers[c].objects[o]);
			game.planets.push(planet);
			this.planets.push(planet);
	 		this.addChild(planet.graphics);
	 	}
	}

};

Chunk.prototype = Object.create(PIXI.Container.prototype);

Chunk.prototype.constructor = Chunk;

/*
*	Methods
*/

Chunk.prototype.update = function() {
	
};