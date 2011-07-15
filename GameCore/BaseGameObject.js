
"use strict";

ModuleSystem.registerModule(function(){
	
	function BaseGameObject()
	{
		this.plugins = [];
	}
	
	BaseGameObject.prototype = {
		constructor: BaseGameObject,
		
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
		
		init: function init()
		{
			for(var i = 0; i < this.plugins.length; ++i)
				if(this.plugins[i].init)
					this.plugins[i].init();
		},
		
		update: function update(dt)
		{
			for(var i = 0; i < this.plugins.length; ++i)
				if(this.plugins[i].update)	// TODO: performance
					this.plugins[i].update(dt);
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
		},
		
	};
	
	return {BaseGameObject: BaseGameObject};
});

