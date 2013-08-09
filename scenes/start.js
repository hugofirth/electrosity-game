/**
 * Created with IntelliJ IDEA.
 * User: hugofirth
 * Date: 27/04/2013
 * Time: 13:03
 * To change this template use File | Settings | File Templates.
 */
Crafty.scene("start", function() {
    Crafty.background("#000");

    var background = Crafty.e("2D, DOM, Image")
    background.attr({  w:1280, h:1280, x: 0, y: 0  })
    background.image("img/start_bg.gif", "no-repeat");
    var start;
    start = Crafty.e("2D, DOM, Text, Blink");
    start.attr({
        w: TILE_W * WORLD_W,
        h: 24,
        x: 0,
        y: (TILE_H * WORLD_H)/2
    });
    start.text("Press Any Button");
    start.css({
        "text-align": "center",
        "color": "#FFF",
        "font-family": "Nothing You Could Do",
        "font-size": "24px"
    });
    start.setBlinkFrames(50);
    start.bind('KeyUp', function(){
        Crafty.audio.stop("music");
        loadLevel();
    });

});