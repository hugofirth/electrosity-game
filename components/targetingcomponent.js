/**
 * Created with IntelliJ IDEA.
 * User: hugofirth
 * Date: 22/04/2013
 * Time: 14:05
 * To change this template use File | Settings | File Templates.
 */

Crafty.c("Targeting", {

    _targetEntity: null,
    _targetDestVec: null,
    _targetSrcVec: null,

    init: function() {
        this._targetEntity = Crafty.e("2D, Canvas, empty, controls, Collision, SliderMovementControls");
        this._targetEntity.attr({x: this.x*TILE_W, y: this.y*TILE_H});
        this._targetEntity.SliderMovementControls(16); //TODO: Replace SliderMovementControls with custom component

        this.bind("StartMove", function() {
            this._targetSrcVec = new Crafty.math.Vector2D((this._targetEntity.x+(TILE_W/2)), (this._targetEntity.y+(TILE_H/2)));

        });

        this.bind("EndMove", function() {
           this._targetDestVec = new Crafty.math.Vector2D((this._targetEntity.x+(TILE_W/2)), (this._targetEntity.y+(TILE_H/2)));

        });
    },

    setTargetLocation: function(location) {
        this._targetEntity.attr({x: location.x, y: location.y});
    },

    getTargetLocation: function() {
        return {x: this._targetEntity.x, y: this._targetEntity.y};
    },

    getTargetSrcVec: function() {
        return this._targetSrcVec;
    },

    getTargetDestVec: function() {
        return this._targetDestVec;
    }

});