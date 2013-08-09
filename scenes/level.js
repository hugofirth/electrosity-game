/**
 * Filename: level.js
 * Author: Hugo Firth
 * Description: Central gameplay scene - all entities for each level displayed here.
 */

Crafty.scene("level", function() {

    /** Setup **/
        levelSetup();
        var level = LEVEL;
        var world = generateWorld(level.map); //Load the world map for the level
        var drawing_lightning = false;
        //Start playing ambience now
        Crafty.audio.play("ambience", -1);
        Crafty.audio.play("ambience_spark", -1, 0.05);

    /** /Setup **/

    /** Entities **/


        //Entity Factories
        //Lightning bolt factory
        var addLightningBolt = function(playerEntity) {
            drawing_lightning = true;
            //Calculate bounding box entity for lightning bolt so that all lightning is effected by the tween and destroy
            var boltWidth = Crafty.math.abs(playerEntity.x-playerEntity.getTargetLocation().x)+16;
            var boltHeight =  Crafty.math.abs(playerEntity.y-playerEntity.getTargetLocation().y)+16;

            if(boltWidth<boltHeight){
                boltWidth = (boltWidth*2)+16;
            } else {
                boltHeight = (boltHeight*2)+16;
            }

            var entityOrigin;
            if((playerEntity.x <= playerEntity.getTargetLocation().x) && (playerEntity.y <= playerEntity.getTargetLocation().y)) {
                entityOrigin = {
                    x: playerEntity.x-16,
                    y: playerEntity.y-16
                };
            } else {
                entityOrigin = {
                    x: playerEntity.getTargetLocation().x-16,
                    y: playerEntity.getTargetLocation().y-16
                }
            }

            var lightningBolt = Crafty.e("LightningBolt")
                .attr({
                    w: boltWidth,
                    h: boltHeight,
                    x: entityOrigin.x,
                    y: entityOrigin.y
                })
                .makeBolt(playerEntity);

            return lightningBolt;
         };


        var addExplosion = function(playerEntity, type) {
            var explosion

            switch(type){
                case "dust":
                    explosion = Crafty.e("2D, Canvas, explosiondust, SpriteAnimation");
                    break;
                case "sparks":
                    explosion = Crafty.e("2D, Canvas, explosionsparks, SpriteAnimation");
                    break;
                default:
                    explosion = Crafty.e("2D, Canvas, explosionsparks, SpriteAnimation");
                    break;
            }


                explosion.attr({
                    h: TILE_H,
                    w: TILE_W,
                    x: playerEntity.x,
                    y: playerEntity.y
                })
                .animate("explosion", 0, 0, 6)
                .animate("explosion", 21, 0)
                .bind("AnimationEnd", function(){
                    this.destroy();
                });

        }


        var player = Crafty.e("2D, Canvas, player1, controls, Collision, Targeting, Tween, SpriteAnimation, Delay")
            .attr({
                x: level.player_coords.x*TILE_W,
                y: level.player_coords.y*TILE_H
            })
            .animate("sparking", 0, 0, 2)
            .animate("sparking", 18, -1)
            .bind("EndMove", function() {
                addLightningBolt(this);
                addExplosion(this, "dust");
                if(Math.random()>0.5){
                    Crafty.audio.play("spark", 1, 0.2);
                } else {
                    Crafty.audio.play("spark2", 1, 0.2);
                }
                //Move player entity to position located by target
                this.x = this.getTargetLocation().x;
                this.y = this.getTargetLocation().y;
                addExplosion(this, "sparks");
            })
            .bind("GoalFound", function() {
                this.destroy();
                levelCleanUp();
                incrementLevel();
                loadLevel();
            })
            .bind("Died", function() {
                this.destroy();
                levelCleanUp();
                loadLevel();
            })
            .bind("KeyFound", function() {

                Crafty('key').destroy();
                var door = Crafty('closedhatch');
                var goal;

                console.log({x:door._x, y:door._y});

                this.delay(function() {
                    goal = Crafty.e("2D, Canvas, openhatch, goal");
                    goal.attr({x:door._x, y:door._y});
                    door.destroy();

                }, 5000);
                door.addComponent('goal');
                Crafty.audio.play('door_open', 1, 1.0);

            })
            .setTargetLocation({x: level.player_coords.x*TILE_W, y: level.player_coords.y*TILE_H});


    /** /Entities **/

});