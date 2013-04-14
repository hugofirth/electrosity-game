/**
  * Prototype: Line
  *	Author: Hugo Firth
  * Description:
  */

//Constructor & Declaration
var Line = function(vec_src, vec_dest, thickness) {
	//Public Fields
	//vector_src, vector_dest are of type Crafty.math.Vector2D
	this.vec_src = vec_src;
	this.vec_dest = vec_dest;
	this.thickness = typeof thickness !== 'undefined' ? thickness : 1;
	this.scale = thickness/8;
};

//Static Variables
Line.colorCache = [];
Line.colorCacheIdx = [];

//Prototype Methods
Line.prototype.draw = function(ctx, color) {
	
	var tangent = this.vec_dest.subtract(this.vec_src);
	var rotation = this.vec_dest.angleTo(this.vec_src);
	var capOrigin = new Crafty.math.Vector2D(HALFCIRCLE_W, HALFCIRCLE_H/2);
	var middleOrigin = new Crafty.math.Vector2D(0, LIGHTSMGT_H/2);
	var color = typeof color !== 'undefined' ? color : '#FFFFFF';
	var middleScale = new Crafty.math.Vector2D(tangent.magnitude(), this.scale);
	var halfCircleImage = Crafty.assets('HalfCircle');
	var lightningSegment = Crafty.assets('LightningSegment');


	if( color !== '#FFFFFF' ) { //the original image is already white, there is no need to tint

        var idx = Line.colorCacheIdx.indexOf( color );

        if( idx === -1 ) {

            idx = Line.colorCacheIdx.length;
            Line.colorCacheIdx.push( color );

            Line.colorCache.push( tintImage( Crafty.assets('HalfCircle'), color ) );
            Line.colorCache.push( tintImage( Crafty.assets('LightningSegment'), color ) );

        }

        //Because Javascript doesn't have assoc arrays, we are going to use two arrays, one for the indices, and the other for the values
        halfCircleImage = Line.colorCache[idx * 2];
        lightningSegment = Line.colorCache[idx * 2 + 1];

    }

   	//Time to draw the lightning segment.
    ctx.save();

    ctx.translate( vec_src.x, vec_src.y );
    ctx.rotate( rotation );

    //draw the main line segment
    ctx.scale( middleScale.x, middleScale.y );
    ctx.drawImage( lightningSegment, 0, -( LIGHTSMGT_H / 2 ) );

    //draw the left circle
    ctx.scale( 1 / middleScale.x, 1 / middleScale.y ); //revert the scale
    ctx.scale( this.scale, this.scale );
    ctx.drawImage( halfCircleImage, -( HALFCIRCLE_W ), -( HALFCIRCLE_H / 2 ) );

    //draw the right circle
    ctx.scale( 1 / this.scale, 1 / this.scale );
    ctx.rotate( - rotation ); //revert rotation, if we dont do that, translate will give us an wrong result.
    ctx.translate( vec_dest.x - vec_src.x, vec_dest.y - vec_src.y );
    ctx.rotate( rotation + Math.PI ); //rotate for the same amout + 180degrees
    ctx.scale( this.scale, this.scale );
    ctx.drawImage( halfCircleImage, -( HALFCIRCLE_W ), -( HALFCIRCLE_H / 2 ) );

    ctx.restore();

};

//Entity Factory to create lightningbolt objects

//Entity Factory creates entity of certain size - or maybe prototype wrapper as in Q

//Then in draw method of Lightning bolt entity loop to create Line objects
//(with custom Draw function in each line using passed context)

