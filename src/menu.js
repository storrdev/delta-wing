(function() {
	
	game.component.menu = {

		shape: 'rect',
		x: game.width/2,
		y: game.height/2,
		urlLoaded: false,

		update: function() {
			if (this.urlLoaded === false) {
				var that = this;
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						var menuDiv = document.createElement('div');
						menuDiv.style.width = that.width + 'px';
						menuDiv.style.height = that.height + 'px';
						menuDiv.style.left = that.x - (that.width/2) + 'px';
						menuDiv.style.top = that.y - (that.height/2) + 'px';
						menuDiv.style.position = 'absolute';
						menuDiv.id = that.id;
						document.body.appendChild(menuDiv);
						menuDiv.innerHTML = xhr.responseText;

					}
				}
				xhr.open("GET", this.url, true);
				xhr.send();
				this.urlLoaded = true;
			}
		}

	};
	
}());