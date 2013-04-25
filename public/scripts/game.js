var fps = 0;
var showFPS = false;
var lastRun;
var projId = 1;
var socket;
var bgImg = new Image();
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
	var projectile = getDeltas(mouseX, mouseY, Game.width/2, Game.height/2, Game.player.oldDeltaX, Game.player.oldDeltaY, 12);
	socket.emit('new projectile', {x: Game.player.x, y: Game.player.y, deltaX: projectile.vX, deltaY: projectile.vY});
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

function loadBackground(src, callback) {
	bgImg.onload = callback;
	bgImg.src = src;
}

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
	
	var xx = parseInt(getRandomArbitary(0, 4000));
	var yy = parseInt(getRandomArbitary(0, 2500));
	Game.player = new Player(xx, yy);
	
	Game.projectiles = new Array();
	
	socket = io.connect('localhost');
	setEventHandlers();
	
	Game.remotePlayers = new Array();
	
	var bgImg = new Image();
	
	loadBackground('levels/test/bg.jpg', Game._onEachFrame(Game.run));
};

var setEventHandlers = function() {
	socket.on('connect', onSocketConnected);
	socket.on('disconnect', onSocketDisconnect);
	socket.on('new player', onNewPlayer);
	socket.on('move player', onMovePlayer);
	socket.on('remove player', onRemovePlayer);
	socket.on('new projectile', onNewProjectile);
};

function onSocketConnected() {
	console.log('Connected to socket server');
	socket.emit('new player', {x: Game.player.getX(), y: Game.player.getY()});
	//console.log(Game.player.getX());
};

function onSocketDisconnect() {
	console.log('Disconnected from socket server');
};

function onNewPlayer(data) {
	console.log('New player connected: ' + data.id);
	
	var newPlayer = new Player(data.x, data.y, data.angle);
	newPlayer.id = data.id;
	Game.remotePlayers.push(newPlayer);
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
	
	Game.remotePlayers.splice(Game.remotePlayers.indexOf(removePlayer), 1);
	console.log('player has been disconnected: ' + data.id);
};

