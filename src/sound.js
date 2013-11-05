(function() {
	
	console.log('sound component loaded.');

	game.component.sound = {

		play: function() {
			var playSound = audioContext.createBufferSource();
			playSound.buffer = this.buffer;
			playSound.connect(audioContext.destination);
			playSound.start(0);
		}

	}

}());