(function() {

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		                  		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
	
	game.start = function() {
	
		//game.entities = {};
		
		game.entities['background'] = game.createEntity({
			image: game.assetManager.getAsset('bg.jpg'),
			screenX: -1600,
			screenY: -400,
			width: game.assetManager.getAsset('map.json').width * game.assetManager.getAsset('map.json').tilewidth,
			height: game.assetManager.getAsset('map.json').height * game.assetManager.getAsset('map.json').tileheight
		}, [game.component.entity,
			game.component.moveable,
			//game.component.drawable,
			game.component.map]);

		game.entities['player'] = game.createEntity({
			image: game.assetManager.getAsset('fighter.png'),
			x: 1000,
			y: 1000,
			angle: 0,
			offsetX: -game.assetManager.getAsset('fighter.png').width/2,
			offsetY: -game.assetManager.getAsset('fighter.png').height/2,
			collision: 'circle'
				
		}, [game.component.entity,
			game.component.moveable,
			game.component.drawable,
			game.component.player]);

		//for (var q = 0; q < game.assetManager.cache.length; q++) {
			console.log('here: ' + game.assetManager.getAsset('lasershot.wav'));
		//}

		game.entities['lasershot'] = game.createEntity({
			buffer: game.assetManager.getAsset('lasershot.wav')
		}, [game.component.entity,
			game.component.sound]);
		
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
						var player = game.entities[e];
						for (var c in game.entities) {
							if (game.entities[c].collision && e !== c) {
								
								if (game.entities[c].collision === 'rect') {
									var rect = game.entities[c];
									if (game.collision.circleRectIntersects(player, rect)) {

										rect.right = rect.x + (rect.width/2);
										rect.left = rect.x - (rect.width/2);
										rect.top = rect.y - (rect.height/2);
										rect.bottom = rect.y + (rect.height/2);

									    if (player.x < rect.left && player.velX > 0) {
									    	// left
									    	player.x -= player.velX;
											player.velX *= -.6;
									    }
									    else if (player.x > rect.right && player.velX < 0) {
									    	// right
									    	player.x -= player.velX;
											player.velX *= -.6;
									    }
									    else {
									    	// top/bottom
									    	player.y -= player.velY;
											player.velY *= -.6;
									    }
		
									}
								}
								else if (game.entities[c].collision === 'circle') {
									if (game.entities[e].distanceTo(game.entities[c].x, game.entities[c].y, game.entities[c].velX, game.entities[e].velY) < (game.entities[e].r + game.entities[c].r)) {

										//Resets the position of the ship outside of the collision area
										game.entities[e].x -= game.entities[e].velX;
										game.entities[e].y -= game.entities[e].velY;

										// Reverses Direction of Ship after collision
										game.entities[e].velX *= -.6;
										game.entities[e].velY *= -.6;

									}
								}
							}
						}
						game.socket.emit('move player', {
							x: game.entities[e].x,
							y: game.entities[e].y,
							velX: game.entities[e].velX,
							velY: game.entities[e].velY,
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
