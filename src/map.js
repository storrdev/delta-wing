(function() {

	game.component.map = {

		update: function() {
			if (game.entities[game.clientId].x < game.width/2) {		// Left side of map
				this.screenX = 0;
				game.entities[game.clientId].screenX = game.entities[game.clientId].x;
			}
			else if (game.entities[game.clientId].x > (this.width - game.width/2)) {		// Right side of map
				this.screenX = -(this.width - game.width);
				game.entities[game.clientId].screenX = game.entities[game.clientId].x - (this.width - game.width);
			}
			else {		// Center (width) of map
				this.screenX = -(game.entities[game.clientId].x - game.width/2);
			}
			
			if (game.entities[game.clientId].y < game.height/2) {	// Top of map
				this.screenY = 0;
				game.entities[game.clientId].screenY = game.entities[game.clientId].y;
			}
			else if (game.entities[game.clientId].y > (this.height - game.height/2)) {		// Bottom of map
				this.screenY = -(this.height - game.height);
				game.entities[game.clientId].screenY = game.entities[game.clientId].y - (this.height - game.height);
			}
			else {		// Center (height) of map
				this.screenY = -(game.entities[game.clientId].y - game.height/2);
			}
		}
	}

}());
