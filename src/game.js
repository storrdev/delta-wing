(function() {

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		                  		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;

	game.start = function() {

		game.entities['login'] = game.createEntity({
			id: 'login',
			height: 200,
			width: 500,
			fillColor: 'rgba(0, 0, 0, 0.4)',
			borderColor: 'blue',
			url: 'src/login.html'
		}, [game.component.entity,
			game.component.menu,
			game.component.drawable]);

		game.entities['scoreboard'] = game.createEntity({
			id: 'scoreboard',
			height: game.height * .7,
			width: game.height * .7,
			fillColor: 'rgba(0, 0, 0, 0.4)',
			borderColor: 'blue',
			display: 'none',
			url: 'src/scoreboard.html'
		}, [game.component.entity,
			game.component.menu]);

		game.entities['lasershot'] = game.createEntity({
			buffer: game.assetManager.getAsset('lasershot.wav')
		}, [game.component.entity,
			game.component.sound]);
		
		game.socket = game.network.connect();
		game.network.setEventHandlers();
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
	},

	game.join = function(userName) {
		delete game.entities['login'].draw;
		var loginDiv = document.getElementById('login');
		loginDiv.parentNode.removeChild(loginDiv);

		game.entities[game.clientId].name = userName;
		game.entities[game.clientId].draw = game.component.drawable.draw;
		game.entities[game.clientId].addComponent(game.component.player);

		game.socket.emit('new player', {
			x: game.entities[game.clientId].mapX,
			y: game.entities[game.clientId].mapY,
			name: game.entities[game.clientId].name
		});
	}
}());
