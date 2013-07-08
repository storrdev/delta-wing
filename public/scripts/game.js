var fps = 0;
var showFPS = false;
var lastRun;
var projId = 1;
var socket;
//var bgImg = new Image();
//var projectiles = new Array();

var Key = {
  _pressed: {},

  LEFT: 65,
  UP: 87,
  RIGHT: 68,
  DOWN: 83,
  

  isDown: function(keyCode) {
	return this._pressed[keyCode];
  },

  onKeydown: function(event) {
	this._pressed[event.keyCode] = true;
  },

  onKeyup: function(event) {
	delete this._pressed[event.keyCode];
  }
};
	
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var mouseX;
var mouseY;
function mov(e) {
    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
	else if(e.clientX) {
		mouseX = e.clientX;
		mouseY = e.clientY;
	}
}

function click() {
	var projectile = getDeltas(mouseX, mouseY, Game.players[0].screenX, Game.players[0].screenY, Game.players[0].oldDeltaX, Game.players[0].oldDeltaY, 12);
	socket.emit('new projectile', {x: Game.players[0].x, y: Game.players[0].y, deltaX: projectile.vX, deltaY: projectile.vY});
}

function resize() {
	Game.width = window.innerWidth;
	Game.height = window.innerHeight;
	Game.canvas.width = window.innerWidth;
	Game.canvas.height = window.innerHeight;
}

var Game = {
  fps: 60,
  width: window.innerWidth,
  height: window.innerHeight
};

// This anonymous function handles the different RequestAnimationFrame functionalities
// built into different browsers and returns the correct function for the user's
// browser. If the user's browser doesn't have a RequestAnimationFrame function it
// uses the setInterval function to refresh as close to Game.fps as possible
Game._onEachFrame = (function() {
  var requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

  if (requestAnimationFrame) {
   return function(cb) {
	  var _cb = function() { cb(); requestAnimationFrame(_cb); }
	  _cb();
	};
  } else {
	return function(cb) {
	  setInterval(cb, 1000 / Game.fps);
	}
  }
})();

// Function called when body loads. This starts the game.
// It creates the canvas (where the game is displayed) and sets it's height and width
// The context of the canvas is set to 2d and it's added to the body.
// A player object is implemented and the images for the player is loaded.
// The main game loop is started under ._onEachFrame
Game.start = function() {
	Game.canvas = document.createElement("canvas");
	Game.canvas.width = Game.width;
	Game.canvas.height = Game.height;

	Game.context = Game.canvas.getContext("2d");

	document.body.appendChild(Game.canvas);
	
	Game.canvas.addEventListener('mousemove', mov, false);
	Game.canvas.addEventListener('click', click, false);
	window.addEventListener('resize', resize, false);
	
	var xx = parseInt(getRandomArbitary(1500, 1700));
	var yy = parseInt(getRandomArbitary(700, 800));
	Game.players = new Array();
	Game.players.push(new Player(xx, yy));
	
	Game.projectiles = new Array();
	
	socket = io.connect('localhost');
	//socket = io.connect('http://storrdev.dyndns-remote.com:80');
	setEventHandlers();
	
	Game.background = new background('levels/test/bg.jpg');
	Game.background.load(Game._onEachFrame(Game.run));
};

var setEventHandlers = function() {
	socket.on('connect', onSocketConnected);
	socket.on('client id', onClientId);
	socket.on('disconnect', onSocketDisconnect);
	socket.on('new player', onNewPlayer);
	socket.on('move player', onMovePlayer);
	socket.on('remove player', onRemovePlayer);
	socket.on('new projectile', onNewProjectile);
	socket.on('remove projectile', onRemoveProjectile);
};

function onSocketConnected() {
	console.log('Connected to socket server');
	socket.emit('new player', {x: Game.players[0].getX(), y: Game.players[0].getY()});
	//console.log(Game.players[0].getX());
};

function onClientId(data) {
	Game.players[0].id = data.id;
	console.log(Game.players[0].id);
}

function onSocketDisconnect() {
	console.log('Disconnected from socket server');
};

function onNewPlayer(data) {
	console.log('New player connected: ' + data.id);
	
	var newPlayer = new Player(data.x, data.y, data.angle);
	newPlayer.id = data.id;
	Game.players.push(newPlayer);
};

