
"use strict";

ModuleSystem.registerModule("GameCore/BaseLevel", function(require, exports, module){
	
	function BaseLevel()
	{
		this.gameObjectsArray = [];
		this.gameObjects = {};
	}
	
	BaseLevel.prototype = {
		constructor: BaseLevel,
		
		addGameObject: function addGameObject(obj)
		{
			this.gameObjects[obj.id] = obj;
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
				this.gameObjectsArray[i].update(deltaTime);
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
	};
	
	exports.BaseLevel = BaseLevel;
});