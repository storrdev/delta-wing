/*
  Required modules
*/

var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var url = require('url');
var path = require('path');
var mmm = require('mmmagic');
var fs = require('fs');
var db = require('./db');
var Player = require('./player').Player;

/*
  Declare Variables
*/

var clients = [];
var players = [];
var projectiles = [];
var projId = 0;

/*
  Start server and listen on port 80
*/

var port = process.env.PORT || 3000; // Heroku Only

app.listen(port);

setEventHandlers();

/*
  Server Functions
*/

function handler(req, res) {
  var reqPath = url.parse(req.url).pathname;
  var ext = path.extname(reqPath).toLowerCase();

  Magic = mmm.Magic;
  var magic = new Magic(mmm.MAGIC_MIME_TYPE);

  if (ext === ".png" || ext === ".jpg" || ext === ".gif") {
    magic.detectFile('../' + reqPath, function(err, result) {
      if (err) throw err;
      res.writeHead(200, {'Content-Type' : result});
      fs.createReadStream('../' + reqPath).pipe(res);
    });
  }
  else if (!ext) {
    fs.readFile('../index.html', 'utf-8', function(error, content) {
      res.writeHead(200, {'Content-Type' : 'text/html'});
      if (error) {
        res.write(error);
      }
      res.end(content);
    });
  }
  else {
    magic.detectFile("../" + reqPath, function(err, result) {
      if (err) throw err;

      if (ext === '.wav') {
        fs.readFile('../' + reqPath, function(error, content) {
          res.writeHead(200, {'Content-Type' : result});
          if (error) {
            res.write(error);
          }
          res.end(content);
        });
      }

      fs.readFile('../' + reqPath, 'utf-8', function(error, content) {
        res.writeHead(200, {'Content-Type' : result});
        if (error) {
          res.write(error);
        }
        res.end(content);
      });
    });
  }
}

function setEventHandlers() {
	io.sockets.on('connection', onSocketConnection);
}

function onSocketConnection(client) {

	//console.log(client);

	console.log('new player connected: ' + client.id);

	clients.push( client );

	client.on('disconnect', onClientDisconnect);
	client.on('new player', onNewPlayer);
	client.on('move player', onMovePlayer);
	client.on('new projectile', onNewProjectile);
	client.on('remove projectile', onRemoveProjectile);
	client.on('death', onDeath);
	client.on('kills', onKills);
	client.on('request id', onRequestId);
	client.on('get clients', onGetClients);
	client.on('get chunk', onGetChunk);
 	client.on('get spawn', onGetSpawn);
 	client.on('error', function(err) {
 		console.log(err);
 	});
}

function onClientDisconnect() {
	console.log('client has disconnected: ' + this.id);

	var removePlayer = clientById(this.id);

	console.log('Player Id to remove: ' + removePlayer);

	if(!removePlayer) {
		console.log('Player not found: ' + this.id);
		return;
	}

	players.splice(players.indexOf(removePlayer), 1);
	// broadcast.emit sends a message to all clients except the one it's being called on
	this.broadcast.emit('remove player', {id: this.id});
}

function onRequestId() {
	this.emit('client id', {id: this.id});
}

function onGetClients() {
	var socket = this;
	console.log('connected clients requested.');
	console.log('number of existing players: ' + players.length);
	players.forEach(function(player, index) {
		//console.log(player);
		socket.emit('new player', player);
	});
}

function onNewPlayer(data) {
	
	/*
	*	The player's x and y locations should probably be
	*	determined on the server side. Either by querying the
	*	database for the user's last known location, or figuring
	*	out a safe place for the user to spawn.
	*/

	var newPlayer = new Player({
		peerId: data.peerId,
		socketId: data.socketId
		//x: data.x,
		//y: data.y,
		//name: data.name
	});

	//console.log(data.name + ' has entered the game.');
	console.log('new player peer id: ' + newPlayer.peerId);
	console.log('new player socket id: ' + newPlayer.socketId);

	players.push(newPlayer);
	console.log('number of players: ' + players.length);

	// broadcast.emit sends a message to all clients except the one it's being called on
	this.broadcast.emit('new player', {
		socketId: newPlayer.socketId,
		peerId: newPlayer.peerId,
		//name: newPlayer.name,
		//x: newPlayer.getX(),
		//y: newPlayer.getY(),
		//kills: newPlayer.kills,
		//deaths: newPlayer.deaths
	});
}

function onMovePlayer(data) {
	var movePlayer = clientById(this.id);

	if (!movePlayer) {
		//console.log("(onMovePlayer) Player not found: " + this.id);
		return;
	}

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
}

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
}

function onRemoveProjectile(data) {
	var removeProjectile = projectileById(data.id);

	if (!removeProjectile) {
		console.log('Projectile not found: ' + data.id);
		return;
	}

	//console.log('Projectile removed.');

	projectiles.splice(projectiles.indexOf(removeProjectile), 1);
	// broadcast.emit sends a message to all clients except the one it's being called on
	io.sockets.emit('remove projectile', {id: data.id});
}

function onDeath() {
	var deathPlayer = clientById(this.id);

	deathPlayer.deaths++;

	//console.log(this.id + ' has died ' + deathPlayer.deaths + ' times.');

	io.sockets.emit('deaths', {id: this.id, deaths: deathPlayer.deaths});
}

function onKills(data) {
	var killsPlayer = clientById(data.playerId);

	killsPlayer.kills++;

	//console.log(data.playerId + ' has killed ' + killsPlayer.kills + ' players.');

	io.sockets.emit('kills', {id: data.playerId, kills: killsPlayer.kills});
}

function onGetChunk(data) {
	//console.log('chunk(' + data.x + ', ' + data.y + ') requested from ' + this.id);
	var that = this;
	db.getChunk(data.x, data.y, function(chunk) {
		//console.log('emitting chunk');
    	that.emit('chunk', chunk);
	});
}

function onGetSpawn(data) {
  //console.log('spawn requested from ' + this.id);
  this.emit('spawn', { x: 1, y: 1 });
}


function clientById(id) {
    var i;
    for (i = 0; i < clients.length; i++) {
        if (clients[i].id == id)
            return clients[i];
    }

    return false;
}

function projectileById(id) {
	var i;
	for (i = 0; i < projectiles.length; i++) {
		if (projectiles[i].getId() == id) {
			return projectiles[i];
		}
	}

	return false;
}

/*
*	Export http.Server object so other files can use it
*/

exports.server = function() {
	return io;
};