function onMovePlayer(data) {
	var movePlayer = playerById(data.id);
	
	if (!movePlayer) {
		console.log('Player not found: ' + data.id);
		return;
	};
	
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
	movePlayer.setAngle(data.angle);
};

function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);
	
	if (!removePlayer) {
		console.log('Player not found: ' + data.id);
		return;
	};
	
	Game.players.splice(Game.players.indexOf(removePlayer), 1);
	console.log('player has been disconnected: ' + data.id);
};

function onNewProjectile(data) {
	var newProjectile = new Projectile(data.id, data.playerId, data.x, data.y, data.deltaX, data.deltaY);
	Game.projectiles.push(newProjectile);
};

function onRemoveProjectile(data) {
	var removeProjectile = projectileById(data.id);

	if (!removeProjectile) {
		console.log('Projectile not found: ' + this.id);
	};

	Game.projectiles.splice(Game.projectiles.indexOf(removeProjectile));
};

// Main Game Loop
// 
Game.run = (function() {
  	var loops = 0, skipTicks = 1000 / Game.fps,
	maxFrameSkip = 10,
	nextGameTick = (new Date).getTime(),
	lastGameTick;
  	
  	return function() {
		loops = 0;

		while ((new Date).getTime() > nextGameTick) {
	  		Game.update();
	  		nextGameTick += skipTicks;
	  		loops++;
		}
	
		if (loops) Game.draw();
  	}
})();

Game.draw = function() {
	Game.context.clearRect(0, 0, Game.width, Game.height);
	//Game.context.drawImage(bgImg, -Game.players[0].getX(), -Game.players[0].getY());
	//Game.context.drawImage(Game.background.img, -Game.players[0].getX(), -Game.players[0].getY());
	Game.background.draw();
	if (Game.projectiles.length != 0) {
  		for (var i = 0; i < Game.projectiles.length; i++) {
  			Game.projectiles[i].draw();
  		}
  	}
	Game.context.save();
  	Game.players[0].draw(Game.context);
  	Game.context.restore();
  	
  	var i;
  	
  	for (i = 1; i < Game.players.length; i++) {		// Starting at 1 should skip over the local player, which requires the draw() function instead of drawRemote()
  		Game.context.save();
  		Game.players[i].drawRemote(Game.context);
  		Game.context.restore();
  	}
  
  	if (showFPS) { displayFPS(); }
};

Game.update = function() {
	if (!lastRun) {
		lastRun = new Date().getTime();
	}
	else {
		var delta = (new Date().getTime() - lastRun)/1000;
		lastRun = new Date().getTime();
		fps = 1/delta;
	}

	if (Game.players[0].update()) {
		socket.emit('move player', {x: Game.players[0].getX(), y: Game.players[0].getY(), angle: Game.players[0].getAngle()});
		Game.background.update(Game.players[0].getX(), Game.players[0].getY());
	}
	
	if (Game.projectiles.length != 0) {
		for (var i = 0; i < Game.projectiles.length; i++) {
			for (var k = 0; k < Game.players.length; k++) {
				if (Game.projectiles[i].playerId != Game.players[k].id && collisionCheck(Game.projectiles[i], Game.players[k])) {
					Game.projectiles.splice(i, 1);
					Game.players[k].health--;
					break;
				}
				else if (Game.projectiles[i].x < 0 - Game.width/2 || Game.projectiles[i].x > Game.background.img.width || Game.projectiles[i].y < 0 - Game.height/2 || Game.projectiles[i].y > Game.background.img.height) {
					Game.projectiles.splice(i, 1);
					break;
				}
				else {
					Game.projectiles[i].update();
				}
			}
		}
	}
	
};

