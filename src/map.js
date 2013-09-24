(function() {

	game.component.map = {

		update: function() {
			if (game.entities['player'].x < game.width/2) {
				this.screenX = 0;
				game.entities['player'].screenX = game.entities['player'].x;
			}
			else if (game.entities['player'].x > (this.width - game.width/2)) {
				this.screenX = -(this.width - game.width);
				game.entities['player'].screenX = game.entities['player'].x - (this.width - game.width);
			}
			else {
				this.screenX = -(game.entities['player'].x - game.width/2);
			}
			
			if (game.entities['player'].y < game.height/2) {
				this.screenY = 0;
				game.entities['player'].screenY = game.entities['player'].y;
			}
			else if (game.entities['player'].y > (this.height - game.height/2)) {
				this.screenY = -(this.height - game.height);
				game.entities['player'].screenY = game.entities['player'].y - (this.height - game.height);
			}
			else {
				this.screenY = -(game.entities['player'].y - game.height/2);
			}
		}
	}

}());
