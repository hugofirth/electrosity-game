Crafty.c("SliderMovementControls", {
    __move: {
      left: false,
      right: false,
      up: false,
      down: false
    },
    StopSlide: function() {
      var move;
      move = this.__move;
      return move.right = move.left = move.up = move.down = false;
    },
    SliderMovementControls: function(speed) {
      var move;
      if (speed == null) {
        speed = 4;
      }
      move = this.__move;
      this.bind('EnterFrame', function() {
        if (move.right || move.left || move.up || move.down) {
          this.trigger('Move');
        }
        if (move.right) {
          return this.attr({
            x: this.x + speed
          });
        } else if (move.left) {
          return this.attr({
            x: this.x - speed
          });
        } else if (move.up) {
          return this.attr({
            y: this.y - speed
          });
        } else if (move.down) {
          return this.attr({
            y: this.y + speed
          });
        }
      });
      this.collision();
      this.onHit("Solid", function() {

        if (move.right) {
          this.attr({
            x: this.x - speed
          });
        } else if (move.left) {
          this.attr({
            x: this.x + speed
          });
        } else if (move.up) {
          this.attr({
            y: this.y + speed
          });
        } else if (move.down) {
          this.attr({
            y: this.y - speed
          });
        }
        this.StopSlide();
        return Crafty.trigger('EndMove');
      });
      this.onHit("exit", function() {
        move = this.__move;
        return this.StopSlide;
      });
      return this.BindKeyControls();
    },
    BindKeyControls: function() {
      var move;
      move = this.__move;
      return this.bind('KeyDown', function(e) {
        if (!(move.right || move.left || move.up || move.down)) {
          if (e.keyCode === Crafty.keys.RIGHT_ARROW || e.keyCode === Crafty.keys.D) {
            move.right = true;
          } else if (e.keyCode === Crafty.keys.LEFT_ARROW || e.keyCode === Crafty.keys.A) {
            move.left = true;
          } else if (e.keyCode === Crafty.keys.UP_ARROW || e.keyCode === Crafty.keys.W) {
            move.up = true;
          } else if (e.keyCode === Crafty.keys.DOWN_ARROW || e.keyCode === Crafty.keys.S) {
            move.down = true;
          }
          if (move.right || move.left || move.up || move.down) {
            return Crafty.trigger('StartMove');
          }
        }
      });
    }
  });