// Projectile Object
function Projectile(id, playerId, x, y, deltaX, deltaY) {

	this.id = 0;
	this.playerId = 0;
	this.x = 0;
	this.y = 0;
	this.deltaX = 0;
	this.deltaY = 0;
	this.r = 5;
	
	this.init = function() {
		if (id) { this.id = id; }
		if (playerId) { this.playerId = playerId; }
		if (x) { this.x = x; }
		if (y) { this.y = y; }
		if (deltaX) { this.deltaX = deltaX; }
		if (deltaY) { this.deltaY = deltaY; }
	}
	
	this.draw = function() {
		Game.context.beginPath();
  		Game.context.arc(this.x - Game.players[0].x + Game.players[0].screenX, this.y - Game.players[0].y + Game.players[0].screenY, this.r, 0, Math.PI*2, true);
  		Game.context.fillStyle = 'red';
      	Game.context.fill();
  		Game.context.stroke();
	}
	
	this.update = function() {
		this.x += this.deltaX;
		this.y += this.deltaY;
	}
	
	this.getX = function() {
		return this.x;
	}
	
	this.getY = function() {
		return this.y;
	}
	
	this.getdX = function() {
		return this.deltaX;
	}
	
	this.getdY = function() {
		return this.deltaY;
	}
	
	this.init();
	
}

// Here is the construct for the Player() object
function Player(x, y) {
  	this.thrust = 10;
  	this.deltaX = 0;
  	this.deltaY = 0;
  	this.angle = 0;
  	this.fighterImg = new Image();
	this.fighterImg.src = "images/sprites/fighter.png";
	this.flameImg = new Image();
	this.flameImg.src = "images/sprites/fighterFlame.png";
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

function background(file) {
	this.init = function() {
		if (file) {
			this.file = file;
			this.img = new Image();
			this.x = -Game.players[0].getX();
			this.y = -Game.players[0].getY();
		}
	}
	
	this.load = function(callback) {
		this.img.onload = callback;
		this.img.src = this.file;
	}
	
	this.update = function(x, y) {
		if (x < Game.width/2) {
			this.x = 0;
		}
		else if (x > (this.img.width - Game.width/2)) {
			this.x = -(this.img.width - Game.width);
		}
		else {
			this.x = -(x - Game.width/2);
		}
		
		if (y < Game.height/2) {
			this.y = 0;
		}
		else if (y > (this.img.height - Game.height/2)) {
			this.y = -(this.img.height - Game.height);
		}
		else {
			this.y = -(y - Game.height/2);
		}
	}
	
	this.draw = function() {
		Game.context.drawImage(this.img, this.x, this.y);
	}
	
	this.init();
}

function getAngle(x1, x2, y1, y2) {
	var angle;
	
	if (x1 == x2) {
		if (y1 < y2) { return 0; }
		else { return 180 * (Math.PI/180); }
	}
	else {
		angle = Math.atan((y2-y1)/(x2-x1));
		if (x1 < x2) {
			return angle - 90 * (Math.PI/180);
		}
		else {
			return angle + 90 * (Math.PI/180);
		}
	}
	
}

function collisionCheck(obj1, obj2) {
	
	//var distX = obj1.getX() - obj2.getX();
	//var distY = obj1.getY() - obj2.getY();
	
	var distX = (obj1.getX() + obj1.getdX()) - (obj2.getX() + obj2.getdX());
	var distY = (obj1.getY() + obj1.getdY()) - (obj2.getY() + obj2.getdY());

	var dist = Math.sqrt((distX * distX) + (distY * distY));
	return dist <= (obj1.r + obj2.r);

}

function getDeltas(x1, y1, x2, y2, deltaX, deltaY, speed) {
	
	var vX = x1 - x2;
	var vY = y1 - y2;
	
	var mag = Math.sqrt(vX * vX + vY * vY);
	
	vX = vX / mag * speed;
	vY = vY / mag * speed;
	
	vX = vX + deltaX;
	vY = vY + deltaY;
	
	return {
		vX: vX,
		vY: vY
	}
}

function playerById(id) {
    var i;
    for (i = 0; i < Game.players.length; i++) {
        if (Game.players[i].id == id)
            return Game.players[i];
    };

    return false;
};

function projectileById(id) {
	var i;
	for (i = 0; i < Game.projectiles.length; i++) {
		if (Game.projectiles[i].id == id) {
			return Game.projectiles[i];
		};
	};
	
	return false;
};

function displayFPS(){
	Game.context.fillStyle = "White";
	Game.context.font      = "normal 12pt Arial";

	Game.context.fillText(fps + " fps", 10, 26);
}

function getRandomArbitary(min, max) {
    return Math.random() * (max - min) + min;
}