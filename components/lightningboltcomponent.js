/**
 * Created with IntelliJ IDEA.
 * User: hugofirth
 * Date: 20/04/2013
 * Time: 00:40
 * To change this template use File | Settings | File Templates.
 */

Crafty.c("LightningBolt", {

    _lightningBolt: null,


    //Ready => true so that the component will be able to draw on the canvas
    ready: true,

    //Init function for the component
    init: function() {
        this.addComponent("2D, Canvas, Tween");
    },

    makeBolt: function(player) {
            this._lightningBolt = new LightningBolt(player.getTargetSrcVec(), player.getTargetDestVec(), '#FFFFFF'); // #4545DD


            this.bind('Draw', function(obj) {
                this._lightningBolt.update();
                this._lightningBolt.draw(obj.ctx);
                this.tween({alpha: 0.00});
            });

            this.bind("EnterFrame", function(e) {
                if (this._alpha < 0.1) {
                    this.destroy();
                }
            });

    }


});