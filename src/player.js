(function() {
	
	game.component.player = {

		thrust: .7,
	  	deltaX: 0,
	  	deltaY: 0,
		drawFlame: false,
		velX: 0,
		velY: 0,
		r: 20,
		screenX: game.width/2,
		screenY: game.height/2,
		mag: 0,
		strafeX: 0,
		strafeY: 0,
		width: 40,
		height: 40,

		update: function(dt) {
			this.angle = game.getAngle(game.mouseX, this.screenX, game.mouseY, this.screenY);

			this.deltaX = game.mouseX - (this.x - (this.x - this.screenX));
			this.deltaY = game.mouseY - (this.y - (this.y - this.screenY));

			if (game.key.isDown(game.key.UP) || game.key.isDown(game.key.DOWN) || game.key.isDown(game.key.LEFT) || game.key.isDown(game.key.RIGHT)) {
				// This handles the strafing movement
				if (game.key.isDown(game.key.LEFT)) {
					this.strafeX = this.deltaY;
					this.strafeY = this.deltaX * -1;
				}
				else if (game.key.isDown(game.key.RIGHT)) {
					this.strafeX = this.deltaY * -1;
					this.strafeY = this.deltaX;
				}
				else {
					this.strafeX = 0;
					this.strafeY = 0;
				}
				
				// This handles the forward and backwards movement
				if (game.key.isDown(game.key.UP)) {
					this.drawFlame = true;
				}
				else if (game.key.isDown(game.key.DOWN)) {
					this.deltaX *= -1;
					this.deltaY *= -1;
					//this.drawFlame = false;
				}
				else {
					//this.drawFlame = false;
					this.deltaX = 0;
					this.deltaY = 0;
				}

				// This combines the forward movement with the strafing movement
				// in case both are used at the same time.
				this.deltaX = this.deltaX + this.strafeX;
				this.deltaY = this.deltaY + this.strafeY;
		
				// Calculating magnitude of vector created from the Player's screen position to the mouse coords
				mag = Math.sqrt(this.deltaX * this.deltaX + this.deltaY * this.deltaY);
				// Calculating the unit vector coords from the the original mouse vector
				// The 'unit vector' has same direction as original vector, but it's magnitude is 1
				// We then multiply the unit vector by our thrust to find the ships position over time
				this.deltaX = this.deltaX / mag * this.thrust;
				this.deltaY = this.deltaY / mag * this.thrust;
				
				// This incrementally changes the delta value to simulate mass when changing direction
				if (this.velX < this.deltaX) { this.velX += this.thrust/90; }
				else { this.velX -= this.thrust/90; }
				if (this.velY < this.deltaY) { this.velY += this.thrust/90; }
				else { this.velY -= this.thrust/90; }
			}
			else {
				this.drawFlame = false;
			}

			if (game.entities['map'].width != 0 && game.entities['map'].height != 0) {
				// Edge of map clip checking
				// Left side of map
				if ((this.x + this.velX) <= 0) {
					if (this.velX < 0) { this.velX = this.velX * -.6; }
				}
				// Right side of map
				if ((this.x + this.velX) > game.entities['map'].width) {
					if (this.velX > 0) { this.velX = this.velX * -.6; }
				}
				// Top of map
				if ((this.y + this.velY) < 0) {
					if (this.velY < 0) { this.velY = this.velY * -.6; }
				}
				// Bottom of map
				//if ((this.screenY + this.velY) > (game.background.img.height - game.height)) {
				if ((this.y + this.velY) > game.entities['map'].height) {
					//this.screenY = game.background.img.height - game.height;
					if (this.velY > 0) { this.velY = this.velY * -.6; }
				}
			}

			this.x += this.velX * dt;
			this.y += this.velY * dt;

			game.socket.emit('move player', {
				x: this.x,
				y: this.y,
				velX: this.velX,
				velY: this.velY,
				angle: this.angle
			});

			//console.log(this.x + ', ' + this.y);

			for (var e in game.entities) {
				if (e !== 'player' && this.id != game.entities[e].playerId) {
					if (game.entities[e].collision === 'circle') {
						var circle = game.entities[e];
						if (this.distanceTo(circle.x, circle.y, circle.velX, this.velY) < (this.r + circle.r)) {
							//Resets the position of the ship outside of the collision area
							this.x -= this.velX;
							this.y -= this.velY;

							// Reverses Direction of Ship after collision
							this.velX *= -.6;
							this.velY *= -.6;
						}
					}
					if (game.entities[e].collision === 'rect') {
						var rect = game.entities[e];
						if (game.collision.rectToRectIntersection(this, rect)) {

							rect.right = rect.x + (rect.width/2);
							rect.left = rect.x - (rect.width/2);
							rect.top = rect.y - (rect.height/2);
							rect.bottom = rect.y + (rect.height/2);

						    if (this.x < rect.left && this.velX > 0) {
						    	// left
						    	this.x -= this.velX * dt;
								this.velX *= -.6;
						    }
						    else if (this.x > rect.right && this.velX < 0) {
						    	// right
						    	this.x -= this.velX * dt;
								this.velX *= -.6;
						    }
						    else {
						    	// top/bottom
						    	this.y -= this.velY;
								this.velY *= -.6;
						    }

						}
					}
				}
			}
		}
	}
}());