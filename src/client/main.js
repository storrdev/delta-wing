(function() {
	window.game = {
		width: window.innerWidth,
		height: window.innerHeight,
		state: 'menu',
		gravity: 10,
		layers: {},
		chunks: [],
		planets: [],
		particles: [],
		peers: [],
		peerConnected: false,
		socketConnected: false,

		init: function() {

			game.loader = new PIXI.AssetLoader([
				"Spritesheet.json",
				"background.png"
			]);

			game.loader.onComplete = game.assetsLoaded;

			game.mouse = {
				position: {
					x: 0,
					y: 0
				}
			};

			var interactive = true;
			game.stage = new PIXI.Stage(0xffffff, interactive);

			window.addEventListener('keyup', function(event) { game.key.onKeyup(event); }, false);
			window.addEventListener('keydown', function(event) { game.key.onKeydown(event); }, false);

			game.stage.mousemove = function(data) {
				var newPosition = data.getLocalPosition(this);
				//console.log(newPosition.x + ', ' + newPosition.y);
				game.mouse.position.x = newPosition.x;
				game.mouse.position.y = newPosition.y;
			};

			game.stage.click = function(data) {
				if (game.ship.state == 'ready') {
					game.aimLine.visible = false;
					game.ship.state = 'launched';

					game.ship.thrust = getDistance(game.mouse, game.aimLine) / 50;

					var vector = new Vector(game.aimLine.position.x, game.mouse.position.x,
											game.aimLine.position.y, game.mouse.position.y);

					game.ship.velocity.x = vector.x * game.ship.thrust;
					game.ship.velocity.y = vector.y * game.ship.thrust;

					mag = Math.sqrt(this.deltaX * this.deltaX + this.deltaY * this.deltaY);
				}
			};

			game.stage.mousedown = function(data) {
				if (game.ship.state == 'idle') {
					game.dragging = true;
				}
				else if (game.ship.state == 'launched') {
					//game.ship.rocketThrust = 10;
				}
			};

			game.stage.mouseup = function(data) {
				if (game.ship.state == 'idle') {
					game.dragging = false;
				}
				else if (game.ship.state == 'launched') {
					//game.ship.rocketThrust = 0;
				}
			};

			document.addEventListener('mousewheel', function(e) {
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
				//console.log(delta);
				game.level.scale.x += delta / 100;
				game.level.scale.y += delta / 100;
				//console.log(game.level.scale);
			});

			// create a renderer instance.
    		game.renderer = PIXI.autoDetectRenderer(game.width, game.height);

    		// add the renderer view element to the DOM
    		document.body.appendChild(game.renderer.view);

    		game.layers.particles = new PIXI.DisplayObjectContainer();
    		game.layers.particles.x = 0;
    		game.layers.particles.y = 0;

    		game.level = new PIXI.DisplayObjectContainer();
    		game.level.x = 0;
    		game.level.y = 0;
    		//game.stage.addChild(game.level);

    		game.loader.load();
		}
	};

	game.key = {
		_pressed: {},

		LEFT: 65,
		UP: 87,
		RIGHT: 68,
		DOWN: 83,
		TAB: 9,
		ENTER: 13,

		isDown: function(keyCode) {
			return this._pressed[keyCode];
		},

		onKeydown: function(event) {
			this._pressed[event.keyCode] = true;
			if (event.keyCode == game.key.TAB) {
				event.preventDefault();
				return false;
			}
		},

		onKeyup: function(event) {
			delete this._pressed[event.keyCode];
		}
	};

	window.onload = function() {

		document.getElementById('userName').focus();

		// Initialize login form functions
		document.getElementById('login-form').addEventListener('submit', function(e) {
			e.preventDefault();
			document.getElementById('login-box').style.display = 'none';

			/*
			*	This is where the 'new player' message should be sent
			*	via websockets to the server.
			*/

			var userName = document.getElementById('userName').value;

			// game.socket.emit('new player', {
			// 	name: userName,
			// 	id: game.clientId,
			// 	peerId: game.network.peer.id
			// });

			game.ship.state = 'launched';

		});

		// Start the Game
		game.init();
	};
})();
