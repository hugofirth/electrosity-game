Crafty.scene("victorious", function() {
    Crafty.background("#000");
    var victorious;
    victorious = Crafty.e("2D, DOM, Text");
    victorious.attr({
        w: TILE_W * WORLD_W,
        h: (TILE_H * WORLD_H)/2,
        x: 0,
        y: 0
    });
    victorious.text("To Be Continued");
    victorious.css({
        "padding-top": (TILE_H * WORLD_H)/2 + "px",
        "text-align": "center",
        "color": "#FFF",
        "background-color": "#000",
        "font-family": "Nothing You Could Do",
        "font-size": "24px"
    });


});
