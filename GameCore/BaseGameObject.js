
"use strict";

ModuleSystem.registerModule("GameCore/BaseGameObject", function(require, exports){
	
	function BaseGameObject(id)
	{
		this.id = id;
		this.plugins = [];
		this.updatablePlugins = [];
	}
	
	BaseGameObject.prototype = {
		constructor: BaseGameObject,
		
		// is needed?
		loadConfig: function loadConfig()
		{
			for(var i = 0; i < this.plugins.length; ++i)
				if(this.plugins[i].loadConfig)
					this.plugins[i].loadConfig();
		},
		
		/* async 
		   
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
		
		// TODO: preInit
		
		init: function init()
		{
			for(var i = 0; i < this.plugins.length; ++i)
				if(this.plugins[i].init)
					this.plugins[i].init();
		},
		
		postInit: function postInit()
		{
			for(var i = 0; i < this.plugins.length; ++i)
				if(this.plugins[i].postInit)
					this.plugins[i].postInit();
		},
		
		update: function update(dt)
		{
			for(var i = 0; i < this.updatablePlugins.length; ++i)
				//if(this.plugins[i].update)	// TODO: performance
					this.updatablePlugins[i].update(dt);
		},
		
		destroy: function destroy()
		{
			for(var i = 0; i < this.plugins.length; ++i)
				if(this.plugins[i].destroy)
					this.plugins[i].destroy();
		},
		
		addPlugin: function addPlugin(plugin)
		{
			this.plugins.push(plugin);
			if(plugin.update)
				this.updatablePlugins.push(plugin);
			
			if(plugin.onAddedTo)
				plugin.onAddedTo(this);
		},
		
	};
	
	exports.BaseGameObject = BaseGameObject;
});

