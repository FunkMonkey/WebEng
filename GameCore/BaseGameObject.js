
"use strict";

ModuleSystem.registerModule("GameCore/BaseGameObject", function(require, exports){
	
	/**
	 * BaseGameObject: constructor function for a gameobject
	 * 
	 * @param   {string} id ID of the gameobject
	 */
	function BaseGameObject(id)
	{
		this.id = id;
		this.plugins = [];
		this.updatablePlugins = [];
	}
	
	BaseGameObject.prototype = {
		constructor: BaseGameObject,
		
		// is needed?
		// todo: remove!
		loadConfig: function loadConfig()
		{
			for(var i = 0; i < this.plugins.length; ++i)
				if(this.plugins[i].loadConfig)
					this.plugins[i].loadConfig();
		},
		
		/**
		 * Loads the gameobjects resources (asynchron)
		 * 
		 * @param   {function} callback Function to call when resources have been loaded
		 */
		loadResources: function loadResources(callback)
		{
			this._plugResLoaded = 0;
			
			if(this.plugins.length === 0)
				callback(this);
			
			var plugCallback = (function plugCallback()
				{
					++this._plugResLoaded;
					if(this._plugResLoaded === this.plugins.length)
						callback(this);
				}).bind(this);
			
			for(var i = 0; i < this.plugins.length; ++i)
				if(this.plugins[i].loadResources)
					this.plugins[i].loadResources(plugCallback);
				else
					plugCallback(this.plugins[i]);
		},
		
		/**
		 * Initializes the gameobject
		 */
		init: function init()
		{
			for(var i = 0; i < this.plugins.length; ++i)
				if(this.plugins[i].init)
					this.plugins[i].init();
		},
		
		/**
		 * Post-Initializes the gameobject
		 */
		postInit: function postInit()
		{
			for(var i = 0; i < this.plugins.length; ++i)
				if(this.plugins[i].postInit)
					this.plugins[i].postInit();
		},
		
		/**
		 * Updates the gameobject
		 * 
		 * @param   {number} dt Time since last frame (in s)
		 */
		update: function update(dt)
		{
			for(var i = 0; i < this.updatablePlugins.length; ++i)
				this.updatablePlugins[i].update(dt);
		},
		
		/**
		 * Destroys the gameobject
		 */
		destroy: function destroy()
		{
			for(var i = 0; i < this.plugins.length; ++i)
				if(this.plugins[i].destroy)
					this.plugins[i].destroy();
		},
		
		/**
		 * Adds the given plugin to the gameobject
		 * 
		 * @param   {Plugin} plugin Plugin to add
		 */
		addPlugin: function addPlugin(plugin)
		{
			this.plugins.push(plugin);
			
			// for performance-reasons, there is a list for updatable plugins
			if(plugin.update)
				this.updatablePlugins.push(plugin);
			
			// inform the plugin it has been added to a gameobject
			if(plugin.onAddedTo)
				plugin.onAddedTo(this);
		},
		
	};
	
	exports.BaseGameObject = BaseGameObject;
});

