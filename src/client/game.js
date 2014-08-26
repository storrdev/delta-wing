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

		game.ship = new PIXI.Sprite.fromImage('fighter.png');
		game.ship.position.x = window.innerWidth / 2;
		game.ship.position.y = window.innerHeight / 2;
		game.ship.anchor.x = 0.5;
		game.ship.anchor.y = 0.5;
		game.ship.scale.x = 1;
		game.ship.scale.y = 1;
		game.ship.radius = 30 * game.ship.scale.x;
		game.ship.mass = 1;
		game.ship.thrust = 0.2;
		game.ship.velocity = {
			x: 0,
			y: 0
		};
		game.ship.vector = {
			x: 0,
			y: 0
		};
		game.ship.state = 'launched';
		game.stage.addChild(game.ship);

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
		game.background.tilePosition.x -= 0.2 * game.ship.velocity.x;
		game.midground.tilePosition.x -= 0.4 * game.ship.velocity.x;
		game.background.tilePosition.y -= 0.2 * game.ship.velocity.y;
		game.midground.tilePosition.y -= 0.4 * game.ship.velocity.y;

		game.level.position.x -= 0.5 * game.ship.velocity.x;
		game.level.position.y -= 0.5 * game.ship.velocity.y;

		game.ship.rotation = getAngle(game.mouse.position.x, game.ship.position.x, game.mouse.position.y, game.ship.position.y);

		if (game.ship.state === 'launched') {
			for (var p = 0; p < game.planets.length; p++) {
		 		//var distance = getDistance(game.planets[p], game.level);
		 		var distance = Math.sqrt(Math.pow(game.planets[p].position.x + (-game.ship.position.x + game.level.position.x), 2) + Math.pow(game.planets[p].position.y + (-game.ship.position.y + game.level.position.y), 2));
		 		if (p === 0) {
		 			//console.log(distance);
		 		}

		 		var planetVector = new Vector(game.ship.position.x, game.planets[p].position.x,
		 								game.ship.position.y, game.planets[p].position.y);

		// 		var topSpeed = 10;

		// 		var gravitationalForce = (game.gravity * game.ship.mass * game.planets[p].mass)/Math.pow(distance,2);

				if (distance < game.ship.radius + game.planets[p].radius) {
					//game.ship.state = 'colliding';
					/*if (game.planets[p].target == 'true') {
						game.explosion.onComplete = function() { game.win(); }
					}*/

					console.log('colliding');

					game.ship.vector.x = -planetVector.x;
					game.ship.vector.y = -planetVector.y;
				}
		// 		else {
		// 			game.ship.vector.x += planetVector.x * gravitationalForce;
		// 			game.ship.vector.y += planetVector.y * gravitationalForce;
		// 		}

		// 		if (Math.abs(game.ship.vector.x) > topSpeed) {
		// 			game.ship.vector.x = (Math.abs(game.ship.vector.x)/game.ship.vector.x) * topSpeed;
		// 		}
		// 		if (Math.abs(game.ship.vector.y) > topSpeed) {
		// 			game.ship.vector.y = (Math.abs(game.ship.vector.y)/game.ship.vector.y) * topSpeed;
		// 		}

		// 		game.planets[p].position.x -= game.ship.velocity.x;
		// 		game.planets[p].position.y -= game.ship.velocity.y;
		// 		game.shadows[p].position.x -= game.ship.velocity.x;
		// 		game.shadows[p].position.y -= game.ship.velocity.y;
			}

			var mouseVector = new Vector(game.ship.position.x, game.mouse.position.x,
										game.ship.position.y, game.mouse.position.y);

			var acceleration = 0.05;

			if (game.key.isDown(game.key.UP)) {
				game.ship.vector.x += mouseVector.x * acceleration;
				game.ship.vector.y += mouseVector.y * acceleration;
			}
			if (game.key.isDown(game.key.DOWN)) {
				game.ship.vector.x -= mouseVector.x * acceleration;
				game.ship.vector.y -= mouseVector.y * acceleration;
			}

			game.ship.velocity.x = game.ship.vector.x;
			game.ship.velocity.y = game.ship.vector.y;

		}
		else if (game.ship.state == 'colliding') {
			if (!game.explosion.playing) {
				game.ship.visible = false;
				game.ship.velocity.x = 0;
				game.ship.velocity.y = 0;
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

})();