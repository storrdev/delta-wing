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

    //console.log("file: '" + reqPath + "'' requested");

	Magic = mmm.Magic;
    var magic = new Magic(mmm.MAGIC_MIME_TYPE);

    if (reqPath === '/update') {
    	console.log('update requested');
    	var sys = require('sys')
		var exec = require('child_process').exec;
		exec("bash update.sh", function (error, stdout, stderr) {
			var status = '';

			status = 'stdout: ' + stdout + '<br>stderr: ' + stderr + '<br>';
			if (error !== null) {
				status += 'exec error: ' + error;
			}

			res.end(status);

		});
    }
	else if (ext === ".png" || ext === ".jpg" || ext === ".gif") {	
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
			//console.log(result);

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
	client.on('death', onDeath);
	client.on('request id', onRequestId);
	client.on('get clients', onGetClients);
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

function onRequestId() {
	this.emit('client id', {id: this.id});
}

function onGetClients() {
	console.log('connected clients requested.');
	console.log('number of existing players: ' + players.length);
	var i, existingPlayer;
	for(i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		// .emit sends a message to all the clients
		console.log('sent ' + existingPlayer.name + '\'s information.');
		this.emit('new player', {
			id: existingPlayer.id,
			x: existingPlayer.getX(),
			y: existingPlayer.getY(),
			name: existingPlayer.name
		});
	}
}

function onNewPlayer(data) {
	var newPlayer = new Player(data.x, data.y, data.name);
	newPlayer.id = this.id;

	console.log(data.name + ' has entered the game. ' + newPlayer);
	
	// broadcast.emit sends a message to all clients except the one it's being called on
	this.broadcast.emit('new player', {
		id: newPlayer.id,
		name: newPlayer.name,
		x: newPlayer.getX(),
		y: newPlayer.getY()
	});
	
	players.push(newPlayer);
	console.log('number of players: ' + players.length);
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

function onDeath() {
	var deathPlayer = playerById(this.id);

	deathPlayer.deaths++;

	console.log(this.id + ' has died ' + deathPlayer.deaths + ' times.');

	io.sockets.emit('deaths', {id: this.id, deaths: deathPlayer.deaths});
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
