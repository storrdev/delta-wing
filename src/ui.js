(function() {
	
	game.component.menu = {

		shape: 'rect',
		x: game.width/2,
		y: game.height/2,

		update: function() {
			this.x = game.width/2;
			this.y = game.height/2;
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

	game.addPlayerToScoreboard = function(player) {
		/*var playerScoreboardDiv = document.createElement('div');
		playerScoreboardDiv.style.width = '100%';
		playerScoreboardDiv.style.display = 'inherit';
		playerScoreboardDiv.style.position = 'relative';
		playerScoreboardDiv.id = player.playerId;
		document.getElementById('teams').appendChild(playerScoreboardDiv);

		var playerNameDiv = document.createElement('div');
		playerNameDiv.id = player.playerId + '.name';
		playerNameDiv.style.position = 'absolute';
		playerNameDiv.style.left = 0;
		playerNameDiv.style.top = '50%';
		document.getElementById(player.playerId).appendChild(playerNameDiv);
		document.getElementById(playerNameDiv.id).innerHTML = player.name;

		var playerScoreDiv = document.createElement('div');
		playerScoreDiv.id = player.playerId + '.deaths';
		playerScoreDiv.style.position = 'absolute';
		playerScoreDiv.style.right = 0;
		playerScoreDiv.style.top = '50%';
		document.getElementById(player.playerId).appendChild(playerScoreDiv);
		document.getElementById(playerScoreDiv.id).innerHTML = '0';*/
	};

	game.ui.click = function() {
		
	}
	
}());