"use strict";

ModuleSystem.registerModule(function(){
	
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

	
	return {Plugin_WorldObject3D: Plugin_WorldObject3D};
	
});