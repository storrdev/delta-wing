(function() {

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		                  		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
	
	game.start = function() {
	
		game.entities = {};
		
		game.entities['background'] = game.createEntity({
			image: game.assetManager.getAsset('bg.jpg'),
			screenX: -1600,
			screenY: -400,
			width: game.assetManager.getAsset('map.json').width * game.assetManager.getAsset('map.json').tilewidth,
			height: game.assetManager.getAsset('map.json').height * game.assetManager.getAsset('map.json').tileheight
		}, [game.component.entity,
			game.component.moveable,
			game.component.drawable,
			game.component.map]);

		game.entities['player'] = game.createEntity({
				image: game.assetManager.getAsset('fighter.png'),
				x: 1000,
				y: 1000,
				angle: 0,
				offsetX: -game.assetManager.getAsset('fighter.png').width/2,
				offsetY: -game.assetManager.getAsset('fighter.png').height/2,
				collision: true
				
		}, [game.component.entity,
			game.component.moveable,
			game.component.drawable,
			game.component.player]);

		for (var l = 0; l < game.assetManager.getAsset('map.json').layers.length; l++) {
			var x = 0;
			var y = 0;
			if (game.assetManager.getAsset('map.json').layers[l].type === 'tilelayer') {
				for (var t = 0; t < game.assetManager.getAsset('map.json').layers[l].data.length; t++) {
					if (t % game.assetManager.getAsset('map.json').width == 0 && t != 0) {
						y += game.assetManager.getAsset('map.json').tileheight;
						x = 0;
					}
					if (game.assetManager.getAsset('map.json').layers[l].data[t] != 0) {
						game.entities['tile' + t] = game.createEntity({
							image: game.assetManager.getAsset(game.assetManager.getAsset('map.json').tilesets[0].image),
							x: x,
							y: y,
							screenX: x,
							screenY: y,
							width: game.assetManager.getAsset('map.json').tileheight,
							height: game.assetManager.getAsset('map.json').tilewidth
						}, [game.component.entity,
							game.component.moveable,
							game.component.drawable,
							game.component.tile]);
					}
					x += game.assetManager.getAsset('map.json').tilewidth;
				}
			}
		}
		
		game.socket = game.network.connect();
		game.network.setEventHandlers();

		game.run();
	},
	
	game.run = function() {
		requestAnimationFrame(game.run);
	  	game.update();
		game.draw();
	},
	
	game.update = function() {
		/*var lastRun;
		if (!lastRun) {
			lastRun = new Date().getTime();
		}
		else {
			var delta = (new Date().getTime() - lastRun)/1000;
			lastRun = new Date().getTime();
			fps = 1/delta;
		}*/

		for(var e in game.entities) {
			if (game.entities.hasOwnProperty(e)) {
				if (game.entities[e].update) {
					game.entities[e].update();
					if (e === 'player') {
						for (var c in game.entities) {
							if (game.entities[c].collision === true && e !== c) {
								if (game.entities[e].distanceTo(game.entities[c].x, game.entities[c].y, game.entities[c].oldDeltaX, game.entities[e].oldDeltaY) < (game.entities[e].r + game.entities[c].r)) {

									//Resets the position of the ship outside of the collision area
									game.entities[e].x -= game.entities[e].oldDeltaX;
									game.entities[e].y -= game.entities[e].oldDeltaY;

									// Reverses Direction of Ship after collision
									game.entities[e].oldDeltaX *= -.6;
									game.entities[e].oldDeltaY *= -.6;

								}
							}
						}
						game.socket.emit('move player', {
							x: game.entities[e].x,
							y: game.entities[e].y,
							oldDeltaX: game.entities[e].oldDeltaX,
							oldDeltaY: game.entities[e].oldDeltaY,
							angle: game.entities[e].angle
						});
					}
				}
			}
		}
	},
	
	game.draw = function() {
		game.context.clearRect(0, 0, game.width, game.height);

		for(var e in game.entities) {
			if (game.entities.hasOwnProperty(e)) {
				if (game.entities[e].draw) {
					game.entities[e].draw();
				}
			}
		}
	},

	game.getAngle = function(x1, x2, y1, y2) {
		var angle;
		
		if (x1 == x2) {
			if (y1 < y2) { return 0; }
			else { return 180 * (Math.PI/180); }
		}
		else {
			angle = Math.atan((y2-y1)/(x2-x1));
			if (x1 < x2) {
				return angle - 90 * (Math.PI/180);
			}
			else {
				return angle + 90 * (Math.PI/180);
			}
		}
	}
}());
