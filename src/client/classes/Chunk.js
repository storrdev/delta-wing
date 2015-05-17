/*
*	Chunk Class
*	
*	Extends: Nothing currently
*/

var Chunk = function(attributes) {

	this.width = 1000;
	this.height = 1000;

	this.x = attributes.x;
	this.y = attributes.y;

	this.planets = attributes.planets;

};

Chunk.prototype.update = function() {
	
};

Chunk.prototype.addPlanet = function(planet) {
	this.planets.push(planet);
};