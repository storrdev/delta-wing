(function() {
	
	game.component.player = {

		thrust: 10,
	  	deltaX: 0,
	  	deltaY: 0,
		drawFlame: false,
		oldDeltaX: 0,
		oldDeltaY: 0,
		r: 20,
		screenX: game.width/2,
		screenY: game.height/2,
		mag: 0,
		strafeX: 0,
		strafeY: 0,

		update: function() {
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
				if (this.oldDeltaX < this.deltaX) { this.oldDeltaX += this.thrust/90; }
				else { this.oldDeltaX -= this.thrust/90; }
				if (this.oldDeltaY < this.deltaY) { this.oldDeltaY += this.thrust/90; }
				else { this.oldDeltaY -= this.thrust/90; }
			}
			else {
				this.drawFlame = false;
			}

			if (game.entities['map'].width != 0 && game.entities['map'].height != 0) {
				// Edge of map clip checking
				// Left side of map
				if ((this.x + this.oldDeltaX) <= 0) {
					if (this.oldDeltaX < 0) { this.oldDeltaX = this.oldDeltaX * -.6; }
				}
				// Right side of map
				if ((this.x + this.oldDeltaX) > game.entities['map'].width) {
					if (this.oldDeltaX > 0) { this.oldDeltaX = this.oldDeltaX * -.6; }
				}
				// Top of map
				if ((this.y + this.oldDeltaY) < 0) {
					if (this.oldDeltaY < 0) { this.oldDeltaY = this.oldDeltaY * -.6; }
				}
				// Bottom of map
				//if ((this.screenY + this.oldDeltaY) > (game.background.img.height - game.height)) {
				if ((this.y + this.oldDeltaY) > game.entities['map'].height) {
					//this.screenY = game.background.img.height - game.height;
					if (this.oldDeltaY > 0) { this.oldDeltaY = this.oldDeltaY * -.6; }
				}
			}

			this.x += this.oldDeltaX;
			this.y += this.oldDeltaY;

			//console.log(this.x + ', ' + this.y);
		}
	}
}());