(function() {
	
	game.component.projectile = {

		r: 5,
		
		update: function() {

			//Game.context.arc(this.x - Game.players[0].x + Game.players[0].screenX, this.y - Game.players[0].y + Game.players[0].screenY, this.r, 0, Math.PI*2, true);

			//console.log(this.x);

			this.x += this.velX;
			this.y += this.velY;
			this.screenX = this.x - game.entities['player'].x + game.entities['player'].screenX;
			this.screenY = this.y - game.entities['player'].y + game.entities['player'].screenY;
			//console.log(this.screenX + ' = ' + this.x + ' - ' + game.entities['player'].x + ' + ' + game.entities['player'].screenX);

		}

	}

}());