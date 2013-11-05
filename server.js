var app = require('http').createServer(handler), 
	io = require('socket.io').listen(app),
	fs = require('fs'),
	Player = require('./Player').Player,
	Projectile = require('./Projectile').Projectile;
	mmm = require('mmmagic');
  
var url     =   require('url');
var path    =   require('path');
var players = [];
var projectiles = [];
var projId = 0;

app.listen(80);

// Comment to show that this file is different.

io.configure(function() {
	io.set('transports', ['websocket']);
	io.set('log level', 2);
});

function handler (req, res) {
	var reqPath = url.parse(req.url).pathname;
    var ext      = path.extname(reqPath).toLowerCase();

    console.log("file: " + reqPath + " requested");

	Magic = mmm.Magic;
    var magic = new Magic(mmm.MAGIC_MIME_TYPE);

	if (ext === ".png" || ext === ".jpg" || ext === ".gif") {	
		magic.detectFile('./' + reqPath, function(err, result) {
			if (err) throw err;
            res.writeHead(200, {'Content-Type' : result});
            fs.createReadStream('./' + reqPath).pipe(res);

		});
    }
    else if (!ext) {
    	fs.readFile('./index.html', 'utf-8', function(error, content) {
    		res.writeHead(200, {'Content-Type' : 'text/html'});
    		if (error) {
    			res.write(error);
    		}
    		//console.log("file: " + reqPath + " successful");
    		res.end(content);
    	});
    }
    else {
    	//Magic = mmm.Magic;
    	//var magic = new Magic(mmm.MAGIC_MIME_TYPE);
		magic.detectFile("./" + reqPath, function(err, result) {
			if (err) throw err;
			console.log(result);

			if (ext === '.wav') {
				fs.readFile('./' + reqPath, function(error, content) {
					res.writeHead(200, {'Content-Type' : result});
					if (error) {
						res.write(error);
					}
					res.end(content);
				});
			}
			
			fs.readFile('./' + reqPath, 'utf-8', function(error, content) {
				res.writeHead(200, {'Content-Type' : result});
				if (error) {
					res.write(error);
				}
				//console.log("file: " + reqPath + " successful");
				res.end(content);
			});
		});
    }
}

var setEventHandlers = function() {
	io.sockets.on('connection', onSocketConnection);
};

setEventHandlers();

function onSocketConnection(client) {
	console.log('new player connected: ' + client.id);
	client.on('disconnect', onClientDisconnect);
	client.on('new player', onNewPlayer);
	client.on('move player', onMovePlayer);
	client.on('new projectile', onNewProjectile);
	client.on('remove projectile', onRemoveProjectile);
};

function onClientDisconnect() {
	console.log('player has disconnected: ' + this.id);
	
	var removePlayer = playerById(this.id);
	
	if(!removePlayer) {
		console.log('Player not found: ' + this.id);
		return;
	}
	
	players.splice(players.indexOf(removePlayer), 1);
	// broadcast.emit sends a message to all clients except the one it's being called on
	this.broadcast.emit('remove player', {id: this.id});
};

function onNewPlayer(data) {
	var newPlayer = new Player(data.x, data.y, data.angle);
	newPlayer.id = this.id;
	
	// broadcast.emit sends a message to all clients except the one it's being called on
	this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});
	
	// sends the server assigned id back to the client who just connected for reference
	this.emit('client id', {id: newPlayer.id});
	
	var i, existingPlayer;
	for(i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		// .emit sends a message to all the clients
		this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
	}
	
	players.push(newPlayer);
};

function onMovePlayer(data) {
	var movePlayer = playerById(this.id);

	if (!movePlayer) {
		console.log("(onMovePlayer) Player not found: " + this.id);
		return;
	};

	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
	movePlayer.setVelX(data.velX);
	movePlayer.setVelY(data.velY);
	movePlayer.setAngle(data.angle);

	this.broadcast.emit("move player", {
		id: movePlayer.id,
		x: movePlayer.getX(),
		y: movePlayer.getY(),
		velX: movePlayer.getvelX(),
		velY: movePlayer.getvelY(),
		angle: movePlayer.getAngle()
	});
};

function onNewProjectile(data) {
	var newProjectile = new Projectile(data.x, data.y, data.velX, data.velY, this.id, projId);

	io.sockets.emit(
		'new projectile',
		{
			id: newProjectile.getId(),
			playerId: newProjectile.getPlayerId(),
			x: newProjectile.getX(),
			y: newProjectile.getY(),
			velX: newProjectile.getVelX(),
			velY: newProjectile.getVelY()
		}
	);
	
	projectiles.push(newProjectile);
	projId++;
};

function onRemoveProjectile(data) {
		var removeProjectile = projectileById(data.id);
		
		if (!removeProjectile) {
			console.log('Projectile not found: ' + data.id);
			return;
		};
		
		console.log('Projectile removed.');
		
		projectiles.splice(projectiles.indexOf(removeProjectile), 1);
		// broadcast.emit sends a message to all clients except the one it's being called on
		io.sockets.emit('remove projectile', {id: data.id});
};


function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    };

    return false;
};

function projectileById(id) {
	var i;
	for (i = 0; i < projectiles.length; i++) {
		if (projectiles[i].getId() == id) {
			return projectiles[i];
		};
	};
	
	return false;
};
