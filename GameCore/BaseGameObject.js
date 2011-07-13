
"use strict";

ModuleSystem.registerModule(function(){
	
	function BaseGameObject()
	{
		this.pos = Vector3.fromPool(0.0, 1.0, -7.0);
		this.rot = 0;
	}
	
	BaseGameObject.prototype = {
		constructor: BaseGameObject,
		
		
	};
	
	return {BaseGameObject: BaseGameObject};
});

