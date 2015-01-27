(function() {

	game.assetsLoaded = function() {
		// Connect to server
		game.socket = game.network.connect();
		game.network.setEventHandlers();

		game.backgroundTexture = new PIXI.Texture.fromImage('background.png');
		game.background = new PIXI.TilingSprite(game.backgroundTexture, game.width, game.height);
		game.background.position.x = 0;
		game.background.position.y = 0;
		game.background.tilePosition.x = 0;
		game.background.tilePosition.y = 0;
		game.stage.addChild(game.background);

		game.midgroundTexture = new PIXI.Texture.fromImage('midground.png');
		game.midground = new PIXI.TilingSprite(game.midgroundTexture, game.width, game.height);
		game.midground.position.x = 0;
		game.midground.position.y = 0;
		game.midground.tilePosition.x = 0;
		game.midground.tilePosition.y = 0;
		game.stage.addChild(game.midground);

		game.stage.addChild(game.level);
		game.stage.addChild(game.layers.particles);

		game.ship = new Ship(0, 0, 'fighter.png', true);

		game.level.addChild(game.ship);

		requestAnimFrame(game.run);

	};

	game.loadSurroudingChunks = function(x, y) {
		game.chunkBuffer = 1;

		for (var xx = -game.chunkBuffer; xx <= game.chunkBuffer; xx++) {
			for (var yy = -game.chunkBuffer; yy <= game.chunkBuffer; yy++) {
				var chunkX = xx + x;
				var chunkY = yy + y;
				game.socket.emit('get chunk', { x: chunkX, y: chunkY });
			}
		}
	};

	game.run = function() {
		requestAnimFrame(game.run);
		game.update();
		game.renderer.render(game.stage);
	};

	game.update = function() {
		game.ship.screen = {
			x: game.level.x + game.ship.x,
			y: game.level.y + game.ship.y
		};

		if (game.ship.state === 'launched') {
			game.ship.rotation = getAngle(game.mouse.position.x, game.ship.screen.x, game.mouse.position.y, game.ship.screen.y);
			for (var p = 0; p < game.planets.length; p++) {
		 		var distance = Math.sqrt(
		 			Math.pow(game.planets[p].x - game.ship.x, 2) +
		 			Math.pow(game.planets[p].y - game.ship.y, 2)
		 		);
		 		if (p === 0) {
		 			//console.log(distance);
		 		}

		 		var planetVector = new Vector(game.ship.x, game.planets[p].x,
		 								game.ship.y, game.planets[p].y);

		// 		var topSpeed = 10;

		 		var gravitationalForce = (game.gravity * game.ship.mass * game.planets[p].mass)/Math.pow(distance,2);

				if (distance < game.ship.radius + (game.planets[p].radius * 0.825 )) {
					//game.ship.state = 'colliding';
					/*if (game.planets[p].target == 'true') {
						game.explosion.onComplete = function() { game.win(); }
					}*/

					console.log('colliding');

					game.ship.vector.x = -(planetVector.x * 0.1 );
					game.ship.vector.y = -(planetVector.y * 0.1 );
				}
				else {
					game.ship.vector.x += planetVector.x * gravitationalForce;
					game.ship.vector.y += planetVector.y * gravitationalForce;
				}
			}

			var mouseVector = new Vector(game.ship.screen.x, game.mouse.position.x,
										game.ship.screen.y, game.mouse.position.y);

			var acceleration = 0.05;

			if (game.key.isDown(game.key.UP)) {
				game.ship.vector.x += mouseVector.x * acceleration;
				game.ship.vector.y += mouseVector.y * acceleration;

				game.particles.push( new Smoke( game.ship.x, game.ship.y, mouseVector ) );
				game.layers.particles.addChild( game.particles[ game.particles.length - 1 ] );

				var max_particles = 500;
				if (game.particles.length > max_particles) {
					console.log('max particles reached. deleting particles');
					game.layers.particles.removeChild( game.particles[0] );
					game.particles.shift();
				}

			}
			if (game.key.isDown(game.key.DOWN)) {
				game.ship.vector.x -= mouseVector.x * acceleration;
				game.ship.vector.y -= mouseVector.y * acceleration;
			}

			game.ship.x += game.ship.vector.x;
			game.ship.y += game.ship.vector.y;

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

		game.particles.forEach(function(particle, index, object){
			if (particle.alpha <= 0) {
				game.layers.particles.removeChild( object[index] );
				object.splice(index, 1);
			}
			particle.update();
		});

		game.background.tilePosition.x -= 0.2 * game.ship.vector.x;
		game.midground.tilePosition.x -= 0.4 * game.ship.vector.x;
		game.background.tilePosition.y -= 0.2 * game.ship.vector.y;
		game.midground.tilePosition.y -= 0.4 * game.ship.vector.y;

		game.level.x = ( window.innerWidth/2 ) - game.ship.x;
		game.level.y = ( window.innerHeight/2 ) - game.ship.y;
		game.layers.particles.x = ( window.innerWidth/2 ) - game.ship.x;
		game.layers.particles.y = ( window.innerHeight/2 ) - game.ship.y;
	};

})();