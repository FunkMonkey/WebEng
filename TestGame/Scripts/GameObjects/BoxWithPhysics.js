
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/GameObjects/BoxWithPhysics", function(require, exports, module){
	
	var BaseGameObject = require("/GameCore/BaseGameObject").BaseGameObject;
	var Plugin_WorldObject3D = require("/GameCore/Plugin_WorldObject3D").Plugin_WorldObject3D;
	
	function createBoxWithPhysics(id, data)
	{
		if(!data)
			data = {};
		
		if(!data.size)
			data.size = Vector3.fromPool(1, 1, 0);
					
		var obj = new BaseGameObject(id);
		
		// world-object
		obj.addPlugin(new Plugin_WorldObject3D());
		if(data.pos)
			obj.pos = data.pos;
		obj.size = data.size;
		
		// physics
		obj.addPlugin(new PhysicsCore.Plugin_PhysicsBox());
		if(data.isStatic)
			obj.pluginPhysics.isStatic = true;
		if(data.isSensor)
			obj.pluginPhysics.isSensor = true;
		
		// graphics
		if(!data.noGraphics)
		{
			obj.addPlugin(new GraphicsCore.Plugin_SimpleColorGraphics2D());
			if(data.color)
				obj.pluginGraphics.color = data.color;
		}
		
		return obj;
	}
	
	
	exports.createBoxWithPhysics = createBoxWithPhysics;
});
