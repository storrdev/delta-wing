(function() {
	window.game = {
		width: window.innerWidth,
		height: window.innerHeight,
		state: 'login',
		gravity: 10,
		chunkSize: 10000,
		maxChunkReqTime: 5000,
		layers: {},
		chunks: [],
		planets: [],
		particles: [],
		peers: [],
		peerConnected: false,
		socketConnected: false,

		createScene: function() {
			var scene = new BABYLON.Scene(game.engine);

			game.camera = new BABYLON.ArcRotateCamera('Camera', 1.0, 1.0, 12, BABYLON.Vector3.Zero(), scene);
			game.camera.attachControl(game.canvas, false);

			game.light = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);
			game.light.groundColor = new BABYLON.Color3(0.5, 0, 0.5);

			game.box = BABYLON.Mesh.CreateBox('mesh', 3, scene);
			game.box.showBoundingBox = true;

			game.material = new BABYLON.StandardMaterial('std', scene);
			game.material.diffuseColor = new BABYLON.Color3(0.5, 0, 0.5);

			game.box.material = game.material;

			console.log('scene created');

			return scene;
		},

		init: function() {

			game.canvas = document.getElementById('renderCanvas');
			game.engine = new BABYLON.Engine(game.canvas, true);

			game.scene = game.createScene();

			game.mouse = {
				position: {
					x: 0,
					y: 0
				}
			};

			//game.radar = new Radar();

			window.addEventListener('keyup', function(event) { game.key.onKeyup(event); }, false);
			window.addEventListener('keydown', function(event) { game.key.onKeydown(event); }, false);

			window.addEventListener('mousemove', function(mouseData) {
				// game.mouse.position.x = mouseData.data.originalEvent.x;
				// game.mouse.position.y = mouseData.data.originalEvent.y;
			});

			document.addEventListener('mousewheel', function(e) {
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
				var scaleMin = 0.02;
				var scaleMax = 1.5;
				var scrollMod = 150;

				if ( ( delta < 0 && game.level.scale.x > scaleMin ) || ( delta > 0 && game.level.scale.x < scaleMax ) ) {
					game.level.scale.x += delta / scrollMod;
					game.level.scale.y += delta / scrollMod;
				}
			});

    		game.engine.runRenderLoop(function() {
    			game.scene.render();
    		});
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

			game.state = 'ship';

			// Initialize GUI
			//game.stage.addChild(game.radar);

		});

		// Start the Game
		game.init();
	};

	window.addEventListener('resize', function() {
		game.engine.resize();
	});

	// Disable regular right click action so we can
	// override and show our own menu system.
	window.addEventListener('contextmenu', function(e) {
		e.preventDefault();
		return false;
	});
})();
