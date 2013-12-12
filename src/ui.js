(function() {

	game.scoreboardPlayers = [];
	
	game.component.ui = {
		update: function() {
			if (type == 'window') {
				this.shape = 'rect';
			}
			else if (type == 'button') {

			}
			else if (type == 'label') {

			}

			if (this.centered) {
				this.x = game.width/2;
				this.y = game.height/2;
			}
			if (this.resizable) {
				this.height = game.height * .7;
				this.width = game.width * .7;
			}
		}
	}

	game.component.menu = {

		shape: 'rect',

		update: function() {
			if (this.centered) {
				this.x = game.width/2;
				this.y = game.height/2;
			}
			if (this.resizable) {
				this.height = game.height * .7;
				//this.width = game.width * .5;
			}
			if (this.id == 'scoreboard') {
				if (game.key.isDown(game.key.TAB)) {
					if (!this.draw) {
						this.addComponent(game.component.drawable);
					}
				}
				else {
					delete this.draw;
				}
			}
		}
	};

	game.component.button = {

		shape: 'rect',
		x: game.width/2,
		y: game.height/2,

		update: function() {
			this.x = game.width/2;
			this.y = game.height/2;

			if (game.key.isDown(this.key) && game.state == this.state) {
				this.action();
			}
		}

	};

	game.component.label = {
		update: function() {
			if (this.centered) {
				this.x = game.width/2;
				this.y = game.height/2;
			}
			if (this.resizable) {
				this.x = game.width/2 - (game.entities['scoreboard'].width/2) + 50;
				this.y = (game.height/2 - (game.entities['scoreboard'].height/2) + 80) + (game.scoreboardPlayers.indexOf(this.player) * 20);
			}
			if (game.key.isDown(game.key.TAB)) {
				if (!this.draw) {
					this.addComponent(game.component.drawable);
				}
			}
			else {
				delete this.draw;
			}
		}
	};

	game.addPlayerToScoreboard = function(player) {
		
		game.scoreboardPlayers.push(player);

		game.entities[player.playerId + '.scorelabel'] = game.createEntity({
			id: player.playerId + '.scorelabel',
			x: game.width/2 - (game.entities['scoreboard'].width/2) + 50,
			y: (game.height/2 - (game.entities['scoreboard'].height/2) + 80) + (game.scoreboardPlayers.indexOf(player) * 20),
			color: 'green',
			align: 'left',
			label: player.name,
			resizable: true,
			player: player,
			zIndex: 23
		}, [game.component.entity,
			game.component.label]);

		game.entities[player.playerId + '.killsLabel'] = game.createEntity({
			id: player.playerId + '.killsLabel',
			x: game.width/2 + (game.entities['scoreboard'].width/2) - 110,
			y: (game.height/2 - (game.entities['scoreboard'].height/2) + 80) + (game.scoreboardPlayers.indexOf(player) * 20),
			color: 'green',
			align: 'left',
			label: player.kills.toString(),
			//resizable: true,
			zIndex: 23
		}, [game.component.entity,
			game.component.label]);

		game.entities[player.playerId + '.deathsLabel'] = game.createEntity({
			id: player.playerId + '.deathsLabel',
			x: game.width/2 + (game.entities['scoreboard'].width/2) - 70,
			y: (game.height/2 - (game.entities['scoreboard'].height/2) + 80) + (game.scoreboardPlayers.indexOf(player) * 20),
			color: 'red',
			align: 'left',
			label: player.deaths.toString(),
			//resizable: true,
			zIndex: 23
		}, [game.component.entity,
			game.component.label]);
	};

	game.removePlayerFromScoreboard = function(player) {
		var playerIndex = game.scoreboardPlayers.indexOf(player);
		if (playerIndex > -1) {
			game.scoreboardPlayers.splice(playerIndex, 1);
		}
		delete game.entities[player.playerId + '.scorelabel'];
		delete game.entities[player.playerId + '.killsLabel'];
		delete game.entities[player.playerId + '.deathsLabel'];
	};
	
}());