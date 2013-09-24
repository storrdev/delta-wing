function Player(x, y) {
  	this.thrust = 10;
  	this.deltaX = 0;
  	this.deltaY = 0;
  	this.angle = 0;
  	this.fighterImg = new Image();
	this.fighterImg.src = "public/images/sprites/fighter.png";
	this.flameImg = new Image();
	this.flameImg.src = "public/images/sprites/fighterFlame.png";
	this.drawFlame = false;
	this.oldDeltaX = 0;
	this.oldDeltaY = 0;
	this.r = 20;
	this.health = 10;
	this.deaths = 0;
	this.screenX = Game.width/2;
	this.screenY = Game.height/2;
	var mag = 0;
	var strafeX = 0;
	var strafeY = 0;

	this.init = function() {
		if (x) { this.x = x; }
		if (y) { this.y = y; }
	}
	this.draw = function() {
		Game.context.translate(this.screenX, this.screenY);
		Game.context.rotate(this.angle);
		if (this.drawFlame) { Game.context.drawImage(this.flameImg, -this.fighterImg.width/2, 5); }
		Game.context.drawImage(this.fighterImg, -this.fighterImg.width/2, -this.fighterImg.height/2);
	}
	this.drawRemote = function() {
		Game.context.translate(this.x - Game.players[0].x + Game.players[0].screenX, this.y - Game.players[0].y + Game.players[0].screenY);
		Game.context.rotate(this.angle);
		Game.context.drawImage(this.fighterImg, -this.fighterImg.width/2, -this.fighterImg.height/2);
	}
	this.update = function() {
		
		if (this.health > 0) {
			this.prevX = this.x;
			this.prevY = this.y;
			
			// Collision detection between players
			var i;
			for (i = 1; i < Game.players.length; i++) {		// Starts at 1 so that the local player isn't colliding with itself
				if (collisionCheck(Game.players[0], Game.players[i])) {
						this.oldDeltaX *= -.6;
						this.oldDeltaY *= -.6;
						//return;
				}
			}
			
			// Handles on screen positioning of local player to for angle equations
			if (this.x < Game.width/2) {
				this.screenX = this.x;
			}
			else if (this.x > (Game.background.img.width - (Game.width/2))) {
				this.screenX = (this.x - Game.background.img.width) + Game.width;
			}
			else {
				this.screenX = Game.width/2;
			}
			
			if (this.y < Game.height/2) {
				this.screenY = this.y
			}
			else if (this.y > (Game.background.img.height - (Game.height/2))) {
				this.screenY = (this.y - Game.background.img.height) + Game.height;
			}
			else {
				this.screenY = Game.height/2;
			}
			
			this.angle = getAngle(mouseX, this.screenX, mouseY, this.screenY);
			
			this.deltaX = mouseX - (this.x - (this.x - this.screenX));
			this.deltaY = mouseY - (this.y - (this.y - this.screenY));
			
			if (Key.isDown(Key.UP) || Key.isDown(Key.DOWN) || Key.isDown(Key.LEFT) || Key.isDown(Key.RIGHT)) {
				// This handles the strafing movement
				if (Key.isDown(Key.LEFT)) {
					strafeX = this.deltaY;
					strafeY = this.deltaX * -1;
				}
				else if (Key.isDown(Key.RIGHT)) {
					strafeX = this.deltaY * -1;
					strafeY = this.deltaX;
				}
				else {
					strafeX = 0;
					strafeY = 0;
				}
				
				// This handles the forward and backwards movement
				if (Key.isDown(Key.UP)) {
					this.drawFlame = true;
				}
				else if (Key.isDown(Key.DOWN)) {
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
				this.deltaX = this.deltaX + strafeX;
				this.deltaY = this.deltaY + strafeY;
		
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
			
			if (Game.background.img.width != 0 && Game.background.img.height != 0) {
				// Edge of map clip checking
				// Left side of map
				if ((this.x + this.oldDeltaX) <= 0) {
					if (this.oldDeltaX < 0) { this.oldDeltaX = this.oldDeltaX * -.6; }
				}
				// Right side of map
				if ((this.x + this.oldDeltaX) > Game.background.img.width) {
					if (this.oldDeltaX > 0) { this.oldDeltaX = this.oldDeltaX * -.6; }
				}
				// Top of map
				if ((this.y + this.oldDeltaY) < 0) {
					if (this.oldDeltaY < 0) { this.oldDeltaY = this.oldDeltaY * -.6; }
				}
				// Bottom of map
				//if ((this.y + this.oldDeltaY) > (Game.background.img.height - Game.height)) {
				if ((this.y + this.oldDeltaY) > Game.background.img.height) {
					//this.y = Game.background.img.height - Game.height;
					if (this.oldDeltaY > 0) { this.oldDeltaY = this.oldDeltaY * -.6; }
				}
			}
			
			//Change Player object's map position
			this.x += this.oldDeltaX;
			this.y += this.oldDeltaY;
			
			//console.log(this.x + ", " + this.y);
		}
		else {
			this.deaths++;
			this.health = 10;
			this.oldDeltaX = 0;
			this.oldDeltaY = 0;
			this.x = parseInt(getRandomArbitary(1500, 1700));
			this.y = parseInt(getRandomArbitary(700, 800));
		}

		return (this.prevX != this.mapX || this.prevY != this.mapY) ? true : false;
	}
	
	this.getX = function() {
		return this.x;
	};
	
	this.getY = function() {
		return this.y;
	};
	
	this.getdX = function() {
		return this.oldDeltaX;
	};
	
	this.getdY = function() {
		return this.oldDeltaY;
	};
	
	this.getAngle = function() {
		return this.angle;
	};
	
	this.setX = function(newX) {
		this.x = newX;
	};
	
	this.setY = function(newY) {
		this.y = newY;
	};
	
	this.setAngle = function(newAngle) {
		this.angle = newAngle;
	};
	
	this.getSpeed = function() {
		return Math.sqrt(this.oldDeltaX * this.oldDeltaX + this.oldDeltaY * this.oldDeltaY);
	}
	
	this.init();
}
