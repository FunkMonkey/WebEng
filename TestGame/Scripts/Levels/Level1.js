
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/Levels/Level1", function(require, exports, module){
	
	var BaseLevel = require("/GameCore/BaseLevel").BaseLevel;
	
	var BaseGameObject = require("/GameCore/BaseGameObject").BaseGameObject;
	var Plugin_WorldObject3D = require("/GameCore/Plugin_WorldObject3D").Plugin_WorldObject3D;
	
	var M_Cursor = require("/TestGame/Scripts/GameObjects/Cursor");
	
	function Level1()
	{
		BaseLevel.call(this);
	}
	
	Level1.functions = {
		
		create: function create()
		{
			

			
			// creating objects
			this.testObj = new BaseGameObject();
			//this.addGameObject(this.testObj);
			this.addGameObject(M_Cursor.createCursor());
			
			this.testObj.addPlugin(new Plugin_WorldObject3D(this.testObj));
			this.testObj.pos.z = 0;
			//this.testObj.rot.z = Math.PI;
			//this.testObj.scale.x = 2;
			
			this.testObj.addPlugin(new GraphicsCore.Plugin_SimpleTextureGraphics2D(this.testObj));
			this.testObj.pluginGraphics.textureID = "TestGame/Content/1.jpg";
		},
		
	};
	
	Extension.inherit_auto(Level1, BaseLevel);
	
	exports.Level = Level1;
});