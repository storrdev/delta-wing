/*
*	Chunk Class
*	
*	Extends: Nothing currently
*/

var Chunk = function(data) {

	this.x = data.x;
	this.y = data.y;

	this.planets = data.planets;

	for (var c = 0; c < data.json.layers.length; c++) {
		//console.log('chunk objects: ' + data.json.layers[c].objects.length);
		for (var o = 0; o < data.json.layers[c].objects.length; o++) {
			var yMultiplier = data.json.height * data.json.tileheight * data.json.y;
			var xMultiplier = data.json.width * data.json.tilewidth * data.json.x;
			//console.log(data.json.layers[c].objects[0]);
			var planet = new Planet(data.json.layers[c].objects[o]);
			console.log('new planet created');
			//console.log(game.planets);
			game.planets.push(planet);
			//console.log('new planet pushed into planet array');
			game.level.addChild(planet.graphics);
			console.log('new planet added to game.level');
		}
	}

};

Chunk.prototype.update = function() {
	
};