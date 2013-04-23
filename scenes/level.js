/**
 * Filename: level.js
 * Author: Hugo Firth
 * Description: Central gameplay scene - all entities for each level displayed here.
 */

Crafty.scene("level", function() {

    /** Setup **/
        var level = LEVEL;
        var world = generateWorld(level.map); //Load the world map for the level
        var drawing_lightning = false;

    /** /Setup **/

    /** Entities **/


        //Entity Factories
        //Lightning bolt factory
        var addLightningBolt = function(playerEntity) {
            drawing_lightning = true;
            var boltWidth = Crafty.math.abs(playerEntity.x-playerEntity.getTargetLocation().x)+1;
            var boltHeight =  Crafty.math.abs(playerEntity.y-playerEntity.getTargetLocation().y)+1;

            if(boltWidth<boltHeight){
                boltWidth =(boltWidth*2)+16;
            } else {
                boltHeight =(boltHeight*2)+16;
            }

            var entityOrigin = {
                x: (playerEntity.x<playerEntity.getTargetLocation().x)?(playerEntity.x+16):(playerEntity.getTargetLocation().x-16),
                y: (playerEntity.y<playerEntity.getTargetLocation().y)?(playerEntity.y+16):(playerEntity.getTargetLocation().y-16)
            }

            Crafty.e("LightningBolt")
                .attr({
                    w: boltWidth,
                    h: boltHeight,
                    x: entityOrigin.x,
                    y: entityOrigin.y
                })
                .makeBolt(playerEntity);
         };


        var player = Crafty.e("2D, Canvas, player1, controls, Collision, Targeting, Tween, SpriteAnimation");
        player.attr({x: level.player_coords.x*TILE_W, y: level.player_coords.y*TILE_H});
        player.setTargetLocation({x: level.player_coords.x*TILE_W, y: level.player_coords.y*TILE_H});
        player.animate("sparking", 0, 0, 2);
        player.animate("sparking", 16, -1);
        player.bind("EndMove", function() {

            addLightningBolt(this);

            //Move player entity to position located by target
            this.x = this.getTargetLocation().x;
            this.y = this.getTargetLocation().y;
        });


    /** /Entities **/

});