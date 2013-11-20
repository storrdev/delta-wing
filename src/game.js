(function() {

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		                  		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
	
	game.start = function() {
	
		//game.entities = {};
		
		/*game.entities['background'] = game.createEntity({
			image: game.assetManager.getAsset('bg.jpg'),
			screenX: -1600,
			screenY: -400,
			width: game.assetManager.getAsset('map.json').width * game.assetManager.getAsset('map.json').tilewidth,
			height: game.assetManager.getAsset('map.json').height * game.assetManager.getAsset('map.json').tileheight
		}, [game.component.entity,
			game.component.moveable,
			//game.component.drawable,
			game.component.map]);*/

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

		//console.log('this: ' + game.entities['player'].draw);

		game.entities['lasershot'] = game.createEntity({
			buffer: game.assetManager.getAsset('lasershot.wav')
		}, [game.component.entity,
			game.component.sound]);
		
		game.socket = game.network.connect();
		game.network.setEventHandlers();

		//game.run();
		setInterval(game.update, 1000/70);
	},
	
	game.run = function() {
	  		game.draw();
	  		game.update();
	},

	game.update = function() {
		for(var e in game.entities) {
			if (game.entities.hasOwnProperty(e) && game.entities[e].update) {
				game.entities[e].update();
			}
		}
		game.stats.begin();
		requestAnimationFrame(game.draw);
	}
	
	game.draw = function() {
		game.context.clearRect(0, 0, game.width, game.height);

		for(var e in game.entities) {
			if (game.entities.hasOwnProperty(e)) {
				if (game.entities[e].draw) {
					game.entities[e].draw();
				}
			}
		}
		game.stats.end();
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
