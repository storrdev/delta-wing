(function() {
	
	game.component.projectile = {

		r: 5,
		
		update: function() {

			this.x += this.velX;
			this.y += this.velY;
			this.screenX = this.x - game.entities['player'].x + game.entities['player'].screenX;
			this.screenY = this.y - game.entities['player'].y + game.entities['player'].screenY;

			for (var e in game.entities) {
				if (this.playerId != game.entities[e].id && this.id != game.entities[e].id) {
					if (game.entities[e].collision === 'circle') {
						var circle = game.entities[e];
						if (this.distanceTo(circle.x, circle.y, circle.velX, this.velY) < (this.r + circle.r)) {
							game.removeEntityById(this.id);
						    break;
						}
					}
					if (game.entities[e].collision === 'rect') {
						var rect = game.entities[e];
						if (game.collision.circleRectIntersects(this, rect)) {
						    game.removeEntityById(this.id);
						    break;
						}
					}
				}
			}

			if (this.x < 0 || this.y < 0 || this.x > game.entities['map'].width || this.y > game.entities['map'].height) {
				console.log('projectile out of bounds');
				game.removeEntityById(this.id);
			}

		}

	}

}());