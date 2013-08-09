window.onload = (function() {

	//Declare Globals
	var TILE_H = window.TILE_H = 16;
	var TILE_W = window.TILE_W = 16;
	var WORLD_H = window.WORLD_H = 21;
	var WORLD_W = window.WORLD_W = 41;
	var VIEWPORT_H = window.VIEWPORT_H = 336;
	var VIEWPORT_W = window.VIEWPORT_W = 656;
	var LEVEL = window.LEVEL = null;

	//Globals for Lightning effect as Crafty Art class lacking
	var HALFCIRCLE_H = window.HALFCIRCLE_H = 113;
	var HALFCIRCLE_W = window.HALFCIRCLE_W = 53;
	var LIGHTSGMT_H = window.LIGHTSGMT_H = 113;
	var LIGHTSGMT_W = window.LIGHTSGMT_W = 1;

	//Global Functions 
	var Rand = window.Rand = function( from, to ) {
        return ( Math.random() * ( to - from + 1 ) + from ) | 0;
    };

    var incrementLevel = window.incrementLevel = function() {
        var oldHash = window.location.hash.substring(1);
        oldHash = ((typeof oldHash !== 'undefined') && (oldHash)) ? oldHash : 0;
        var newHash = parseInt(oldHash)+1;
        if(newHash<=9){
            window.location.hash = '#' + newHash;
        } else {
            Crafty.scene('victorious');
        }
    }

    var loadLevel = window.loadLevel = function() {
        /**
         * Some levels not of original design.
         * Permission for usage requested in all cases.
         */
	    var hash = window.location.hash.substring(1);
        var level_no = ((typeof hash !== 'undefined') && (hash)) ? hash : 0;
        $.ajax({
            url: 'https://api.mongolab.com/api/1/databases/electrosity/collections/levels?q={"level_no":'+ level_no +'}&fo=true&apiKey=VG7ilP6zMqpW1BZhppDdJLVE4Cl3uTbh',
            dataType: 'json',
            success: function(data) {
                window.LEVEL = data;
                Crafty.scene('level');
            }
        });

  	};

    var pauseLevel = window.pauseGame = function(key) {
        if (key.keyCode === Crafty.keys.P) {

            if(!Crafty.isPaused()){
                var pause = Crafty.e("2D, DOM, Text, Pause, Delay")
                    .attr({
                        w: TILE_W * WORLD_W,
                        h: (TILE_H * WORLD_H)/2,
                        x: 0,
                        y: 0,
                        alpha: 0.6
                    })
                    .text("Paused")
                    .css({
                        "padding-top": (TILE_H * WORLD_H)/2 + "px",
                        "text-align": "center",
                        "color": "#FFF",
                        "background-color": "#000",
                        "font-family": "Nothing You Could Do",
                        "font-size": "24px"
                    })
                    .delay(function(){Crafty.pause();}, 1);
                Crafty.audio.pause('ambience');
                Crafty.audio.pause('ambience_spark');
                Crafty.audio.play('music', -1);
            } else {
                Crafty.audio.stop('music');
                Crafty.audio.unpause('ambience');
                Crafty.audio.unpause('ambience_spark');
                Crafty('Pause').destroy();
                Crafty.pause();
            }


        }
    };

    var muteLevel = window.muteLevel = function(key) {
        if (key.keyCode === Crafty.keys.M) {

           Crafty.audio.toggleMute();
           if(Crafty.audio.muted) {
               var mute = Crafty.e("2D, DOM, Text, Mute, Persist")
                    .attr({
                        w: TILE_W *5,
                        h: 18,
                        x: 0,
                        y: 0,
                        alpha: 0.6
                    })
                    .text("Muted")
                    .css({
                        "padding-top": "5px",
                        "text-align": "center",
                        "color": "#FFF",
                        "background-color": "#000",
                        "font-family": "Nothing You Could Do",
                        "font-size": "18px"
                    });
           } else {
                Crafty('Mute').destroy();
           }
        }
    };

    var restartLevel = window.restartLevel = function(key) {
        if (key.keyCode === Crafty.keys.R) {
            unbindRestartEvent();
            Crafty.scene('level');
        }
    };

    //Global functions for the binding and unbinding of event and keyboard listeners
  	var unbindHashEvent = window.unbindHashEvent = function() {
    	return Crafty.removeEvent(this, window, "hashchange", loadLevel);
  	};

  	var bindHashEvent = window.bindHashEvent = function() {
    	return Crafty.addEvent(this, window, "hashchange", loadLevel);
  	};

    var bindPauseEvent = window.bindPauseEvent = function() {
        Crafty.bind('KeyUp', pauseLevel);
    };

    var unbindPauseEvent = window.unbindPauseEvent = function() {
        Crafty.unbind('KeyUp', pauseLevel);
    };

    var bindRestartEvent = window.bindRestartEvent = function() {
        Crafty.bind('KeyUp', restartLevel);
    };

    var unbindRestartEvent = window.unbindRestartEvent = function() {
        Crafty.unbind('KeyUp', restartLevel);
    };

    var bindMuteEvent = window.bindMuteEvent = function() {
        Crafty.bind('KeyUp', muteLevel);
    };

    var unbindMuteEvent = window.unbindMuteEvent = function() {
        Crafty.unbind('KeyUp', muteLevel);
    };

    var levelCleanUp = window.levelCleanUp = function() {
        unbindPauseEvent();
        unbindRestartEvent();
        unbindMuteEvent();
    };

    var levelSetup = window.levelSetup = function() {
        bindPauseEvent();
        bindRestartEvent();
        bindMuteEvent();
    };

  	var generateWorld = window.generateWorld = function(map) {
	    var x = 0;
	    var y = 0;
	    var map_rows = map.split("\n");
	    for ( var i = 0; i<map_rows.length; i++) {
	      var row = map_rows[i];
	      var cells = row.split("");
	      for (var j = 0; j<row.length; j++) {
	        var cell = cells[j];
	        var coords = {
	          'x': x * TILE_W,
	          'y': y * TILE_H
	        };
	        switch (cell) {
	          case "0":
                var tile = Crafty.e("2D, Canvas, floor");
                tile.attr(coords);
            	break;
	          case "1":
	            var tile = Crafty.e("2D, Canvas, wall, Solid");
                tile.attr(coords);
	            break;
	          case "2":
	            var tile = Crafty.e("2D, Canvas, openhatch, goal");
                tile.attr(coords);
	            break;
	          case "3":
                var floortile = Crafty.e("2D, Canvas, floor");
                floortile.attr(coords);
	            var tile = Crafty.e("2D, Canvas, key, key, SpriteAnimation");
                tile.attr(coords);
                tile.animate("bounce", 0, 0, 6);
                tile.animate("bounce", 40, -1);
	            break;
	          case "4":
	            var tile = Crafty.e("2D, Canvas, closedhatch, Solid");
                tile.attr(coords);
	            break;
	          case "5":
	            var tile = Crafty.e("2D, Canvas, water1, water, SpriteAnimation");
                tile.attr(coords);
                tile.animate("current", 0, 0, 2);
                tile.animate("current", 80, -1);
	            break;
	          default:
	            break;
	        }
	        x++;
	      }
	      x = 0;
	      y++;
	    }
  	};

    //Function to Tint image on Canvas in real time
    //based on: http://stackoverflow.com/a/4231508/710693
    var tintImage = window.tintImage = function tintImage( image, tintColor ) {

            //create the offscreen buffers
            var buffer1 = document.createElement('canvas');
            var buffer1Ctx = buffer1.getContext('2d');
            var buffer2 = document.createElement('canvas');
            var buffer2Ctx = buffer2.getContext('2d');
			
            buffer2.width = buffer1.width  = image.width;
            buffer2.height= buffer1.height = image.height;

            //fill buffer1 with the tint color
            buffer1Ctx.fillStyle = tintColor;
            buffer1Ctx.fillRect( 0, 0, buffer1.width, buffer1.height );

            //destination atop makes a result with an alpha channel identical to fg
          	//but with all pixels retaining their original color
            buffer1Ctx.globalCompositeOperation = "destination-atop";
            buffer1Ctx.drawImage( image, 0, 0 );

            //to tint the image, draw it first
            buffer2Ctx.drawImage( image, 0, 0 );

            //then set the global alpha to the amound that you want to tint it, and draw the buffer1 directly on top of it.
            buffer2Ctx.globalAlpha = 0.3;
            buffer2Ctx.drawImage( buffer1, 0, 0 );

            return buffer2;
    }

	//Start Crafty
	Crafty.init();
	//Initialise Crafty's Canvas Element with a set size. CSS rules define positioning
	Crafty.canvas.init();
	Crafty.viewport.init(VIEWPORT_W, VIEWPORT_H);
	//Disable clampToEntities for performance reasons.
	Crafty.viewport.clampToEntities = false;

	//Declare Crafty Environment Sprites
	Crafty.sprite(TILE_W, TILE_H, "img/objects.png", {
		empty: [11,1],
		floor: [6,1],
		wall : [1,0],
		openhatch : [1,1],
        closedhatch: [2,1]
	});
    Crafty.sprite(TILE_W, TILE_H, "img/key.png", {
       key:[0,0]
    });
	//Declare Crafty Water Sprites
	Crafty.sprite(TILE_W, TILE_H, "img/water.png", {
		water1: [0,0],
		water2: [1,0],
		water3: [2,0],
		waterCorner: [3,0],
		waterEdge: [4,0]
	});
	//Declare Crafty Explosion Sprites
	Crafty.sprite(TILE_W, TILE_H, "img/explosions.png", {
		explosiondust: [0,0]
	});
    Crafty.sprite(TILE_W, TILE_H, "img/explosions2.png", {
        explosionsparks: [0,0]
    });

    Crafty.sprite(TILE_W, TILE_H, "img/player.png", {
        player1: [0,0],
        player2: [1,0],
        player3: [2,0]
    });

    //Load audio assets
    Crafty.audio.add("spark", "sounds/spark.ogg");
    Crafty.audio.add("spark2", "sounds/spark2.ogg");
    Crafty.audio.add("ambience", "sounds/ambience.ogg");
    Crafty.audio.add("ambience_spark", "sounds/ambience_spark.ogg");
    Crafty.audio.add("music", "sounds/music.ogg");
    Crafty.audio.add("door_open", "sounds/door_open.ogg");


    Crafty.audio.play("music");

	//Load and cache lightning bolt assets for custom drawing
	Crafty.asset('LightningSegment', 'img/lightning-segment-2.png');
	Crafty.asset('HalfCircle', 'img/half-circle-2.png');

	//Load the Loading Scene
	Crafty.scene("loading");
});