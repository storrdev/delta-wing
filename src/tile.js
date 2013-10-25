(function() {
	
	game.component.tile = {
		update: function () {
			if (game.entities['player'].x < game.width/2) {
				this.screenX = this.x;
			}
			else if (game.entities['player'].x < (game.entities['background'].width - game.width/2)) {
				this.screenX = this.x - game.entities['player'].x + game.entities['player'].oldDeltaX + (game.width/2);
			}

			if (game.entities['player'].y < game.height/2) {
				this.screenY = this.y;
			}
			else if (game.entities['player'].y < (game.entities['background'].height - game.height/2)) {
				this.screenY = this.y - game.entities['player'].y + game.entities['player'].oldDeltaY + (game.height/2);
			}
		}
	}

}());