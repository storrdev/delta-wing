(function() {

    game.component.drawable = {
        draw: function() {
        	if (this.image) {
	        	var offsetX = 0;
	        	var offsetY = 0;
	        	game.context.save();
	            	game.context.translate(this.screenX, this.screenY);
					if (this.angle) {
						game.context.rotate(this.angle);
					}
					if (this.offsetX) {
						offsetX = this.offsetX;
					}
					if (this.offsetY) {
						offsetY = this.offsetY;
					}
					game.context.drawImage(this.image, offsetX, offsetY);
	            game.context.restore();
        	}
        	else if (this.shape == 'rect') {
        		var x = this.x - (this.width/2);
        		var y = this.y - (this.height/2);
                if (this.offsetY) {
                    y = y + this.offsetY;
                }
        		game.context.beginPath();
        		game.context.fillStyle = this.fillColor;
        		game.context.strokeStyle = this.borderColor;
                game.context.lineWidth = 2;
        		game.context.rect(x, y, this.width, this.height);
        		game.context.fill();
        		game.context.stroke();
        	}

        	if (this.name) {
        		//game.context.beginPath();
        		game.context.fillStyle = "blue";
  				game.context.font = "14px Arial";
  				game.context.fillText(this.name, (this.screenX + (this.width/2)), (this.screenY + (this.height/2)));
        		//game.context.rect(x, y, 10, 10);
        		//game.context.fill();
        		//console.log(this.name + ': ' + this.screenX + ',' + this.screenY);
        	}

            if (this.text) {
                var x = this.x;
                var y = this.y + 4;
                if (this.offsetY) {
                    y = y + this.offsetY;
                }
                game.context.fillStyle = this.borderColor;
                game.context.font = "bold 14px Arial";
                game.context.textAlign = 'center';

                game.context.fillText(this.text, x, y);
            }

            if (this.label) {
                game.context.fillStyle = this.color;
                game.context.font = 'bold 14px Arial';
                game.context.textAlign = this.align;
                game.context.fillText(this.label, this.x, this.y);
            }
        }
    }

}());
