/**
  * Prototype: Line
  *	Author: Hugo Firth
  * Description:
  */

//Constructor & Declaration
var LightningBolt = function(vec_src, vec_dest) {
	    this.alpha = 1f;
        this.fadeOutRate = 0.03;
        this.segments = this.createBolt(vec_src, vec_dest, 1);
};

LightningBolt.prototype.createBolt = function(vec_src, vec_dest, thickness) {
	var results = [];
	var tangent = vec_dest.subtract(vec_src);
	var normal = tangent.getNormal();
	var magnitude = tangent.magnitude();

	var positions = [];
	positions.push(0);

	for(var i = 0; i < magnitude/4; i++){
		positions.push(Rand(0,1));
	}

	positions.sort();

	var SWAY = 80;
	var JAGGEDNESS = 1/SWAY;

	var prevpoint = vec_src;
	var prevDisplacement = 0;

	for(var i = 1; i < positions.length; i++) {
		var position = positions[i];
		var scale = (magnitude * JAGGEDNESS) * (position - positions[i - 1]);
		var envelope = position > 0.95 ? 20 * (1 - position) : 1;
		var displacement = Rand(-SWAY, SWAY);

		displacement -= (displacement - prevDisplacement) * (1 - scale);
        displacement = displacement * envelope;

        var point = vec_src + position * tangent + displacement * normal;
        results.push(new Line(prevpoint, point, thickness));
        prevPoint = point;
        prevDisplacement = displacement;
	}

	results.push(new Line(prevpoint, vec_dest, thickness));

	return results;
};

LightningBolt.prototype.isComplete = function() {
	return this.alpha <= 0;
};

LightningBolt.prototype.draw = function(ctx) {
	if(this.isComplete) { return; }

    var oldGlobalAlpha = ctx.globalAlpha;

    //we are going to use the globalAlpha property to make the fadeIn
    //its the only *easy* way to fadeIn an image on the canvas.
    ctx.globalAlpha = this.alpha;

    for( var i = 0; i < this.segments.length; i++ ) {

        this.segments[i].draw( ctx, this.color );

    }

    ctx.globalAlpha = oldGlobalAlpha;
};

LightningBolt.prototype.update = function() {
	this.alpha -= this.fadeRate;
};