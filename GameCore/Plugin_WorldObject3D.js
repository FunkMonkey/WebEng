"use strict";

ModuleSystem.registerModule("GameCore/Plugin_WorldObject3D", function(require, exports){
	
	function Plugin_WorldObject3D(gameObj)
	{
		this.gameObj = gameObj;
		this.gameObj.pos = Vector3.fromPool();
		this.gameObj.rot = Vector3.fromPool();
		this.gameObj.scale = Vector3.fromPool(1.0, 1.0, 1.0);
	}
	
	/*
	Plugin_WorldObject3D.prototype = {
		constructor: Plugin_WorldObject3D,
		

	};*/

	
	exports.Plugin_WorldObject3D = Plugin_WorldObject3D;
	
});