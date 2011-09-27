
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/GameObjects/BoxWithPhysics", function(require, exports, module){
	
	var BaseGameObject = require("/GameCore/BaseGameObject").BaseGameObject;
	var Plugin_WorldObject3D = require("/GameCore/Plugin_WorldObject3D").Plugin_WorldObject3D;
	
	function createBoxWithPhysics(id, pos, size, color, isStatic)
	{
		if(!size)
			size = Vector3.fromPool(1, 1, 0);
					
		var obj = new BaseGameObject(id);
		obj.addPlugin(new Plugin_WorldObject3D(obj));
		if(pos)
			obj.pos = pos;
		
		obj.addPlugin(new PhysicsCore.Plugin_PhysicsBox(obj));
		obj.pluginPhysics.size.x = size.x;
		obj.pluginPhysics.size.y = size.y;
		if(isStatic)
			obj.pluginPhysics.isStatic = true;
		
		obj.addPlugin(new GraphicsCore.Plugin_SimpleColorGraphics2D(obj));
		if(color)
			obj.pluginGraphics.color = color;
		obj.pluginGraphics.width = size.x;
		obj.pluginGraphics.height = size.y;
		
		return obj;
	}
	
	
	exports.createBoxWithPhysics = createBoxWithPhysics;
});
