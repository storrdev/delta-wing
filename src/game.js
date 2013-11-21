(function() {

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		                  		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
	
	game.start = function() {

		game.entities['player'] = game.createEntity({
			image: game.assetManager.getAsset('fighter.png'),
			x: 1000,
			y: 1000,
			angle: 0,
			offsetX: -game.assetManager.getAsset('fighter.png').width/2,
			offsetY: -game.assetManager.getAsset('fighter.png').height/2,
			collision: 'circle',
				
		}, [game.component.entity,
			game.component.moveable,
			game.component.drawable,
			game.component.player,
			game.component.damageable]);

		game.entities['lasershot'] = game.createEntity({
			buffer: game.assetManager.getAsset('lasershot.wav')
		}, [game.component.entity,
			game.component.sound]);
		
		game.socket = game.network.connect();
		game.network.setEventHandlers();

		game.lastUpdate = Date.now();
		game.run();
	},
	
	game.run = function() {
		//game.stats.begin();
		var now = Date.now();
		game.dt = now - game.lastUpdate;
		game.lastUpdate = now;
		//console.log(dt);
	  	game.draw(game.dt);
	  	game.update(game.dt);
	  	requestAnimationFrame(game.run);
		//game.stats.end();
	},

	game.update = function(dt) {
		for(var e in game.entities) {
			if (game.entities.hasOwnProperty(e) && game.entities[e].update) {
				game.entities[e].update(dt);
			}
		}
	}
	
	game.draw = function(dt) {
		game.context.clearRect(0, 0, game.width, game.height);

		for(var e in game.entities) {
			if (game.entities.hasOwnProperty(e)) {
				if (game.entities[e].draw) {
					game.entities[e].draw(dt);
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
