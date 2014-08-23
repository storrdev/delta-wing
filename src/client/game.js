(function() {

	game.assetsLoaded = function() {

		// Quick change to test github creds for this repo.
			
		game.socket = game.network.connect();
		game.network.setEventHandlers();

	};

	game.loadChunks = function() {
		game.chunkBuffer = 1;

		player = {
			x: 5,
			y: 5
		};

		game.socket.emit('get chunk', {x: 1, y: 1});

		/*for (var x = -game.chunkBuffer; x <= game.chunkBuffer; x++) {
			for (var y = -game.chunkBuffer; y <= game.chunkBuffer; y++) {
				var chunkX = x + player.x;
				var chunkY = y + player.y;
				//console.log(chunkX + ', ' + chunkY);
				game.socket.emit('get chunk', { x: chunkX, y: chunkY });
			}
		}*/
	};

})();