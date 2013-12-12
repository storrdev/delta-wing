(function() {
	
	game.component.ui = {
		update: function() {
			if (type == 'window') {

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
				this.width = game.width * .7;
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

	};

	game.addPlayerToScoreboard = function(player) {
		game.entities[player.playerId + '.scorelabel'] = game.createEntity({
			id: player.playerId + '.scorelabel',
			x: game.width/2 - (game.entities['scoreboard'].width/2) + 50,
			y: game.height/2 - (game.entities['scoreboard'].height/2) + 30,
			color: 'green',
			label: player.name
		}, [game.component.entity,
			game.component.drawable]);
	};
	
}());