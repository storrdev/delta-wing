var PNGImage = require('pngjs-image');

exports.Generate = function() {
	var radius = 500;

	var image = PNGImage.createImage(radius * 2, radius * 2);

	for( var x = 0; x < image.getWidth(); x++ ) {
		for ( var y = 0; y < image.getHeight(); y++ ) {
			image.setAt(
				x,
				y,
				{
					red: Math.floor(Math.random() * (255 - 0)) + 255,
					green: Math.floor(Math.random() * (255 - 0)) + 255,
					blue: Math.floor(Math.random() * (255 - 0)) + 255,
					alpha: 200
				}
			);
		}
	}
	 
	// Get low level image object with buffer from the 'pngjs' package 
	var pngjs = image.getImage();
	 
	image.writeImage('./out.png', function () {
	    console.log('Written to the file');
	});
};