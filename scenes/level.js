Crafty.scene("level", function() {
	var hash = window.location.hash.substring(1);;
	var level_no = typeof hash !== 'undefined' ? hash : 0;
	var level = LEVELS[level_no];
	var world = generateWorld(level.map);
	var player = Crafty.e("2D, DOM, player, controls, Collision, SliderMovementControls, Tween, SpriteAnimation");
    player.attr({x: level.player_coords.x*TILE_W, y: level.player_coords.y*TILE_H});
    player.animate("fadeOut", 0, 1, 5);
    player.animate("fadeIn", 5, 1, 10);
    player.bind("StartMove", function() {
      if (!this.isPlaying("fadeOut")) {
        return player.animate("fadeOut", 2, 0);
      }
    });
    player.bind("EndMove", function() {
      player.stop();
      return player.animate("fadeIn", 2, 0);
    });
    player.SliderMovementControls();
});