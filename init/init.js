window.onload = (function() {

	//Declare Globals
	var TILE_H = window.TILE_H = 16;
	var TILE_W = window.TILE_W = 16;
	var WORLD_H = window.WORLD_H = 21;
	var WORLD_W = window.WORLD_W = 41;
	var VIEWPORT_H = window.VIEWPORT_H = 672;
	var VIEWPORT_W = window.VIEWPORT_W = 1312;
	var LEVEL = window.LEVEL = null;
    var PAUSED = window.PAUSED = false;

	//Globals for Lightning effect as Crafty Art class lacking
	var HALFCIRCLE_H = window.HALFCIRCLE_H = 113;
	var HALFCIRCLE_W = window.HALFCIRCLE_W = 53;
	var LIGHTSGMT_H = window.LIGHTSGMT_H = 113;
	var LIGHTSGMT_W = window.LIGHTSGMT_W = 1;

	//Global Functions 
	var Rand = window.Rand = function( from, to ) {
        return ( Math.random() * ( to - from + 1 ) + from ) | 0; //generate lookup table beforehand?
    };

    var loadLevel = window.loadLevel = function() {

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

    var pauseLevel = window.pauseGame = function() {
          //TODO: Display Hidden div over the top
    };

    var restartLevel = window.restartLevel = function() {
         //TODO: Call level scene again
    };

    //Global functions for the binding and unbinding of event and keyboard listeners
  	var unbindHashEvent = window.unbindHashEvent = function() {
    	return Crafty.removeEvent(this, window, "hashchange", loadLevel);
  	};

  	var bindHashEvent = window.bindHashEvent = function() {
    	return Crafty.addEvent(this, window, "hashchange", loadLevel);
  	};

    var bindPauseEvent = window.bindPauseEvent = function() {
        //TODO: add keyboard listener for pause (p)
    };

    var unbindPauseEvent = window.unbindPauseEvent = function() {
        //TODO: remove keyboard listener for pause
    };

    var bindRestartEvent = window.bindRestartEvent = function() {
        //TODO: add keyboard listener for restart (r)
    };

    var unbindRestartEvent = window.unbindRestartEvent = function() {
        //TODO: remove keyboard listener for restart
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
            	break;
	          case "1":
	            var tile = Crafty.e("2D, Canvas, wall, Solid");
	            break;
	          case "2":
	            var tile = Crafty.e("2D, Canvas, empty, exit");
	            break;
	          case "3":
	            var tile = Crafty.e("2D, Canvas, key");
	            break;
	          case "4":
	            var tile = Crafty.e("2D, Canvas, door, Solid");
	            break;
	          case "5":
	            var tile = Crafty.e("2D, Canvas, water1, SpriteAnimation");
                tile.animate("current", 0, 0, 2);
                tile.animate("current", 80, -1);
	            break;
	          default:
	            var tile = Crafty.e("2D, DOM, pink");
	        }
	        tile.attr(coords);
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
	Crafty.viewport.init(VIEWPORT_H, VIEWPORT_W);
	//Disable clampToEntities for performance reasons.
	Crafty.viewport.clampToEntities = false;

	//Declare Crafty Environment Sprites
	Crafty.sprite(TILE_W, TILE_H, "img/objects.png", {
		empty: [11,1],
		floor: [6,1],
		wall : [1,0],
		key : [1,1]
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
		explosion1: [0,0],
		explosion2: [1,0],
		explosion3: [2,0],
		explosion4: [3,0],
		explosion5: [4,0],
		explosion6: [5,0],
		explosion7: [6,0]
	});
    Crafty.sprite(TILE_W, TILE_H, "img/player.png", {
        player1: [0,0],
        player2: [1,0],
        player3: [2,0]
    })


	//Load and cache lightning bolt assets for custom drawing
	Crafty.asset('LightningSegment', 'img/lightning-segment-2.png');
	Crafty.asset('HalfCircle', 'img/half-circle-2.png');

	//Load the Loading Scene
	Crafty.scene("loading");
});