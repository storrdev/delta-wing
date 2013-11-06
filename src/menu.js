(function(){
	
	window.menu = {

		load: function() {

			game.canvas = document.createElement("canvas");
			game.canvas.width = game.width;
			game.canvas.height = game.height;
			game.context = game.canvas.getContext("2d");

			document.body.appendChild(game.canvas);

		}

	}

}());