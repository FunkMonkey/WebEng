
"use strict";

ModuleSystem.registerModule("GameCore/BaseLevel", function(require, exports, module){
	
	/**
	 * BaseLevel: constructor function for a level
	 */
	function BaseLevel()
	{
		this.gameObjectsArray = [];
		this.gameObjects = {};
	}
	
	BaseLevel.prototype = {
		constructor: BaseLevel,
		
		/**
		 * Adds the given gameobject to the level
		 * 
		 * @param   {BaseGameObject} obj  GameObject to add
		 */
		addGameObject: function addGameObject(obj)
		{
			this.gameObjects[obj.id] = obj;
			this.gameObjectsArray.push(obj);
		},
		
		/**
		 * Creates the content of the level
		 */
		create: function create()
		{
			 
		},
		
		// TODO: remove
		loadConfig: function loadConfig()
		{
			for(var i = 0; i < this.gameObjectsArray.length; ++i)
				this.gameObjectsArray[i].loadConfig();
		},
		
		/**
		 * Loads the levels resources (asynchron)
		 * 
		 * @param   {function} callback Function to call when resources have been loaded
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
		
		/**
		 * Initializes the level
		 */
		init: function init()
		{
			for(var i = 0; i < this.gameObjectsArray.length; ++i)
				this.gameObjectsArray[i].init();
		},
		
		/**
		 * Post-Initializes the level
		 */
		postInit: function postInit()
		{
			for(var i = 0; i < this.gameObjectsArray.length; ++i)
				this.gameObjectsArray[i].postInit();
		},
		
		/**
		 * Updates the level
		 * 
		 * @param   {number} dt Time since last frame (in s)
		 */
		update: function update(deltaTime)
		{
			for(var i = 0; i < this.gameObjectsArray.length; ++i)
				this.gameObjectsArray[i].update(deltaTime);
		},
		
		/**
		 * Destroys the level
		 */
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