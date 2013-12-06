(function() {
	
	game.component.menu = {

		shape: 'rect',
		x: game.width/2,
		y: game.height/2,
		urlRequested: false,
		urlLoaded: false,

		update: function() {
			if (this.urlRequested === false) {
				var that = this;
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						var menuDiv = document.createElement('div');
						menuDiv.style.width = that.width + 'px';
						menuDiv.style.height = that.height + 'px';
						menuDiv.style.left = that.x - (that.width/2) + 'px';
						menuDiv.style.top = that.y - (that.height/2) + 'px';
						menuDiv.style.position = 'absolute';
						if (that.display) {
							menuDiv.style.display = that.display;
						}
						menuDiv.id = that.id;
						document.body.appendChild(menuDiv);
						menuDiv.innerHTML = xhr.responseText;
						that.urlLoaded = true;
					}
				}
				xhr.open("GET", this.url, true);
				xhr.send();
				this.urlRequested = true;
			}

			if (this.id == 'scoreboard') {
				if (game.key.isDown(game.key.TAB)) {
					if (!this.draw) {
						this.addComponent(game.component.drawable);
						document.getElementById(this.id).style.display = 'block';
					}
				}
				else {
					delete this.draw;
					if (this.urlLoaded) {
						document.getElementById(this.id).style.display = 'none';
					}
				}
			}
		}
	};

	game.addPlayerToScoreboard = function(player) {
		var playerScoreboardDiv = document.createElement('div');
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
		document.getElementById(playerScoreDiv.id).innerHTML = '0';
	};
	
}());