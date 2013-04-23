Crafty.scene("loading", function() {
    var loading;
    var script;
    loading = Crafty.e("2D, DOM, Text");
    loading.attr({
      w: TILE_W * WORLD_W,
      h: 20,
      x: 0,
      y: (TILE_H * WORLD_H) / 2 - 10
    });
    loading.text("Loading...");
    loading.css({
      "text-align": "center",
      "color": "#FFF"
    });

      return Crafty.load(["img/sprites.png"], function() {
        loadLevel();
        return bindHashEvent();
      });
    
  });