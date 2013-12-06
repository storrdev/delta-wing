(function() {
	
	game.component.projectile = {

		r: 5,
		
		update: function(dt) {

			this.x += this.velX * dt;
			this.y += this.velY * dt;
			this.screenX = this.x - game.entities[game.clientId].x + game.entities[game.clientId].screenX;
			this.screenY = this.y - game.entities[game.clientId].y + game.entities[game.clientId].screenY;

			for (var e in game.entities) {
				if (this.playerId != game.entities[e].id && this.id != game.entities[e].id) {
					if (game.entities[e].collision === 'circle') {
						var circle = game.entities[e];
						if (this.distanceTo(circle.x, circle.y, circle.velX, this.velY) < (this.r + circle.r)) {
							if (this.playerId != circle.playerId) {
								if (typeof circle.damage == 'function') {
									circle.damage(this.dp);
								}
								if (circle.hp == 0) {
									this.kills++;
									
								}
								game.removeEntityById(this.id);
						    	break;
							}
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