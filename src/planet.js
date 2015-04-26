var server = require('./server');
var PNGImage = require('pngjs-image');
var gameMath = require('./Math');

exports.Generate = function(chunkx, chunky, n) {
	var radius = 100;

	var image = PNGImage.createImage(radius * 2, radius * 2);
	var alpha = 0;

	for( var x = 0; x < image.getWidth(); x++ ) {
		for ( var y = 0; y < image.getHeight(); y++ ) {
			if (gameMath.distance(x, radius, y, radius) < radius) {
				alpha = 200;
			}
			else {
				alpha = 0;
			}
			image.setAt(
				x,
				y,
				{
					red: Math.floor(Math.random() * (255 - 0)) + 255,
					green: Math.floor(Math.random() * (255 - 0)) + 255,
					blue: Math.floor(Math.random() * (255 - 0)) + 255,
					alpha: alpha
				}
			);
		}
	}
	 
	// Get low level image object with buffer from the 'pngjs' package 
	var pngjs = image.getImage();
	 
	var fileName = chunkx + 'x' + chunky + '-' + n + '.png';

	image.writeImage('../assets/planets/' + fileName, function () {
	    console.log('Written to the file');
	    console.log(server.sockets);
	});
};

//exports.Generate(1, 1, 1);