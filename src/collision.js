(function() {
	
	game.collision = {

		circleRectIntersects: function(circle, rect) {
		    var circleDistance = {};

		    circleDistance.x = Math.abs(circle.x - rect.x);
		    circleDistance.y = Math.abs(circle.y - rect.y);

		    if (circleDistance.x > (rect.width/2 + circle.r)) { return false; }
		    if (circleDistance.y > (rect.height/2 + circle.r)) { return false; }

		    if (circleDistance.x <= (rect.width/2)) { return true; } 
		    if (circleDistance.y <= (rect.height/2)) { return true; }

		    cornerDistance_sq = (circleDistance.x - rect.width/2)^2 +
		                         (circleDistance.y - rect.height/2)^2;

		    return (cornerDistance_sq <= (circle.r^2));
		}
	}

}());