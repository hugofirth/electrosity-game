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
	this.scale = this.thickness/8;
};

//Static Variables
Line.colorCache = [];
Line.colorCacheIdx = [];

//Prototype Methods
Line.prototype.draw = function(ctx, color, alpha) {

	var tangent = new Crafty.math.Vector2D(this.vec_dest.clone().subtract(this.vec_src));
	var rotation = this.vec_src.angleTo(this.vec_dest);
	var color = typeof color !== 'undefined' ? color : '#FFFFFF';
	var middleScale = new Crafty.math.Vector2D(tangent.magnitude(), this.scale);
	var halfCircleImage = new Image();
    halfCircleImage.src = Crafty.asset('HalfCircle');
	var lightningSegment = new Image();
    lightningSegment.src =  Crafty.asset('LightningSegment');

        if( color !== '#FFFFFF' ) { //the original image is already white, there is no need to tint

            var idx = Line.colorCacheIdx.indexOf( color );

            if( idx === -1 ) {


                idx = Line.colorCacheIdx.length;
                Line.colorCacheIdx.push( color );

                Line.colorCache.push( tintImage( halfCircleImage, color ) );
                Line.colorCache.push( tintImage( lightningSegment, color ) );

            }

            //Because Javascript doesn't have assoc arrays, we are going to use two arrays, one for the indices, and the other for the values
            halfCircleImage = Line.colorCache[idx * 2];
            lightningSegment = Line.colorCache[idx * 2 + 1];

        }


   	//Time to draw the lightning segment.
    ctx.save();

    ctx.translate( this.vec_src.x, this.vec_src.y );
    ctx.rotate( rotation );

    //draw the main line segment
    ctx.scale( middleScale.x, middleScale.y );
    ctx.drawImage( lightningSegment, 0, -( lightningSegment.height / 2 ) );

    //draw the left circle
    ctx.scale( 1 / middleScale.x, 1 / middleScale.y ); //revert the scale
    ctx.scale( this.scale, this.scale );
    ctx.drawImage( halfCircleImage, -( halfCircleImage.width ), -( halfCircleImage.height / 2 ) );

    //draw the right circle
    ctx.scale( 1 / this.scale, 1 / this.scale );
    ctx.rotate( - rotation ); //revert rotation, if we dont do that, translate will give us an wrong result.
    ctx.translate( this.vec_dest.x - this.vec_src.x, this.vec_dest.y - this.vec_src.y );
    ctx.rotate( rotation + Math.PI); //rotate for the same amount + 180degrees
    ctx.scale( this.scale, this.scale );
    ctx.drawImage( halfCircleImage, -( halfCircleImage.width ), -( halfCircleImage.height / 2 ) );

    ctx.restore();

};


