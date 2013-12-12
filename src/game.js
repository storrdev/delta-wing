(function() {

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		                  		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;

	game.start = function() {
		game.entities['login'] = game.createEntity({
			id: 'login',
			x: game.width/2,
			y: game.height/2,
			height: 200,
			width: 500,
			fillColor: 'rgba(0, 0, 0, 0.5)',
			borderColor: 'blue',
			zIndex: 20,
			centered: true
		}, [game.component.entity,
			game.component.menu,
			game.component.drawable]);

		game.entities['loginButton'] = game.createEntity({
			id: 'loginButton',
			offsetY: 40,
			height: 35,
			width: 150,
			fillColor: 'black',
			borderColor: 'green',
			text: 'login',
			action: game.join,
			key: game.key.ENTER,
			state: 'menu',
			zIndex: 21
		}, [game.component.entity,
			game.component.button,
			game.component.drawable]);

		var loginTextBox = document.createElement('input');
		loginTextBox.type = 'text';
		loginTextBox.style.position = 'absolute';
		loginTextBox.style.left = '50%';
		loginTextBox.style.top = '50%';
		loginTextBox.style.width = '250px';
		loginTextBox.style.marginLeft = '-' + parseInt(loginTextBox.style.width)/2 +  'px';
		loginTextBox.style.marginTop = '-35px';
		loginTextBox.style.fontSize = '20px';
		loginTextBox.style.textAlign = 'center';
		loginTextBox.style.borderStyle = 'solid';
		loginTextBox.style.borderWidth = '2px'
		loginTextBox.style.borderColor = 'green';
		loginTextBox.style.backgroundColor = 'black';
		loginTextBox.style.color = 'green';
		loginTextBox.id = 'loginTextBox';
		document.body.appendChild(loginTextBox);
		loginTextBox.focus();

		game.entities['scoreboard'] = game.createEntity({
			id: 'scoreboard',
			x: game.width/2,
			y: game.height/2,
			height: game.height * .7,
			width: 400,
			fillColor: 'rgba(0, 0, 0, 0.5)',
			borderColor: 'blue',
			zIndex: 22,
			resizable: true,
			centered: true
		}, [game.component.entity,
			game.component.menu]);

		game.entities['scoreboardNameHeader'] = game.createEntity({
			id: 'scoreboardNameHeader',
			x: game.width/2 - (game.entities['scoreboard'].width/2) + 50,
			y: game.height/2 - (game.entities['scoreboard'].height/2) + 50,
			label: 'Player',
			color: 'white'
		}, [game.component.entity,
			game.component.label]);

		game.entities['scoreboardKillsHeader'] = game.createEntity({
			id: 'scoreboardKillsHeader',
			x: game.width/2 + (game.entities['scoreboard'].width/2) - 110,
			y: game.height/2 - (game.entities['scoreboard'].height/2) + 50,
			label: 'Kills',
			color: 'white'
		}, [game.component.entity,
			game.component.label]);

		game.entities['scoreboardDeathsHeader'] = game.createEntity({
			id: 'scoreboardDeathsHeader',
			x: game.width/2 + (game.entities['scoreboard'].width/2) - 70,
			y: game.height/2 - (game.entities['scoreboard'].height/2) + 50,
			label: 'Deaths',
			color: 'white'
		}, [game.component.entity,
			game.component.label]);

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
		var zIndex_array = [];
		var entities_bucketed_by_zIndex = {};

		for(var e in game.entities) {
			if (game.entities[e].draw) {
				if (zIndex_array.indexOf(game.entities[e].zIndex) === -1) {
					zIndex_array.push(game.entities[e].zIndex);
					entities_bucketed_by_zIndex[game.entities[e].zIndex] = [];
				}
				entities_bucketed_by_zIndex[game.entities[e].zIndex].push(game.entities[e]);
			}
		}

		game.context.clearRect(0, 0, game.width, game.height);

		for(var z in entities_bucketed_by_zIndex) {
			for (var e = 0; e < entities_bucketed_by_zIndex[z].length; e++) {
				if (entities_bucketed_by_zIndex[z][e].draw) {
					entities_bucketed_by_zIndex[z][e].draw(dt);
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
		game.state = 'in game';

		delete game.entities['login'].draw;
		delete game.entities['loginButton'].draw;

		var userName = document.getElementById('loginTextBox').value;

		document.body.removeChild(document.getElementById('loginTextBox'));

		game.entities[game.clientId].name = userName;
		game.entities[game.clientId].draw = game.component.drawable.draw;
		game.entities[game.clientId].addComponent(game.component.player);

		game.socket.emit('new player', {
			x: game.entities[game.clientId].mapX,
			y: game.entities[game.clientId].mapY,
			name: game.entities[game.clientId].name
		});

		game.addPlayerToScoreboard(game.entities[game.clientId]);
	}
}());
