/*
*	Ship Class
*	
*	Extends: PIXI.Container class
*/

var Ship = function(x, y, image, focused) {

	PIXI.Container.call(this);

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
		x: game.width / 2,
		y: game.height / 2
	};
	this.image = image;
	this.focused = typeof focused != 'undefined' ? focused : false;
};

Ship.prototype = Object.create(PIXI.Container.prototype);

Ship.prototype.constructor = Ship;

/*
*	Methods
*/

Ship.prototype.update = function() {

	if (game.ship.state === 'launched') {

		// GET SHIP'S CURRENT CHUNK
		var chunkX = Math.floor( game.ship.x / game.chunkSize );
		var chunkY = Math.floor( game.ship.y / game.chunkSize );

		//var currentChunk = game.getChunk( chunkX, chunkY );

		//console.log( 'loadSurroundingChunks: ' + chunkX + ', ' + chunkY );
		game.loadSurroundingChunks(chunkX, chunkY);

		game.ship.rotation = getAngle(game.mouse.position.x, game.ship.screen.x, game.mouse.position.y, game.ship.screen.y);

	 	game.chunks.forEach(function(chunk, index) {
	 		chunk.planets.forEach(function(planet, index) {

		 		// get real position on map
		 		planetX = planet.x + chunk.x;
		 		planetY = planet.y + chunk.y;

		 		var distance = Math.sqrt(
		 			Math.pow(game.ship.x - planetX, 2) + Math.pow(game.ship.y - planetY, 2)
		 		);

		 		var planetVector = new Vector(game.ship.x, planetX,
		 								game.ship.y, planetY);

		 		var gravitationalForce = (game.gravity * game.ship.mass * planet.mass)/Math.pow(distance,2);

				if (distance < game.ship.radius + (planet.radius)) {
					game.ship.vector.x = -(planetVector.x * 0.1 );
					game.ship.vector.y = -(planetVector.y * 0.1 );
				}
				else {
					game.ship.vector.x += planetVector.x * gravitationalForce;
					game.ship.vector.y += planetVector.y * gravitationalForce;
				}
	 		});
	 	});

		var mouseVector = new Vector(game.ship.screen.x, game.mouse.position.x,
									game.ship.screen.y, game.mouse.position.y);

		var acceleration = 0.05;

		if (game.key.isDown(game.key.UP)) {
			game.ship.vector.x += mouseVector.x * acceleration;
			game.ship.vector.y += mouseVector.y * acceleration;

			game.ship.flame.visible = true;
			game.ship.flame.play();
			
			game.particles.push( new Smoke( game.ship.x, game.ship.y, mouseVector ) );
			game.layers.particles.addChild( game.particles[ game.particles.length - 1 ] );

			var max_particles = 500;
			if (game.particles.length > max_particles) {
				//console.log('max particles reached. deleting particles');
				game.layers.particles.removeChild( game.particles[0] );
				game.particles.shift();
			}

		}
		else {
			game.ship.flame.visible = false;
			game.ship.flame.stop();
		}
		if (game.key.isDown(game.key.DOWN)) {
			game.ship.vector.x -= mouseVector.x * acceleration;
			game.ship.vector.y -= mouseVector.y * acceleration;
		}

		game.ship.x += game.ship.vector.x;
		game.ship.y += game.ship.vector.y;

		game.peers.forEach(function(element, index){
			element.send({
				id: game.network.peer.id,
				x: game.ship.x,
				y: game.ship.y
			});
		});

	}
	else if (game.ship.state == 'colliding') {
		if (!game.explosion.playing) {
			game.ship.visible = false;
			game.ship.vector.x = 0;
			game.ship.vector.y = 0;
			game.explosion.position.x = game.ship.position.x;
			game.explosion.position.y = game.ship.position.y;
			game.explosion.visible = true;
			game.explosion.gotoAndPlay(0);
		}
	}
	else {
		
	// 	if (game.dragging === true && game.level.position.x <= 0) {
	// 		game.level.position.x -= (game.lastMousePosition - game.mouse.position.x) * 2;
	// 		if (game.level.position.x > 0) {
	// 			game.level.position.x = 0;
	// 		}
			
	// 	}
	// 	game.lastMousePosition = game.mouse.position.x;

	// 	game.ship.click = function(data) {
	// 		if (game.ship.state == 'idle') {
	// 			game.aimLine.visible = true;
	// 			game.ship.state = 'ready';
	// 		}
	// 		else if (game.ship.state == 'ready') {
	// 			game.aimLine.visible = false;
	// 			game.ship.state = 'idle';
	// 		}
	// 	}
	// }

	// game.gutter = 200;

	// if (game.ship.position.x < -game.gutter || game.ship.position.x > (game.level.json.width * game.level.json.tilewidth) + game.gutter ||
	// 	game.ship.position.y < -game.gutter || game.ship.position.y > (game.level.json.height * game.level.json.tileheight) + game.gutter) {
		
	// 	game.reset();
	
	}
};