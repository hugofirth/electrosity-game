Crafty.c("TargetMovementControls", {
    _move: {
      left: false,
      right: false,
      up: false,
      down: false
    },
    StopMoving: function() {
      var move;
      move = this._move;
      return move.right = move.left = move.up = move.down = false;
    },
    TargetMovementControls: function(speed) {
      var move;
      move = this._move;
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
        this.StopMoving();
        return Crafty.trigger('EndMove');
      });

      //Address non standard Collisions (Water, Goal, Key)
      this.onHit("goal", function() {
        move = this._move;
        this.StopMoving();
        Crafty.trigger('EndMove');
        return Crafty.trigger('GoalFound');
      });

      this.onHit("water", function() {
          move = this._move;
          this.StopMoving();
          Crafty.trigger('EndMove');
          return Crafty.trigger('Died');
      });

      this.onHit("key", function() {
        return Crafty.trigger('KeyFound');
      })
      return this.BindControls();
    },
    BindControls: function() {
      var move;
      move = this._move;
      return this.bind('KeyDown', function(key) {
        if (!(move.right || move.left || move.up || move.down)) {
          if (key.keyCode === Crafty.keys.RIGHT_ARROW || key.keyCode === Crafty.keys.D) {
            move.right = true;
          } else if (key.keyCode === Crafty.keys.LEFT_ARROW || key.keyCode === Crafty.keys.A) {
            move.left = true;
          } else if (key.keyCode === Crafty.keys.UP_ARROW || key.keyCode === Crafty.keys.W) {
            move.up = true;
          } else if (key.keyCode === Crafty.keys.DOWN_ARROW || key.keyCode === Crafty.keys.S) {
            move.down = true;
          }
          if (move.right || move.left || move.up || move.down) {
            return Crafty.trigger('StartMove');
          }
        }
      });
    }
  });