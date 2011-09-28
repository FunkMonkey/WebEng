"use strict";

ModuleSystem.registerModule("GameCore/Plugin_WorldObject3D", function(require, exports){
	
	function Plugin_WorldObject3D()
	{
		this.dontCallUpdate = true;
	}
	
	
	Plugin_WorldObject3D.prototype = {
		constructor: Plugin_WorldObject3D,
		
		onAddedTo: function onAddedTo(gameObj)
		{
			this.gameObj = gameObj;
			this.gameObj.pluginWorldObject3D = this;
			
			this.gameObj.pos = Vector3.fromPool();
			this.gameObj.rot = Vector3.fromPool();
			this.gameObj.scale = Vector3.fromPool(1.0, 1.0, 1.0);
		}
	};

	
	exports.Plugin_WorldObject3D = Plugin_WorldObject3D;
	
});