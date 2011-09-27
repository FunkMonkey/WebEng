
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/Levels/Level1", function(require, exports, module){
	
	var BaseLevel = require("/GameCore/BaseLevel").BaseLevel;
	
	var BaseGameObject = require("/GameCore/BaseGameObject").BaseGameObject;
	var Plugin_WorldObject3D = require("/GameCore/Plugin_WorldObject3D").Plugin_WorldObject3D;
	var Plugin_Pickable = require("/TestGame/Scripts/Plugins/Plugin_Pickable").Plugin_Pickable;
	
	var GO_Cursor = require("/TestGame/Scripts/GameObjects/Cursor");
	var GO_BoxWithPhysics = require("/TestGame/Scripts/GameObjects/BoxWithPhysics");
	var GO_DarkSoul = require("/TestGame/Scripts/GameObjects/DarkSoul");
	
	function Level1()
	{
		BaseLevel.call(this);
	}
	
	Level1.functions = {
		
		create: function create()
		{
			// creating objects
			//this.testObj = new BaseGameObject();
			//this.addGameObject(this.testObj);
			this.addGameObject(GO_Cursor.createCursor("Cursor"));
			this.addGameObject(GO_BoxWithPhysics.createBoxWithPhysics("Ground", Vector3.fromPool(0, 0, 0), Vector3.fromPool(5, 0.5, 0), GraphicsCore.Color.fromPool(0, 0, 0, 1), true));
			
			/*var testbox = GO_BoxWithPhysics.createBoxWithPhysics(Vector3.fromPool(0, 2, 0), Vector3.fromPool(0.3, 0.3, 0), GraphicsCore.Color.fromPool(1, 0, 0, 1), false);
			testbox.addPlugin(new Plugin_Pickable(testbox));
			this.addGameObject(testbox);
			
			testbox = GO_BoxWithPhysics.createBoxWithPhysics(Vector3.fromPool(-1, 2, 0), Vector3.fromPool(0.3, 0.3, 0), GraphicsCore.Color.fromPool(1, 0, 0, 1), false);
			testbox.addPlugin(new Plugin_Pickable(testbox));
			this.addGameObject(testbox);*/
			
			var darksoul = GO_DarkSoul.createDarkSoul("DarkSoul1", Vector3.fromPool(-1, 2, 0), Vector3.fromPool(0.3, 0.3, 0), GraphicsCore.Color.fromPool(1, 0, 0, 1));
			//testbox.addPlugin(new Plugin_Pickable(darksoul));
			this.addGameObject(darksoul);
			
			var darksoul2 = GO_DarkSoul.createDarkSoul("DarkSoul2", Vector3.fromPool(1, 2, 0), Vector3.fromPool(0.3, 0.3, 0), GraphicsCore.Color.fromPool(1, 0, 0, 1));
			//testbox.addPlugin(new Plugin_Pickable(darksoul));
			this.addGameObject(darksoul2);
			
			//this.testObj.addPlugin(new Plugin_WorldObject3D(this.testObj));
			//this.testObj.pos.z = 0;
			//
			//this.testObj.addPlugin(new GraphicsCore.Plugin_SimpleTextureGraphics2D(this.testObj));
			//this.testObj.pluginGraphics.textureID = "TestGame/Content/1.jpg";
		},
		
	};
	
	Extension.inherit_auto(Level1, BaseLevel);
	
	exports.Level = Level1;
});