function onNewProjectile(data) {
	console.log('Remote projectile detected');
	var newProjectile = new Projectile(data.id, data.playerId, data.x, data.y, data.deltaX, data.deltaY);
	Game.projectiles.push(newProjectile);
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
	Game.context.drawImage(bgImg, -Game.player.getX(), -Game.player.getY());
	if (Game.projectiles.length != 0) {
  		for (var i = 0; i < Game.projectiles.length; i++) {
  			Game.projectiles[i].draw();
  		}
  	}
	Game.context.save();
  	Game.player.draw(Game.context);
  	Game.context.restore();
  	
  	var i;
  	
  	for (i = 0; i < Game.remotePlayers.length; i++) {
  		Game.context.save();
  		Game.remotePlayers[i].drawRemote(Game.context);
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

	if (Game.player.update()) {
		socket.emit('move player', {x: Game.player.getX(), y: Game.player.getY(), angle: Game.player.getAngle()});
	}
	
	if (Game.projectiles.length != 0) {
		for (var i = 0; i < Game.projectiles.length; i++) {
			for (var k = 0; k < Game.remotePlayers.length; k++) {
				if (collisionCheck(Game.projectiles[i], Game.remotePlayers[k])) {
					console.log('collision detected');
				}
			}
			Game.projectiles[i].update();
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
  		Game.context.arc(this.x - Game.player.x + Game.width/2, this.y - Game.player.y + Game.height/2, 5, 0, Math.PI*2, true);
  		Game.context.fillStyle = 'red';
      	Game.context.fill();
  		Game.context.stroke();
	}
	
	this.update = function() {
		this.x += this.deltaX;
		this.y += this.deltaY;
		
		if (this.x < 0 || this.x > bgImg.width || this.y < 0 || this.y > bgImg.height) {
  			var projIndex = Game.projectiles.indexOf(this);
  			Game.projectiles.splice(projIndex, 1);
  		}
	}
	
	this.getX = function() {
		return this.x;
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
	var mag = 0;
	var strafeX = 0
	var strafeY = 0;

	this.init = function() {
		if (x) { this.x = x; }
		if (y) { this.y = y; }
	}
	this.draw = function() {
		Game.context.translate(Game.width/2, Game.height/2);
		Game.context.rotate(this.angle);
		if (this.drawFlame) { Game.context.drawImage(this.flameImg, -this.fighterImg.width/2, 5); }
		Game.context.drawImage(this.fighterImg, -this.fighterImg.width/2, -this.fighterImg.height/2);
	}
	this.drawRemote = function() {
		Game.context.translate(this.x - Game.player.x + Game.width/2, this.y - Game.player.y + Game.height/2);
		Game.context.rotate(this.angle);
		Game.context.drawImage(this.fighterImg, -this.fighterImg.width/2, -this.fighterImg.height/2);
	}
	this.update = function() {
		this.prevX = this.x;
		this.prevY = this.y;
		
		
		// Collision detection between players
		var i;
		for (i = 0; i < Game.remotePlayers.length; i++) {
			if (parseInt(Game.remotePlayers[i].x - Game.remotePlayers[i].fighterImg.width/2) < parseInt(Game.player.x + this.fighterImg.width/2) &&
				parseInt(Game.remotePlayers[i].x + Game.remotePlayers[i].fighterImg.width/2) > parseInt(Game.player.x - this.fighterImg.width/2) &&
				parseInt(Game.remotePlayers[i].y - Game.remotePlayers[i].fighterImg.height/2) < parseInt(Game.player.y + this.fighterImg.height/2) &&
				parseInt(Game.remotePlayers[i].y + Game.remotePlayers[i].fighterImg.height/2) > parseInt(Game.player.y - this.fighterImg.height/2)) {
					this.oldDeltaX *= -.6;
					this.oldDeltaY *= -.6;
			}
		}

		this.angle = getAngle(mouseX, Game.width/2, mouseY, Game.height/2);
		
		this.deltaX = mouseX - Game.width/2;
		this.deltaY = mouseY - Game.height/2;
		
		
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
		
		if (bgImg.width != 0 && bgImg.height != 0) {
			// Edge of map clip checking
			// Left side of map
			if ((this.x + this.oldDeltaX) <= 0) {
				if (this.oldDeltaX < 0) { this.oldDeltaX = this.oldDeltaX * -.6; }
			}
			// Right side of map
			if ((this.x + this.oldDeltaX) > (bgImg.width - Game.width)) {
				this.x = bgImg.width - Game.width;
				if (this.oldDeltaX > 0) { this.oldDeltaX = this.oldDeltaX * -.6; }
			}
			// Top of map
			if ((this.y + this.oldDeltaY) < 0) {
				//this.mapY = 0;
				if (this.oldDeltaY < 0) { this.oldDeltaY = this.oldDeltaY * -.6; }
			}
			// Bottom of map
			if ((this.y + this.oldDeltaY) > (bgImg.height - Game.height)) {
				this.y = bgImg.height - Game.height;
				if (this.oldDeltaY > 0) { this.oldDeltaY = this.oldDeltaY * -.6; }
			}
		}
		
		//Change Player object's map position
		this.x += this.oldDeltaX;
		this.y += this.oldDeltaY;

		return (this.prevX != this.mapX || this.prevY != this.mapY) ? true : false;
	}
	
	this.getX = function() {
		return this.x;
	};
	
	this.getY = function() {
		return this.y;
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

/*function Game() {
	
}*/

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
	console.log('x1: ' + obj1.getX() + ' x2: ' + obj2.getX());
	if (obj1.getX() > obj2.getX()) {
		return true;
	}
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
    for (i = 0; i < Game.remotePlayers.length; i++) {
        if (Game.remotePlayers[i].id == id)
            return Game.remotePlayers[i];
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