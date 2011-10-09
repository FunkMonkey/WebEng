
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/Levels/Level1/Level", function(require, exports, module){
	
	var BaseLevel = require("/GameCore/BaseLevel").BaseLevel;
	
	var BaseGameObject = require("/GameCore/BaseGameObject").BaseGameObject;
	var Plugin_WorldObject3D = require("/GameCore/Plugin_WorldObject3D").Plugin_WorldObject3D;
	var Plugin_Pickable = require("/TestGame/Scripts/Plugins/Plugin_Pickable").Plugin_Pickable;
	
	var GO_Cursor = require("/TestGame/Scripts/GameObjects/Cursor");
	var GO_BoxWithPhysics = require("/TestGame/Scripts/GameObjects/BoxWithPhysics");
	var GO_DarkSoul = require("/TestGame/Scripts/GameObjects/DarkSoul");
	var GO_SeparatingBlock = require("/TestGame/Scripts/GameObjects/SeparatingBlock");
	var GO_DeathZone = require("/TestGame/Scripts/GameObjects/DeathZone");
	
	var GO_FallingBlock = require("GameObjects/FallingBlock");
	
	function Level()
	{
		BaseLevel.call(this);
	}
	
	Level.functions = {
		
		_createGround: function _createGround()
		{
			var groundColor = GraphicsCore.Color.fromPool(0, 0, 0, 1);
			
			var Ground_left_1 = GO_BoxWithPhysics.createBoxWithPhysics("Ground_left_1", { 	size: Vector3.fromPool(20, 1, 0),
																							color: groundColor.clone(),
																							isStatic: true});
			Ground_left_1.setPosIn2D(Vector3.fromPool(0, 0, 0), "left-bottom");
			this.addGameObject(Ground_left_1);
			
			var Border_left = GO_BoxWithPhysics.createBoxWithPhysics("Border_left", { 	size: Vector3.fromPool(1, 10, 0),
																						color: groundColor.clone(),
																						isStatic	: true})
			Border_left.setPosIn2D(Ground_left_1.getPosIn2D("left-top"), "left-bottom");
			this.addGameObject(Border_left);
			
			var StaticSep1 = GO_BoxWithPhysics.createBoxWithPhysics("StaticSep1", { 	size: Vector3.fromPool(0.5, 2, 0),
																							color: groundColor.clone(),
																							isStatic	: true})
			var newPos = Ground_left_1.getPosIn2D("right-top")
			newPos.x -= 8;
			StaticSep1.setPosIn2D(newPos, "left-bottom");
			this.addGameObject(StaticSep1);
			
			var Ground_left_2 = GO_BoxWithPhysics.createBoxWithPhysics("Ground_left_2", { 	size: Vector3.fromPool(10, 1, 0),
																							color: groundColor.clone(),
																							isStatic	: true})
			var newPos = Ground_left_1.getPosIn2D("right-top")
			newPos.x += 3;
			Ground_left_2.setPosIn2D(newPos, "left-top");
			this.addGameObject(Ground_left_2);
			
			var StaticSep2 = GO_BoxWithPhysics.createBoxWithPhysics("StaticSep2", { 	size: Vector3.fromPool(0.5, 2, 0),
																							color: groundColor.clone(),
																							isStatic	: true})
			var newPos = Ground_left_2.getPosIn2D("left-top")
			newPos.x += 4;
			StaticSep2.setPosIn2D(newPos, "left-bottom");
			this.addGameObject(StaticSep2);
			
			this.addGameObject(GO_BoxWithPhysics.createBoxWithPhysics("test3", {	pos: Vector3.fromPool(2, 2, 0),
																							size: Vector3.fromPool(1, 1, 0),
																							color: GraphicsCore.Color.fromPool(0, 1, 0, 1),
																							isStatic: true}));
			this.addGameObject(GO_BoxWithPhysics.createBoxWithPhysics("test4", {	pos: Vector3.fromPool(3, 3, 0),
																							size: Vector3.fromPool(1, 1, 0),
																							color: GraphicsCore.Color.fromPool(0, 1, 0, 1),
																							isStatic: true}));
			
		},
		
		_createItems: function _createItems()
		{
			this.addGameObject(GO_FallingBlock.create("FallingBlock", { 	pos: Vector3.fromPool(6, 8, 0),
																			size: Vector3.fromPool(3, 3, 0),
																			color: GraphicsCore.Color.fromPool(0, 0, 0, 1)}));
			
			var Sepa1 = GO_SeparatingBlock.create("Sepa1", { 	pos: Vector3.fromPool(1, 2, 0),
																size: Vector3.fromPool(1, 1, 0),
																color: GraphicsCore.Color.fromPool(0, 1, 0, 1)});
			
			this.addGameObject(Sepa1);
			
			Sepa1.setPosIn2D(this.gameObjects["StaticSep2"].getPosIn2D("right-bottom"), "left-bottom");
		},
		
		
		_createDeathZones: function _createDeathZones()
		{
			//this.addGameObject(GO_DeathZone.create("DeathZone1", {	pos: Vector3.fromPool(-3, 1, 0),
			//														size: Vector3.fromPool(2, 2, 0)}));
			//
		},
		
		
		_createLife: function _createLife()
		{
			this.addGameObject(GO_DarkSoul.createDarkSoul("DarkSoul1", {	pos: Vector3.fromPool(2, 2, 0),
																			size: Vector3.fromPool(0.3, 0.3, 0),
																			color: GraphicsCore.Color.fromPool(0, 0, 1, 1)}));
			
			this.addGameObject(GO_DarkSoul.createDarkSoul("DarkSoul2", {	pos: Vector3.fromPool(2, 3, 0),
																			size: Vector3.fromPool(0.3, 0.3, 0),
																			color: GraphicsCore.Color.fromPool(0, 0, 1, 1)}));
			
			
			this.addGameObject(GO_Cursor.createCursor("Cursor"));
		},
		
		
		
		create: function create()
		{
			this.testObj = new BaseGameObject("TestObj");
			this.testObj.addPlugin(new Plugin_WorldObject3D());
			this.testObj.addPlugin(new GraphicsCore.Plugin_SimpleTextureGraphics2D());
			this.testObj.pluginGraphics.textureID = "TestGame/Content/darksoul.png";
			this.testObj.pluginGraphics.width = 2;
			
			this.addGameObject(this.testObj);
			
			// creating objects
			this._createGround();
			this._createDeathZones();
			this._createItems();
			this._createLife();
			
			GraphicsCore.camera.pos.x = -3.8;
			GraphicsCore.camera.pos.y = -3.1;

		},
		
	};
	
	Extension.inherit_auto(Level, BaseLevel);
	
	exports.Level = Level;
});