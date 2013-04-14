Notes:

Event Listener attached to protagonist entity which listens for keyboard events. 
Invisible agent moves until collision, fires an event with the eventual stopping point co-ords.
Lightning bolt entity of appropriate size then drawn with custom draw function.
The init of the lightning bolt entity (maybe wrapped in prototype and returning an entity as in Q) should create segments.
the draw method of the lightning bolt entity should loop through segments calling their individual draw functions. 
Once finished should fire another event that can trigger cleanup and display player sprite in final position.

Todo:

Replace Slider Movement with custom built
Put in Restart Event
Lookup Recipes in Crafty Google group for Lighting
Add in Event to increment level upon hitting exit
Find tutorial js framework
Implement Tween animations and lightning entity for movement
Scale down graphics
Fix playing first level with no hash
Look into Timers
Look into High Scores (StarMelt - MongoLab)
Look into remote storage of levels (MongoLab)
Find name of puzzle type
Look up puzzles in pokemon games
