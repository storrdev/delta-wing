(function() {

	var socket;

	game.network = {

		connect: function() {
			socket = io.connect(window.location.href);
			return socket;
		},
	
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
		},

		onSocketConnected: function() {
			console.log('Connected to socket server');
			game.socket.emit('request id', {});
		},

		onClientId: function(data) {
			game.clientId = data.id;
			console.log('network id acquired: ' + game.clientId);

			game.entities[game.clientId] = game.createEntity({
				image: game.assetManager.getAsset('fighter.png'),
				x: game.entities['map'].width/2,
				y: game.entities['map'].height/2,
				screenX: game.width/2,
				screenY: game.height/2,
				angle: 0,
				offsetX: -game.assetManager.getAsset('fighter.png').width/2,
				offsetY: -game.assetManager.getAsset('fighter.png').height/2,
				collision: 'circle'
			}, [game.component.entity,
				game.component.moveable,
				game.component.damageable]);

			game.socket.emit('get clients', {});
			game.lastUpdate = Date.now();
			game.run();
		},

		onSocketDisconnect: function() {
			console.log('Disconnected from socket server');
		},

		onNewPlayer: function(data) {
			console.log('New player connected: ' + data.id + ':' + data.name);

			game.entities[data.id] = game.createEntity({
				playerId: data.id,
				name: data.name,
				image: game.assetManager.getAsset('fighter.png'),
				x: data.x,
				y: data.y,
				r: 20,
				angle: 0,
				offsetX: -game.assetManager.getAsset('fighter.png').width/2,
				offsetY: -game.assetManager.getAsset('fighter.png').height/2,
				width: game.assetManager.getAsset('fighter.png').width,
				height: game.assetManager.getAsset('fighter.png').height,
				collision: 'circle'
				
			}, [game.component.entity,
				game.component.moveable,
				game.component.drawable]);

			game.addPlayerToScoreboard(game.entities[data.id]);

			console.log('Name: ' + game.entities[data.id].name);
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
				console.log('Player not found: ' + data.id);
				return;
			}
			
			delete game.entities[data.id];
			console.log('player has been disconnected: ' + data.id);
		},

		onNewProjectile: function(data) {
			//var newProjectile = new Projectile(data.id, data.playerId, data.x, data.y, data.deltaX, data.deltaY);
			//game.projectiles.push(newProjectile);
			//console.log('projectile player id: ' + data.playerId + ' projectile id: ' + data.id);
			game.entities['Projectile' + data.id] = game.createEntity({
				id: data.id,
				image: game.assetManager.getAsset('projectile.png'),
				playerId: data.playerId,
				x: data.x,
				y: data.y,
				velX: data.velX,
				velY: data.velY,
				collision: 'circle',
				dp: 1
			}, [game.component.entity,
				game.component.moveable,
				game.component.drawable,
				game.component.projectile]);
		},

		onRemoveProjectile: function(data) {
			var removeProjectile = projectileById(data.id);

			if (!removeProjectile) {
				console.log('Projectile not found: ' + this.id);
			};

			game.projectiles.splice(game.projectiles.indexOf(removeProjectile));
		},

		onDeaths: function(data) {
			console.log(data.id);
			game.entities[data.id].deaths = data.deaths;
			console.log(data.id + ' has died ' + game.entities[data.id].deaths + ' times');
		}

	}

}());