/**
  * Prototype: Line
  *	Author: Hugo Firth
  * Description:
  */

//Constructor & Declaration
var LightningBolt = function(vec_src, vec_dest, color) {
	    this.alpha = 1;
        this.fadeRate = 0.05;
        this.segments = this.createBolt(vec_src, vec_dest, 1);
        this.color = color;

};

LightningBolt.prototype.createBolt = function(vec_src, vec_dest, thickness) {

	var results = [];
	var tangent = new Crafty.math.Vector2D(vec_dest.clone().subtract(vec_src));
	var normal = vec_dest.getNormal(vec_src);
	var magnitude = tangent.magnitude();


	var positions = [];
	positions.push(0);

	for(var i = 0; i < magnitude/4; i++){
		positions.push(Math.random());
	}

	positions.sort();

	var SWAY = 80;
	var JAGGEDNESS = 1/SWAY;

	var prevPoint = new Crafty.math.Vector2D(vec_src);
	var prevDisplacement = 0;

	for(var i = 1; i < positions.length; i++) {
		var position = positions[i];
		var scale = (magnitude * JAGGEDNESS) * (position - positions[i - 1]);
		var envelope = 0.7; //(position > 0.95) ? 8 * (1 - position) : 1;
		var displacement = Rand(-SWAY, SWAY);

		displacement -= (displacement - prevDisplacement) * (1 - scale);
        displacement = displacement * envelope;

        var scaled_tangent = new Crafty.math.Vector2D(tangent.clone().scale(position));
        var scaled_normal = new Crafty.math.Vector2D(normal.clone().scale(displacement));
        var point = new Crafty.math.Vector2D(vec_src.clone().add(scaled_tangent.add(scaled_normal)));

        results.push(new Line(prevPoint, point, thickness));

        prevPoint = new Crafty.math.Vector2D(point);
        prevDisplacement = displacement;
	}

    //console.log(results);
	results.push(new Line(prevPoint, vec_dest, thickness));
	return results;
};

LightningBolt.prototype.isComplete = function() {
	 if(this.alpha <= 0) {
         return true;
     } else {
         return false;
     }
};

LightningBolt.prototype.draw = function(ctx) {

	if(this.isComplete()){
        Crafty.trigger("LightningDone");
        return;
    }

    var oldGlobalAlpha = ctx.globalAlpha;

    ctx.globalAlpha = this.alpha;


    for( var i = 0; i < this.segments.length; i++ ) {

        this.segments[i].draw( ctx, this.color, this.alpha );

    }

    ctx.globalAlpha = oldGlobalAlpha;
};

LightningBolt.prototype.update = function() {

	this.alpha -= this.fadeRate;
};

