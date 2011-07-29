
ModuleSystem.registerModule(function(){
	
	function BaseGame()
	{
		this.name = "foo";
		this.updateInterval = 50;
		this.updateTimer = null;
		this.gameObjectsArray = [];
		this.gameObjects = {};
	}
	
	BaseGame.functions = {
		
		addGameObject: function addGameObject(obj)
		{
			this.gameObjectsArray.push(obj);
		},
		
		
		create: function create()
		{
			 
		},
		
		
		loadConfig: function loadConfig()
		{
			for(var i = 0; i < this.gameObjectsArray.length; ++i)
				this.gameObjectsArray[i].loadConfig();
		},
		
		/* async 
		   
		*/
		loadResources: function loadResources(callback)
		{
			if(this.gameObjectsArray.length === 0)
				callback();
			
			this._goResLoaded = 0;
			var goCallback = (function goCallback()
				{
					++this._goResLoaded;
					if(this._goResLoaded === this.gameObjectsArray.length)
						callback();
				}).bind(this);
			
			for(var i = 0; i < this.gameObjectsArray.length; ++i)
				this.gameObjectsArray[i].loadResources(goCallback);
		},
		
		
				
		/* Initializes the game
		 *
		 */
		init: function init()
		{
			for(var i = 0; i < this.gameObjectsArray.length; ++i)
				this.gameObjectsArray[i].init();
		},
		
		/* Updates the game
		 *
		 */
		update: function update(deltaTime)
		{
			for(var i = 0; i < this.gameObjectsArray.length; ++i)
				this.gameObjectsArray[i].update(dt);
		},
		
		destroy: function destroy()
		{
			for(var i = 0; i < this.gameObjectsArray.length; ++i)
				this.gameObjectsArray[i].destroy();
		},
		
		/*
		unloadResources: function unloadResources()
		{

		},*/
		
		
		startGameLoop: function startGameLoop()
		{
			if(!this.update)
				throw "No Update Function";
			
			
			this.updateTimer = window.setInterval(this.update.bind(this), this.updateInterval);
			//this.updateTimer = window.setTimeout(this.update.bind(this), 100);
		},
	};
	
	Extension.inherit_auto(BaseGame, Object);
	
	return {BaseGame: BaseGame};
	
});