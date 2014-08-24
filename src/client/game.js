(function() {

	game.assetsLoaded = function() {
		// Connect to server
		game.socket = game.network.connect();
		game.network.setEventHandlers();

		game.backgroundImage = new PIXI.Texture.fromImage('background.png');
		game.background = new PIXI.TilingSprite(game.backgroundImage, game.width, game.height);
		game.background.position.x = 0;
		game.background.position.y = 0;
		game.background.tilePosition.x = 0;
		game.background.tilePosition.y = 0;
		game.level.addChild(game.background);

	};

	game.loadSurroudingChunks = function(x, y) {
		game.chunkBuffer = 2;

		for (var xx = -game.chunkBuffer; xx <= game.chunkBuffer; xx++) {
			for (var yy = -game.chunkBuffer; yy <= game.chunkBuffer; yy++) {
				var chunkX = xx + x;
				var chunkY = yy + y;
				//console.log(chunkX + ', ' + chunkY);
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
		// game.background.tilePosition.x -= 0.4 * game.ship.velocity.x;
		// game.midground.tilePosition.x -= 0.2 * game.ship.velocity.x;
		// game.background.tilePosition.y -= 0.4 * game.ship.velocity.y;
		// game.midground.tilePosition.y -= 0.2 * game.ship.velocity.y;

		// for (var s = 0; s < game.shadows.length; s++) {
		// 	var shadowAngle = getAngle(game.lightSource.x + game.level.position.x, game.shadows[s].position.x,
		// 								game.lightSource.y, game.shadows[s].position.y);
		// 	game.shadows[s].rotation = shadowAngle;
		// }

		// for (var p = 0; p < game.planets.length; p++) {
		// 	var lightAngle = getAngle(game.lightSource.x + game.level.position.x, game.planets[p].position.x,
		// 								game.lightSource.y, game.planets[p].position.y);
		// 	game.planets[p].rotation = lightAngle;
		// }

		// game.ship.rotation = getAngle(game.mouse.position.x, game.ship.position.x, game.mouse.position.y, game.ship.position.y);

		// if (game.ship.state === 'launched') {
		// 	for (var p = 0; p < game.planets.length; p++) {
		// 		var distance = getDistance(game.planets[p], game.ship);

		// 		var planetVector = new Vector(game.ship.position.x, game.planets[p].position.x,
		// 								game.ship.position.y, game.planets[p].position.y);

		// 		var topSpeed = 10;

		// 		var gravitationalForce = (game.gravity * game.ship.mass * game.planets[p].mass)/Math.pow(distance,2);

		// 		if (distance < game.ship.radius + game.planets[p].radius) {
		// 			//game.ship.state = 'colliding';
		// 			/*if (game.planets[p].target == 'true') {
		// 				game.explosion.onComplete = function() { game.win(); }
		// 			}*/

		// 			game.ship.vector.x = -planetVector.x;
		// 			game.ship.vector.y = -planetVector.y;

		// 		}
		// 		else {
		// 			game.ship.vector.x += planetVector.x * gravitationalForce;
		// 			game.ship.vector.y += planetVector.y * gravitationalForce;
		// 		}

		// 		var mouseVector = new Vector(game.ship.position.x, game.mouse.position.x,
		// 									game.ship.position.y, game.mouse.position.y);

		// 		var acceleration = .02;

		// 		if (game.key.isDown(game.key.UP)) {
		// 			game.ship.vector.x += mouseVector.x * acceleration;
		// 			game.ship.vector.y += mouseVector.y * acceleration;
		// 		}
		// 		if (game.key.isDown(game.key.DOWN)) {
		// 			game.ship.vector.x -= mouseVector.x * acceleration;
		// 			game.ship.vector.y -= mouseVector.y * acceleration;
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
		// 	}

		// 	game.ship.velocity.x = game.ship.vector.x;
		// 	game.ship.velocity.y = game.ship.vector.y;
		// 	//console.log(game.ship.velocity.x);
		// }
		// else if (game.ship.state == 'colliding') {
		// 	/*if (!game.explosion.playing) {
		// 		game.ship.visible = false;
		// 		game.ship.velocity.x = 0;
		// 		game.ship.velocity.y = 0;
		// 		game.explosion.position.x = game.ship.position.x;
		// 		game.explosion.position.y = game.ship.position.y;
		// 		game.explosion.visible = true;
		// 		game.explosion.gotoAndPlay(0);
		// 	}*/
			

		// }
		// else {
			
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
		
		// }
	};

})();