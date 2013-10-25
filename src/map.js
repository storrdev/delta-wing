(function() {

	game.component.map = {

		update: function() {
			if (game.entities['player'].x < game.width/2) {		// Left side of map
				this.screenX = 0;
				game.entities['player'].screenX = game.entities['player'].x;
			}
			else if (game.entities['player'].x > (this.width - game.width/2)) {		// Right side of map
				this.screenX = -(this.width - game.width);
				game.entities['player'].screenX = game.entities['player'].x - (this.width - game.width);
			}
			else {		// Center (width) of map
				this.screenX = -(game.entities['player'].x - game.width/2);
			}
			
			if (game.entities['player'].y < game.height/2) {	// Top of map
				this.screenY = 0;
				game.entities['player'].screenY = game.entities['player'].y;
			}
			else if (game.entities['player'].y > (this.height - game.height/2)) {		// Bottom of map
				this.screenY = -(this.height - game.height);
				game.entities['player'].screenY = game.entities['player'].y - (this.height - game.height);
			}
			else {		// Center (height) of map
				this.screenY = -(game.entities['player'].y - game.height/2);
			}
		}
	}

}());
