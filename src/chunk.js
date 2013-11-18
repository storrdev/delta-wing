(function() {
	game.component.chunk = {
		screenX: 0,
		screenY: 0,

		update: function() {
			
			if (this.distanceTo(game.entities['player'].x - this.width/2, game.entities['player'].y - this.height/2) < Math.sqrt(Math.pow(game.width, 2) + Math.pow(game.height, 2))) {
				this.draw = game.component.drawable.draw;
				
				if (game.entities['player'].x < game.width/2) {		// Left side of map
					this.screenX = this.x;
				}
				else if (game.entities['player'].x > (game.entities['map'].width - game.width/2)) {		// Right side of map
					this.screenX = this.x - game.entities['map'].width + game.width;
				}
				else {		// Center (width) of map
					this.screenX = -(game.entities['player'].x - this.x) + game.width/2;
				}

				if (game.entities['player'].y < game.height/2) {	// Top of map
					this.screenY = this.y;
				}
				else if (game.entities['player'].y > (game.entities['map'].height - game.height/2)) {		// Bottom of map
					this.screenY = this.y - game.entities['map'].height + game.height;
				}
				else {		// Center (height) of map
					this.screenY = -(game.entities['player'].y - this.y) + game.height/2;
				}

			}
			else {
				delete this.draw;
			}
		}
	}
}());