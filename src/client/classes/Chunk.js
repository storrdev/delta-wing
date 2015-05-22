/*
*	Chunk Class
*	
*	Extends: PIXI.Container class
*/

var Chunk = function(data) {

	console.log(data);

	/*
	*	Outputs:
	*	Object {
	*	  "_id": "555f7939c3ae58523f63b847",
	*	  "x": 2,
	*	  "y": 2,
	*	  "height": 2000,
	*	  "width": 2000,
	*	  "__v": 0,
	*	  "layers": [
	*	    {
	*	      "name": "collision",
	*	      "height": 2000,
	*	      "width": 2000,
	*	      "opacity": 1,
	*	      "visible": true,
	*	      "type": "objectgroup",
	*	      "objects": []
	*	    }
	*	  ]
	*	}
	*/
	
	PIXI.Container.call(this);

	console.log(this);

	this.height = data.height;
	this._width = data.width;
	this.coords = {
		x: data.x,
		y: data.y
	};
	this.x = data.x * this._width;
	this.y = data.y * this.height;
	console.log(this.height);
	this.planets = [];

	var border = new PIXI.Graphics();
	border.lineStyle(2, 0xFF0000, 1);
	border.drawRect(this.x, this.y, this.width, this.height);
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