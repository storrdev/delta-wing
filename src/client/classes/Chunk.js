/*
*	Chunk Class
*	
*	Extends: PIXI.Container class
*/

var Chunk = function(data) {

	PIXI.Container.call(this);

	//console.log(data);

	this.height = data.json.height;
	this.width = data.json.width;
	this.coords = {
		x: data.x,
		y: data.y
	};
	this.x = data.x * this.width;
	this.y = data.y * this.height;
	this.planets = [];

	var border = new PIXI.Graphics();
	border.lineStyle(2, 0xFF0000, 1);
	border.drawRect(this.x, this.y, this.width, this.height);
	game.level.addChild(border);

	for (var c = 0; c < data.json.layers.length; c++) {
	// 	//console.log('chunk objects: ' + data.json.layers[c].objects.length);
		for (var o = 0; o < data.json.layers[c].objects.length; o++) {
	// 		var yMultiplier = data.json.height * data.json.tileheight * data.json.y;
	// 		var xMultiplier = data.json.width * data.json.tilewidth * data.json.x;
	// 		//console.log(data.json.layers[c].objects[0]);
	 		var planet = new Planet(data.json.layers[c].objects[o]);
	// 		console.log('new planet created');
	 		//console.log(planet);
			//console.log(game.planets);
			game.planets.push(planet);
			this.planets.push(planet);
	// 		//console.log('new planet pushed into planet array');
	 		this.addChild(planet.graphics);
	 		//console.log('new planet added to game.level');
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