(function() {

	var socket;

	game.network = {

		peer: null,

		/*
		*	Makes websocket connection to node server using socket.io
		*	Makes connection to PeerJS
		*/

		connect: function() {
			socket = io.connect(window.location.href);
			game.network.peer = new Peer( { key: 'ownnvv2opm5z5mi' } );
			//console.log(this.peer);
			return socket;
		},

		/*
		*	Sets up all the network events including:
		*	socket.io events
		*/

		setEventHandlers: function() {
			socket.on('connect', this.onSocketConnected);
			socket.on('client id', this.onClientId);
			socket.on('disconnect', this.onSocketDisconnect);
			socket.on('new player', this.onNewPlayer);
			socket.on('move player', this.onMovePlayer);
			socket.on('remove player', this.onRemovePlayer);
			socket.on('new projectile', this.onNewProjectile);
			socket.on('remove projectile', this.onRemoveProjectile);
			socket.on('deaths', this.onDeaths);
			socket.on('kills', this.onKills);
			socket.on('chunk', this.onChunk);
			socket.on('spawn', this.onSpawn);
			//this.peer.on('connection', this.onPeerConnection);
			this.peer.on('open', this.onPeerOpen);
		},

		onPeerOpen: function(peerid) {
			console.log('this is my id ' + peerid);
			game.peerId = peerid;

			// game.peerConnected = true;

			// if (game.socketConnected === true) {
			// 	game.socket.emit('peerId', { peerId: game.peerid });
			// 	console.log('sent peerid via onPeerOpen');
			// }
		},

		onPeerConnection: function(conn) {
			conn.on('data', function(data) {
				console.log(data);
			});
		},

		onSpawn: function(data) {
			//console.log('spawn coordinates recieved at (' + data.x + ', ' + data.y + ')');
			//console.log('calling loadSurroundingChunks');
			game.loadSurroundingChunks(data.x, data.y);
		},

		onChunk: function(data) {
			//console.log('chunk recieved');
			var coords = data.x + ',' + data.y;

			//console.log('chunk coordinates: ' + coords);
			//console.log(data.json);

			game.chunks[coords] = data.json;

			//console.log('chunk layers: ' + data.json.layers.length);

			for (var c = 0; c < data.json.layers.length; c++) {
				//console.log('chunk objects: ' + data.json.layers[c].objects.length);
				for (var o = 0; o < data.json.layers[c].objects.length; o++) {
					var yMultiplier = data.json.height * data.json.tileheight * data.json.y;
					var xMultiplier = data.json.width * data.json.tilewidth * data.json.x;
					//console.log(data.json.layers[c].objects[0]);
					var planet = new Planet(data.json.layers[c].objects[o]);
					//console.log('new planet created');
					//console.log(game.planets);
					game.planets.push(planet);
					//console.log('new planet pushed into planet array');
					game.level.addChild(planet);
					//console.log('new planet added to game.level');
				}
			}
		},

		onSocketConnected: function() {
			//console.log('Connected to socket server, requesting client id');
			game.socket.emit('request id', {});

			// game.socketConnected = true;

			// if (game.peerConnected === true) {
			// 	game.socket.emit('peerId', { peerId: game.peerid });
			// 	console.log('sent peerid via onSocketConnected');
			// }

			//game.loadChunks();
		},

		onClientId: function(data) {
			game.clientId = data.id;
			//console.log('network id acquired: ' + game.clientId);

			/*game.entities[game.clientId] = game.createEntity({
				playerId: game.clientId,
				image: game.loader.getAsset('fighter.png'),
				x: game.entities['map'].width/2,
				y: game.entities['map'].height/2,
				screenX: game.width/2,
				screenY: game.height/2,
				angle: 0,
				offsetX: -game.assetManager.getAsset('fighter.png').width/2,
				offsetY: -game.assetManager.getAsset('fighter.png').height/2,
				collision: 'circle',
				zIndex: 2
			}, [game.component.entity,
				game.component.moveable,
				game.component.damageable]);*/

			console.log('requesting already connected players.');
			game.socket.emit('get clients', {});
			//console.log('requesting spawn coordinates');
			game.socket.emit('get spawn', {});
			game.lastUpdate = Date.now();
			//game.run();
		},

		onSocketDisconnect: function() {
			//console.log('Disconnected from socket server');
		},

		onNewPlayer: function(data) {
			console.log(data.name + ' connected.');
			console.log('peerid: ' + data.peerId);

			// Creates webrtc connection between two clients
			var conn = game.network.peer.connect(data.peerId);

			conn.on('open', function() {
				conn.send('hi!');
			});

			game.peers.push(conn);

			// game.entities[data.id] = game.createEntity({
			// 	playerId: data.id,
			// 	name: data.name,
			// 	image: game.assetManager.getAsset('fighter.png'),
			// 	x: data.x,
			// 	y: data.y,
			// 	r: 20,
			// 	angle: 0,
			// 	offsetX: -game.assetManager.getAsset('fighter.png').width/2,
			// 	offsetY: -game.assetManager.getAsset('fighter.png').height/2,
			// 	width: game.assetManager.getAsset('fighter.png').width,
			// 	height: game.assetManager.getAsset('fighter.png').height,
			// 	collision: 'circle',
			// 	zIndex: 2,
			// 	kills: data.kills,
			// 	deaths: data.deaths
			// }, [game.component.entity,
			// 	game.component.moveable,
			// 	game.component.drawable]);

			// game.nPlayers++;

			// game.addPlayerToScoreboard(game.entities[data.id]);
		},

		onMovePlayer: function(data) {
			game.entities[data.id].screenX = data.x - game.entities[game.clientId].x + game.entities[game.clientId].screenX;
			game.entities[data.id].screenY = data.y - game.entities[game.clientId].y + game.entities[game.clientId].screenY;
			game.entities[data.id].x = data.x;
			game.entities[data.id].y = data.y;
			game.entities[data.id].velX = data.velX;
			game.entities[data.id].velY = data.velY;
			game.entities[data.id].angle = data.angle;
		},

		onRemovePlayer: function(data) {
			if (!game.entities[data.id]) {
				//console.log('Player not found: ' + data.id);
				return;
			}

			game.removePlayerFromScoreboard(game.entities[data.id]);
			delete game.entities[data.id];
			game.nPlayers--;
			//console.log('player has been disconnected: ' + data.id);
		},

		onNewProjectile: function(data) {
			game.entities['Projectile' + data.id] = game.createEntity({
				id: data.id,
				image: game.assetManager.getAsset('projectile.png'),
				playerId: data.playerId,
				x: data.x,
				y: data.y,
				velX: data.velX,
				velY: data.velY,
				collision: 'circle',
				dp: 1,
				zIndex: 1
			}, [game.component.entity,
				game.component.moveable,
				game.component.drawable,
				game.component.projectile]);
		},

		onRemoveProjectile: function(data) {
			var removeProjectile = projectileById(data.id);

			if (!removeProjectile) {
				//console.log('Projectile not found: ' + this.id);
			}

			game.projectiles.splice(game.projectiles.indexOf(removeProjectile));
		},

		onDeaths: function(data) {
			game.entities[data.id].deaths = data.deaths;
			game.entities[data.id + '.deathsLabel'].label = game.entities[data.id].deaths;
		},

		onKills: function(data) {
			game.entities[data.id].kills = data.kills;
			game.entities[data.id + '.killsLabel'].label = game.entities[data.id].kills;
		}

	};

}());
