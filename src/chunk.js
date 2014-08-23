var db = require('./db');
var gameMath = require('./Math');
var fs = require('fs');

exports.generate = function(x, y, cb) {

	// Hard coded chunk variables.. I know it's wrong I just can't help myself!
	var chunkHeight = 10;
	var chunkWidth = 10;
	var tileHeight = 10;
	var tileWidth = 10;
	var orientation = 'orthogonal';

	//New chunk generation code

  var newObject;
	var newObjects = [];
  //var chunk_json = "this";

  fs.readFile('./spawnable_objects.json', 'utf8', function (err, data) {
		if (err) throw err;
		var spawnable = JSON.parse(data);
		var numObjects = Math.ceil(Math.random()*3);
		console.log(numObjects);
		for (var o = 0; o < numObjects; o++) {
			newObject = {"id": o};
			objectRef = spawnable.objects[Math.ceil((Math.random() * spawnable.objects.length) - 1)];
			for (var prop in objectRef) {
				if(objectRef.hasOwnProperty(prop)){
			    	newObject[prop] = objectRef[prop];
			    }
			}
			newObject.scale = Math.random().toFixed(2);
			newObject.width = Math.ceil(newObject.width * newObject.scale);
			newObject.height = Math.ceil(newObject.height * newObject.scale);

			var touching = true;

			while (touching === true) {
				newObject.x = Math.ceil(Math.random() * (chunkWidth * tileWidth));
				newObject.y = Math.ceil(Math.random() * (chunkHeight * tileHeight));
				//console.log(newObject.x + ', ' + newObject.y);
				if (newObjects.length < 1) { touching = false; }
				for (var i = 0; i < newObjects.length; i++) {
					if (gameMath.distance(newObject.x, newObjects[i].x, newObject.y, newObjects[i].y) > (newObjects[i].width/2)) {
						touching = false;
					}
				}
			}

			newObjects.push(newObject);
			newObject = null;
		}

		//chunk_json = JSON.stringify(chunk, null, "\t");

		//var new_chunk_query = "insert into chunks (x, y, json) values (" + x + ", " + y + ", '" + chunk_json + "')";

		// query(new_chunk_query, function(err, rows, result) {
		// 	console.log('err: ' + err);
		// 	console.log('rows: ' + rows);
		// 	console.log('result: ' + result);
		// });

		//cb(chunk_json);

	});

	var newLayers = [
		{
			name: 'collision',
			height: chunkHeight,
			width: chunkWidth,
			opacity: 1,
			visible: true,
			type: "objectgroup",
			objects: newObjects
		}
	];


	var newChunk = new db.Chunk({
		x: x,
		y: y,
		height: chunkHeight,
		width: chunkWidth,
		tileheight: tileHeight,
		tilewidth: tileWidth,
		orientation: orientation,
		layers: newLayers
	});

	newChunk.save(function(err, newChunk) {
		if (err) return console.error(err);
		else {
			console.log('chunk created: ' + newChunk);
			cb(newChunk);
		}
	});

	// Old generation code..
	// var chunk = {};
	//
  //   chunk.height = 10;
  //   chunk.width = 10;
  //   chunk.tileheight = 60;
  //   chunk.tilewidth = 60;
  //   chunk.orientation = "orthogonal";
  //   chunk.tilesets = [];
  //   chunk.properties = {};
  //   chunk.version = 1;
  //   chunk.layers = [];
  //   chunk.layers[0] = {};
  //   chunk.layers[0].name = "collision";
  //   chunk.layers[0].height = chunk.height;
  //   chunk.layers[0].width = chunk.width;
  //   chunk.layers[0].opacity = 1;
  //   chunk.layers[0].visible = true;
  //   chunk.layers[0].type = "objectgroup";
  //   chunk.layers[0].objects = [];
	//
  //   var newObject;
  //   var chunk_json = "this";
	//
  //   fs.readFile('./spawnable_objects.json', 'utf8', function (err, data) {
	// 	if (err) throw err;
	// 	var spawnable = JSON.parse(data);
	// 	var numObjects = Math.ceil(Math.random()*3);
	// 	console.log(numObjects);
	// 	for (var o = 0; o < numObjects; o++) {
	// 		newObject = {"id": o};
	// 		objectRef = spawnable.objects[Math.ceil((Math.random() * spawnable.objects.length) - 1)];
	// 		for (var prop in objectRef) {
	// 			if(objectRef.hasOwnProperty(prop)){
	// 		    	newObject[prop] = objectRef[prop];
	// 		    }
	// 		}
	// 		newObject.scale = Math.random().toFixed(2);
	// 		newObject.width = Math.ceil(newObject.width * newObject.scale);
	// 		newObject.height = Math.ceil(newObject.height * newObject.scale);
	//
	// 		var touching = true;
	//
	// 		while (touching === true) {
	// 			newObject.x = Math.ceil(Math.random() * (chunk.width * chunk.tilewidth));
	// 			newObject.y = Math.ceil(Math.random() * (chunk.height * chunk.tileheight));
	// 			//console.log(newObject.x + ', ' + newObject.y);
	// 			if (chunk.layers[0].objects.length < 1) { touching = false; }
	// 			for (var i = 0; i < chunk.layers[0].objects.length; i++) {
	// 				if (gameMath.distance(newObject.x, chunk.layers[0].objects[i].x, newObject.y, chunk.layers[0].objects[i].y) > (newObject.width/2) + (chunk.layers[0].objects[i].width/2)) {
	// 					touching = false;
	// 				}
	// 			}
	// 		}
	//
	// 		chunk.layers[0].objects.push(newObject);
	// 		newObject = null;
	// 	}
	//
	// 	chunk_json = JSON.stringify(chunk, null, "\t");
	//
	// 	var new_chunk_query = "insert into chunks (x, y, json) values (" + x + ", " + y + ", '" + chunk_json + "')";
	//
	// 	query(new_chunk_query, function(err, rows, result) {
	// 		console.log('err: ' + err);
	// 		console.log('rows: ' + rows);
	// 		console.log('result: ' + result);
	// 	});
	//
	// 	cb(chunk_json);

	//});
};
