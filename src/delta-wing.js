(function() {
	window.game = {
		fps: 60,
		width: window.innerWidth,
		height: window.innerHeight,
	
		load: function() {

			game.canvas = document.createElement("canvas");
			game.canvas.width = game.width;
			game.canvas.height = game.height;
			game.context = game.canvas.getContext("2d");

			document.body.appendChild(game.canvas);

			window.addEventListener('resize', game.resize, false);
			window.addEventListener('keyup', function(event) { game.key.onKeyup(event); }, false);
			window.addEventListener('keydown', function(event) { game.key.onKeydown(event); }, false);
			game.canvas.addEventListener('mousemove', game.move, false);
			game.canvas.addEventListener('click', game.click, false);
			//game.canvas.addEventListener('click', click, false);

			// Display FPS on screen
			game.stats = new Stats();
			game.stats.setMode(0); // 0: fps, 1: ms

			game.stats.domElement.style.position = 'absolute';
			game.stats.domElement.style.left = '0px';
			game.stats.domElement.style.top = '0px';

			document.body.appendChild( game.stats.domElement );

			game.entities = {};
			
			// Add way to read all assets required from a data file, txt or something.
			game.assetManager.queueDownload('/assets/audio/effects/lasershot.wav');
			game.assetManager.queueDownload('/assets/sprites/fighter.png');
			game.assetManager.queueDownload('/assets/sprites/projectile.png');
			game.assetManager.queueDownload('/assets/maps/tiledMap/map.json');
			//game.assetManager.downloadAll(function () { game.start(); });
			game.assetManager.downloadAll(function() {
				//console.log('testing: ' + game.assetManager.getAsset('map.json').tilesets[0].image);
				game.assetManager.createMap(game.assetManager.getAsset('map.json'), game.start);
			});
		},
		
		move: function(e) {
			if(e.offsetX) {
				game.mouseX = e.offsetX;
				game.mouseY = e.offsetY;
			}
			else if(e.layerX) {
				game.mouseX = e.layerX;
				game.mouseY = e.layerY;
			}
			else if(e.clientX) {
				game.mouseX = e.clientX;
				game.mouseY = e.clientY;
			}
		},

		click: function() {
			game.entities['lasershot'].play();

			var vX = game.mouseX - game.entities['player'].screenX;
			var vY = game.mouseY - game.entities['player'].screenY;
			var speed = 30;
			
			var mag = Math.sqrt(vX * vX + vY * vY);
			
			vX = vX / mag * speed;
			vY = vY / mag * speed;
			
			vX = vX + game.entities['player'].velX;
			vY = vY + game.entities['player'].velY;

			game.socket.emit('new projectile', {x: game.entities['player'].x, y: game.entities['player'].y, velX: vX, velY: vY});
		},

		resize: function() {
			console.log('Window resized.');
			game.width = window.innerWidth;
			game.height = window.innerHeight;
			game.canvas.width = window.innerWidth;
			game.canvas.height = window.innerHeight;
		}
	};

	game.key = {
		_pressed: {},

		LEFT: 65,
		UP: 87,
		RIGHT: 68,
		DOWN: 83,

		isDown: function(keyCode) {
			return this._pressed[keyCode];
		},

		onKeydown: function(event) {
			this._pressed[event.keyCode] = true;
		},

		onKeyup: function(event) {
			delete this._pressed[event.keyCode];
		}
	};
}());
