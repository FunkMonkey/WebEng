
ModuleSystem.registerModule("GameCore/BaseGame", function(require, exports, module){
	
	if(!window.requestAnimationFrame)
	{
		if(window.mozRequestAnimationFrame)
			window.requestAnimationFrame = window.mozRequestAnimationFrame;
		else if(window.webkitRequestAnimationFrame)
			window.requestAnimationFrame = window.webkitRequestAnimationFrame
	}
	
	/**
	 * BaseGame: Constructor function for a basic game
	 */
	function BaseGame()
	{
		this.updateInterval = 1/60;
		this.updateTimer = null;
		this.level = null;
		//this.lastUpdate = Date.now();
		this.lastUpdate = window.mozAnimationStartTime;
		this.updateCount = 0;
		
		this.isInGameLoop = false;
	}
	
	BaseGame.functions = {
		
		/**
		 * Creates the game
		 */
		create: function create()
		{
			
		},
		
		// todo: remove
		loadConfig: function loadConfig()
		{
			
		},
		
		/**
		 * Loads the games resources (asynchron)
		 * 
		 * @param   {function} callback Function to call when resources have been loaded
		 */
		loadResources: function loadResources(callback)
		{
			callback();
		},
		
		
		/**
		 * Initializes the game
		 */
		init: function init()
		{
		},
		
		/**
		 * Updates the game
		 * 
		 * @param   {number} dt Time since last frame (in s)
		 */
		update: function update(dt)
		{
			this.level.update(dt);
		},
		
		/**
		 * Called before the update-Function to determine dt and stuff
		 * 
		 * @param   {number} timestamp Timestamp of the current time
		 */
		_updateCall: function _updateCall(timestamp)
		{
			if(!this.isInGameLoop)
				return;
			
			// calc dt
			var timer = new Engine.Timers.PhaseTimer();
			++this.updateCount;
			var dt = (timestamp - this.lastUpdate) / 1000;
			this.lastUpdate = timestamp;
			this.lastUpdateInS = timestamp / 1000;
			
			// update the game
			this.update(dt);
			
			// request the next frame
			window.requestAnimationFrame(this._boundUpdateCall);
			//timer.finishPhase("All");
			//timer.print(log);
			//log("frame: " + this.updateCount);
		},
		
		/**
		 * Destroys the level
		 */
		destroy: function destroy()
		{
			if(this.isInGameLoop)
				throw "Stop GameLoop first";
			
			this.unloadCurrentLevel();
		},
		
		/*
		unloadResources: function unloadResources()
		{

		},*/
		
		/**
		 * Loads the level with the given id
		 * 
		 * @param   {string}   moduleID  Level to load
		 * @param   {function} callback  Function to call when level has been loaded
		 */
		loadLevel: function loadLevel(moduleID, callback)
		{
			if(this.isInGameLoop)
				throw "Stop GameLoop first";
			
			if(this.level)
				this.unloadCurrentLevel();
				
			var LevelClass = require(moduleID).Level;
			
			this.levelModuleID = moduleID;
			
			// creating the level
			this.level = new LevelClass();
			this.level.create();
			
			this.level.loadResources((function resCallBack(){
					this.level.loadConfig();
					this.level.init();
					this.level.postInit();
					callback();
				}.bind(this)));
		},
		
		/**
		 * Unloads the current level
		 */
		unloadCurrentLevel: function unloadCurrentLevel()
		{
			if(this.isInGameLoop)
				throw "Stop GameLoop first";
			
			if(!this.level)
				return;
			
			this.level.destroy();
			this.level = null;
		},
		
		/**
		 * Starts the game-loop
		 */
		startGameLoop: function startGameLoop()
		{
			if(!this.update)
				throw "No Update Function";
			
			this.isInGameLoop = true;
			
			this._boundUpdateCall = this._updateCall.bind(this);
			
			this.lastUpdate = window.mozAnimationStartTime;
			window.requestAnimationFrame(this._boundUpdateCall);
			
			//this.updateTimer = window.setInterval(this._updateCall.bind(this), this.updateInterval);
			//this.updateTimer = window.setTimeout(this.update.bind(this), 100);
		},
				
		
		/**
		 * Stops the gameloop
		 * 
		 * @returns {Type} Description
		 */
		stopGameLoop: function stopGameLoop()
		{
			this.isInGameLoop = false;
		},
	};
	
	Extension.inherit_auto(BaseGame, Object);
	
	exports.BaseGame = BaseGame;
	
});