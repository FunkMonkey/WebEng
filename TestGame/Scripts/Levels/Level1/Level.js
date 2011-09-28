
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/Levels/Level1/Level", function(require, exports, module){
	
	var BaseLevel = require("/GameCore/BaseLevel").BaseLevel;
	
	var BaseGameObject = require("/GameCore/BaseGameObject").BaseGameObject;
	var Plugin_WorldObject3D = require("/GameCore/Plugin_WorldObject3D").Plugin_WorldObject3D;
	var Plugin_Pickable = require("/TestGame/Scripts/Plugins/Plugin_Pickable").Plugin_Pickable;
	
	var GO_Cursor = require("/TestGame/Scripts/GameObjects/Cursor");
	var GO_BoxWithPhysics = require("/TestGame/Scripts/GameObjects/BoxWithPhysics");
	var GO_DarkSoul = require("/TestGame/Scripts/GameObjects/DarkSoul");
	var GO_DeathZone = require("/TestGame/Scripts/GameObjects/DeathZone");
	
	function Level()
	{
		BaseLevel.call(this);
	}
	
	Level.functions = {
		
		create: function create()
		{
			// creating objects
			this.addGameObject(GO_DeathZone.create("DeathZone1", {	pos: Vector3.fromPool(-3, 1, 0),
																	size: Vector3.fromPool(2, 2, 0)}));
			
			
			this.addGameObject(GO_Cursor.createCursor("Cursor"));
			this.addGameObject(GO_BoxWithPhysics.createBoxWithPhysics("Ground", { 	pos: Vector3.fromPool(0, 0, 0),
																					size: Vector3.fromPool(5, 0.5, 0),
																					color: GraphicsCore.Color.fromPool(0, 0, 0, 1),
																					isStatic: true}));
			
			this.addGameObject(GO_DarkSoul.createDarkSoul("DarkSoul1", {	pos: Vector3.fromPool(-1, 2, 0),
																			size: Vector3.fromPool(0.3, 0.3, 0),
																			color: GraphicsCore.Color.fromPool(0, 0, 1, 1)}));
			
			this.addGameObject(GO_DarkSoul.createDarkSoul("DarkSoul2", {	pos: Vector3.fromPool(1, 2, 0),
																			size: Vector3.fromPool(0.3, 0.3, 0),
																			color: GraphicsCore.Color.fromPool(0, 0, 1, 1)}));
			
			//this.testObj.addPlugin(new Plugin_WorldObject3D(this.testObj));
			//this.testObj.pos.z = 0;
			//
			//this.testObj.addPlugin(new GraphicsCore.Plugin_SimpleTextureGraphics2D(this.testObj));
			//this.testObj.pluginGraphics.textureID = "TestGame/Content/1.jpg";
		},
		
	};
	
	Extension.inherit_auto(Level, BaseLevel);
	
	exports.Level = Level;
});