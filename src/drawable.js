(function() {

    game.component.drawable = {
        draw: function() {
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
    }

}());
