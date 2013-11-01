(function() {

	var successCount = 0;
    var errorCount = 0;
    var cache = {};			// object declaration
	var downloadQueue = [];	// array declaration
	
	game.assetManager = {
			
		queueDownload: function(path) {
			downloadQueue.push(path);
		},
		
		downloadAll: function(downloadCallback) {
			if (downloadQueue.length === 0) {
				game.assetManager.downloadAssets(downloadCallback);
			}
			// Get and parse all JSON files first to grab the files referenced in the json file
			for (var i = 0; i < downloadQueue.length; i++) {
				var ext = downloadQueue[i].split('.').pop().toLowerCase();
				var file = downloadQueue[i].split('/').pop();
				var path = downloadQueue[i].substring(0, downloadQueue[i].lastIndexOf("/"));
				var json;
				if (ext === "json") {
					downloadQueue.splice(i, 1);
					var xhr = new XMLHttpRequest();
					xhr.onreadystatechange = function() {
						if (xhr.readyState==4 && xhr.status==200) {
							json = JSON.parse(xhr.responseText);
							for (var l = 0; l < json.layers.length; l++) {
								if (json.layers[l].image) {
									console.log('image found in json: ' + path + '/' + json.layers[l].image);
									game.assetManager.queueDownload(path + '/' + json.layers[l].image);
								}
							}
							for (var t = 0; t < json.tilesets.length; t++) {
								if (json.tilesets[t].image) {
									console.log('image found in json: ' + path + '/' + json.tilesets[t].image);
									game.assetManager.queueDownload(path + '/' + json.tilesets[t].image);
								}
							}
							cache[file] = json;
							game.assetManager.downloadAssets(downloadCallback);
						}
					};
					xhr.open("GET", path + "/" + file, true);
					xhr.send();
				}
			}
		},
		
		downloadAssets: function(downloadCallback) {
			// Actual assets being downloaded after json is parsed.
			console.log(downloadQueue.length + " assets to be downloaded.");
			for (var file in downloadQueue) {
				var path = downloadQueue[file];
				var ext = path.split('.').pop().toLowerCase();
				var asset;
				if (ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif") {
					console.log(ext);
					asset = new Image();
					asset.addEventListener("load", function() {
						successCount += 1;
						if (game.assetManager.isDone()) {
							console.log('All files dowloaded successfully.');
							downloadCallback();
						}
					}, false);
					asset.addEventListener("error", function() {
						errorCount += 1;
						console.log("error: " + this);
						if (game.assetManager.isDone()) {
							console.log('There were errors downloading the files.');
							downloadCallback();
						}
					}, false);
					asset.src = path;
				}
				
				cache[path.split('/').pop()] = asset;
			}
		},
		
		isDone: function() {
			return (downloadQueue.length == successCount + errorCount);
		},
		
		getAsset: function(fileName) {
			return cache[fileName];
		},

		createMap: function(json, callback) {

			game.entities['map'] = game.createEntity({
				image: game.assetManager.getAsset('bg.jpg'),
				screenX: -1600,
				screenY: -400,
				width: json.width * json.tilewidth,
				height: json.height * json.tileheight
			}, [game.component.entity,
				game.component.moveable,
				game.component.map]);

			console.log('map: ' + game.entities['map'].width + 'x' + game.entities['map'].height);

			for (var l = 0; l < json.layers.length; l++) {
				var x = 0;
				var y = 0;

				if (json.layers[l].type === 'objectgroup') {
					console.log(json.layers[l].name);
					var objects = json.layers[l].objects;
					for (var o = 0; o < objects.length; o++) {
						
						console.log(objects[o].type);
						if (json.layers[l].name === 'Collision') {
							game.entities['collision object ' + o] = game.createEntity({
								collision: 'rect',
								x: objects[o].x + (objects[o].width / 2),
								y: objects[o].y + (objects[o].height / 2),
								width: objects[o].width,
								height: objects[o].height,
								r: 100
							},[game.component.entity,
							   game.component.moveable]);
						}
					}
				}
				else if (json.layers[l].type === 'imagelayer') {
					game.entities[json.layers[l].name] = game.createEntity({
						image: game.assetManager.getAsset(json.layers[l].image),
						x: json.layers[l].x,
						y: json.layers[l].y,
						screenX: game.entities['map'].screenX,
						screenY: game.entities['map'].screenY,
						width: game.entities['map'].width,
						height: game.entities['map'].height
					}, [game.component.entity,
						game.component.moveable,
						game.component.drawable,
						game.component.map]);
				}
				else if (json.layers[l].type === 'tilelayer') {
					var layerCanvas = document.createElement('canvas');
					var layerContext = layerCanvas.getContext('2d');
					
					layerCanvas.width = json.width * json.tilewidth;
					layerCanvas.height = json.height * json.tileheight;

					for (var t = 0; t < json.layers[l].data.length; t++) {
						if (t % json.width == 0 && t != 0) {
							y += json.tileheight;
							x = 0;
						}
						if (json.layers[l].data[t] != 0) {
							//console.log(json.tilesets[0].image + ' ' + x + ', ' + y);
							layerContext.drawImage(game.assetManager.getAsset(json.tilesets[0].image), x, y);
						}
						x += json.tilewidth;
					}
					var layerImage = new Image();
					layerImage.src = layerCanvas.toDataURL('image/png');
					game.entities[json.layers[l].name] = game.createEntity({
						image: layerImage,
						screenX: -1600,
						screenY: -400,
						width: layerCanvas.width,
						height: layerCanvas.height
					}, [game.component.entity,
						game.component.moveable,
						game.component.drawable,
						game.component.map]);
					console.log(json.layers[l].name + ': ' + game.entities[json.layers[l].name].width + 'x' + game.entities[json.layers[l].name].height);
				}
			}

			callback();
		}
	};

}());
