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
		},

		rectToRectIntersection: function(rect1, rect2) {
			var xDistance = rect2.x - rect1.x;

			if (xDistance + (rect1.width/2) > -rect2.width/2 && xDistance - (rect1.width/2) < rect2.width/2) {

				var yDistance = rect2.y - rect1.y;

				if (yDistance + (rect1.height/2) > -rect2.height/2 && yDistance - (rect1.height/2) < rect2.height/2) {
					return true;
				}
			}

			return false;
		}

	}

}());