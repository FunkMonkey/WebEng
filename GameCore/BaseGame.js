
ModuleSystem.registerModule("GameCore/BaseGame", function(require, exports, module){
	
	function BaseGame()
	{
		this.updateInterval = 50;
		this.updateTimer = null;
		this.level = null;
	}
	
	BaseGame.functions = {
		
		create: function create()
		{
			
		},
		
		loadConfig: function loadConfig()
		{
			
		},
		
		loadResources: function loadResources(callback)
		{
			callback();
		},
		
		
		/* Initializes the game
		 *
		 */
		init: function init()
		{
		},
		
		/* Updates the game
		 *
		 */
		update: function update(deltaTime)
		{
			this.level.update(deltaTime);
		},
		
		destroy: function destroy()
		{
			this.unloadCurrentLevel();
		},
		
		/*
		unloadResources: function unloadResources()
		{

		},*/
		
		loadLevel: function loadLevel(moduleID, callback)
		{
			if(this.level)
				this.unloadCurrentLevel();
				
			var LevelClass = require(moduleID).Level;
			
			this.level = new LevelClass();
			this.level.create();
			this.level.loadConfig();
			this.level.init();
			
			this.level.loadResources(callback);
		},
		
		unloadCurrentLevel: function unloadCurrentLevel()
		{
			this.level.destroy();
			this.level = null;
		},
		
		
		
		
		startGameLoop: function startGameLoop()
		{
			if(!this.update)
				throw "No Update Function";
			
			
			this.updateTimer = window.setInterval(this.update.bind(this), this.updateInterval);
			//this.updateTimer = window.setTimeout(this.update.bind(this), 100);
		}
	};
	
	Extension.inherit_auto(BaseGame, Object);
	
	exports.BaseGame = BaseGame;
	
});