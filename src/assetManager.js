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
		}
	};

}());
