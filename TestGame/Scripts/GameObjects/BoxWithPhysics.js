
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/GameObjects/BoxWithPhysics", function(require, exports, module){
	
	var BaseGameObject = require("/GameCore/BaseGameObject").BaseGameObject;
	var Plugin_WorldObject3D = require("/GameCore/Plugin_WorldObject3D").Plugin_WorldObject3D;
	
	/**
	 * Creates a box with physics (and / or graphics) with the given id
	 * 
	 * @param   {string} id    ID of the gameobject
	 * @param   {Object} data  Additional creation-data
	 * 
	 * @returns {BaseGameObject} A new box
	 */
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
		if(!data.noPhysics)
		{
			obj.addPlugin(new PhysicsCore.Plugin_PhysicsBox());
			if(data.physType)
			{
				obj.pluginPhysics.type = data.physType;
			}
			else
			{
				if(data.isStatic)
					obj.pluginPhysics.type = PhysicsCore.b2Body.b2_staticBody;
				else
					obj.pluginPhysics.type = PhysicsCore.b2Body.b2_dynamicBody;
			}
			
			if(data.isSensor)
				obj.pluginPhysics.isSensor = true;
				
			if(data.maskBits)
				obj.pluginPhysics.maskBits = data.maskBits;
			if(data.categoryBits)
				obj.pluginPhysics.categoryBits = data.categoryBits;
		}
		
		// graphics
		if(!data.noGraphics)
		{
			if(data.texturePath)
			{
				obj.addPlugin(new GraphicsCore.Plugin_SimpleTextureGraphics2D());
				obj.pluginGraphics.textureID = data.texturePath;
			}
			else
			{
				obj.addPlugin(new GraphicsCore.Plugin_SimpleColorGraphics2D());
				if(data.color)
					obj.pluginGraphics.color = data.color;
			}
		}
		
		return obj;
	}
	
	
	exports.createBoxWithPhysics = createBoxWithPhysics;
});
