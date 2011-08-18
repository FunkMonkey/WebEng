
"use strict";

ModuleSystem.registerModule("Engine/Graphics/Camera", function(require, exports, module){
	
	function Camera()
	{
		this.pos = Vector3.fromPool();
	}
	
	Camera.prototype = {
		constructor: Camera,
		
		
	};
	
	exports.Camera = Camera;
});