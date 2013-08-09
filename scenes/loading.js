Crafty.scene("loading", function() {
    var loading;
    loading = Crafty.e("2D, DOM, Text");
    loading.attr({
      w: TILE_W * WORLD_W,
      h: (TILE_H * WORLD_H)/2,
      x: 0,
      y: 0
    });
    loading.text("Loading...");
    loading.css({
      "padding-top": (TILE_H * WORLD_H)/2 + "px",
      "text-align": "center",
      "color": "#FFF",
      "background-color": "#000",
      "font-family": "Nothing You Could Do",
      "font-size": "24px"
    });


      return Crafty.load(["img/objects.png", "img/explosions.png", "img/explosions2.png", "img/player.png",
          "img/water.png", "img/start_bg.gif"], function() {
            Crafty.scene('start');
      });
    
  });