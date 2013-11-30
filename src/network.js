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
		},

		onSocketConnected: function() {
			console.log('Connected to socket server');
			//socket.emit('new player', {x: game.entities['player'].mapX, y: game.entities['player'].mapY});
		},

		onClientId: function(data) {
			game.entities['player'].playerId = data.id;
			console.log('network id acquired: ' + game.entities['player'].playerId);
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

			console.log('Name: ' + game.entities[data.id].name);
		},

		onMovePlayer: function(data) {
			game.entities[data.id].screenX = data.x - game.entities['player'].x + game.entities['player'].screenX;
			game.entities[data.id].screenY = data.y - game.entities['player'].y + game.entities['player'].screenY;
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
				damage: 1
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
		}

	}

}());