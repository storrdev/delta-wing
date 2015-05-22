(function() {

	game.assetsLoaded = function() {
		// Connect to server
		game.socket = game.network.connect();
		game.network.setSocketEventHandlers();

		game.backgroundTexture = new PIXI.Texture.fromImage('background.png');
		game.background = new PIXI.extras.TilingSprite(game.backgroundTexture, game.width, game.height);
		game.background.position.x = 0;
		game.background.position.y = 0;
		game.background.tilePosition.x = 0;
		game.background.tilePosition.y = 0;
		game.stage.addChild(game.background);

		game.midgroundTexture = new PIXI.Texture.fromImage('midground.png');
		game.midground = new PIXI.extras.TilingSprite(game.midgroundTexture, game.width, game.height);
		game.midground.position.x = 0;
		game.midground.position.y = 0;
		game.midground.tilePosition.x = 0;
		game.midground.tilePosition.y = 0;
		game.stage.addChild(game.midground);

		game.stage.addChild(game.level);
		game.level.addChild(game.layers.particles);

		game.ship = new Ship(0, 0, 'fighter.png', true);

		game.level.addChild(game.ship);

		game.run();
		document.getElementsByTagName('canvas')[0].style.opacity = "1";
	};

	game.loadSurroundingChunks = function(x, y) {
		game.chunkBuffer = 1;

		for (var xx = -game.chunkBuffer; xx <= game.chunkBuffer; xx++) {
			for (var yy = -game.chunkBuffer; yy <= game.chunkBuffer; yy++) {
				var chunkX = xx + x;
				var chunkY = yy + y;

				var coords = chunkX + ',' + chunkY;
				if ( typeof game.getChunk(chunkX, chunkY) == 'undefined') {
					game.socket.emit( 'get chunk', { x: chunkX, y: chunkY } );
					console.log('requesting chunk: ' + coords);

					// create the chunk so that it doesn't request it again
					// until a certain amount of time has passed.
					// assign a time it was requested and then check it on
					// an else statement of this IF statement, and if enough
					// time has passed since it was requested, we request it
					// again.

					// var temp_chunk = new Chunk();
					// Chunk.coords.x 
				}
			}
		}
	};

	game.getChunk = function(x, y) {
		game.chunks.forEach(function(chunk, index) {
			if (chunk.coords.x == x && chunk.coords.y == y) {
				//console.log('getChunk chunk found for coords: ' + x + ', ' + y);
				return chunk;
			}
		});
	};

	game.run = function() {
		requestAnimationFrame(game.run);
		game.update();
		game.renderer.render(game.stage);
	};

	game.update = function() {

		game.ship.update();

		game.particles.forEach(function(particle, index, object){
			if (particle.alpha <= 0) {
				game.layers.particles.removeChild( object[index] );
				object.splice(index, 1);
			}
			particle.update();
		});
		
		if ( game.particles.length > 0 ) {
			//console.log(game.particles[0].x);
		}

		game.background.tilePosition.x -= (game.level.scale.x * 0.2) * game.ship.vector.x;
		game.midground.tilePosition.x -= (game.level.scale.x * 0.4) * game.ship.vector.x;
		game.background.tilePosition.y -= (game.level.scale.x * 0.2) * game.ship.vector.y;
		game.midground.tilePosition.y -= (game.level.scale.x * 0.4) * game.ship.vector.y;

		game.level.x = ( window.innerWidth/2 ) - ( game.ship.x * game.level.scale.x );
		game.level.y = ( window.innerHeight/2 ) - ( game.ship.y * game.level.scale.y );
		// game.layers.particles.x = ( window.innerWidth/2 ) - game.ship.x;
		// game.layers.particles.y = ( window.innerHeight/2 ) - game.ship.y;
	};

})();