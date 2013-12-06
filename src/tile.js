(function() {
	
	game.component.tile = {
		update: function () {
			if (game.entities[game.clientId].x < game.width/2) {
				this.screenX = this.x;
			}
			else if (game.entities[game.clientId].x < (game.entities['background'].width - game.width/2)) {
				this.screenX = this.x - game.entities[game.clientId].x + game.entities[game.clientId].oldDeltaX + (game.width/2);
			}

			if (game.entities[game.clientId].y < game.height/2) {
				this.screenY = this.y;
			}
			else if (game.entities[game.clientId].y < (game.entities['background'].height - game.height/2)) {
				this.screenY = this.y - game.entities[game.clientId].y + game.entities[game.clientId].oldDeltaY + (game.height/2);
			}
		}
	}

}());