(function() {

	json = {};
	
	game.xhr = {
	
		parseJSON: function(xhrFile, callback) {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				console.log(xhr.readyState);
				if (xhr.readyState==4 && xhr.status==200) {
					//This is where I need to implement the parsing of the .tmx file. fun.
					json = JSON.parse(xhr.responseText);
					callback();
				}
			}
			xhr.open("GET", xhrFile, true);
			xhr.send();
		},
		
		getJSON: function() {
			return json;
		}
	
	};

}());
