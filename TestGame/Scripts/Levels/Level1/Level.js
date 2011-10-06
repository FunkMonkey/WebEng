
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
	
	var GO_FallingBlock = require("GameObjects/FallingBlock");
	
	function Level()
	{
		BaseLevel.call(this);
	}
	
	Level.functions = {
		
		_createGround: function _createGround()
		{
			var groundColor = GraphicsCore.Color.fromPool(0, 0, 0, 1);
			
			var Ground_left_1 = GO_BoxWithPhysics.createBoxWithPhysics("Ground_left_1", { 	pos: Vector3.fromPool(0, 0, 0),
																							size: Vector3.fromPool(10, 1, 0),
																							color: groundColor.clone(),
																							isStatic: true});
			this.addGameObject(Ground_left_1);
			
			var Border_left = GO_BoxWithPhysics.createBoxWithPhysics("Border_left", { 	size: Vector3.fromPool(1, 10, 0),
																						color: groundColor.clone(),
																						isStatic	: true})
			Border_left.setPosIn2D(Ground_left_1.getPosIn2D("left-top"), "left-bottom");
			this.addGameObject(Border_left);
			
			var Ground_left_2 = GO_BoxWithPhysics.createBoxWithPhysics("Ground_left_2", { 	size: Vector3.fromPool(10, 1, 0),
																							color: groundColor.clone(),
																							isStatic	: true})
			var newPos = Ground_left_1.getPosIn2D("right-top")
			newPos.x += 3;
			Ground_left_2.setPosIn2D(newPos, "left-top");
			this.addGameObject(Ground_left_2);
			
		},
		
		_createItems: function _createItems()
		{
			this.addGameObject(GO_FallingBlock.create("FallingBlock", { 	pos: Vector3.fromPool(2, 8, 0),
																			size: Vector3.fromPool(3, 3, 0),
																			color: GraphicsCore.Color.fromPool(0, 0, 0, 1)}));
			
		},
		
		
		_createDeathZones: function _createDeathZones()
		{
			//this.addGameObject(GO_DeathZone.create("DeathZone1", {	pos: Vector3.fromPool(-3, 1, 0),
			//														size: Vector3.fromPool(2, 2, 0)}));
			//
		},
		
		
		_createLife: function _createLife()
		{
			this.addGameObject(GO_DarkSoul.createDarkSoul("DarkSoul1", {	pos: Vector3.fromPool(-1, 2, 0),
																			size: Vector3.fromPool(0.3, 0.3, 0),
																			color: GraphicsCore.Color.fromPool(0, 0, 1, 1)}));
			
			//this.addGameObject(GO_DarkSoul.createDarkSoul("DarkSoul2", {	pos: Vector3.fromPool(-1, 3, 0),
			//																size: Vector3.fromPool(0.3, 0.3, 0),
			//																color: GraphicsCore.Color.fromPool(0, 0, 1, 1)}));
			//
			//
			this.addGameObject(GO_Cursor.createCursor("Cursor"));
		},
		
		
		
		create: function create()
		{
			/*this.testObj = new BaseGameObject("TestObj");
			this.testObj.addPlugin(new Plugin_WorldObject3D());
			this.testObj.addPlugin(new GraphicsCore.Plugin_SimpleTextureGraphics2D());
			this.testObj.pluginGraphics.textureID = "TestGame/Content/1.jpg";
			this.testObj.pluginGraphics.width = 2;
			
			this.addGameObject(this.testObj);*/
			
			// creating objects
			this._createGround();
			this._createDeathZones();
			this._createItems();
			this._createLife();
			
			GraphicsCore.camera.pos.x = 1.1;
			GraphicsCore.camera.pos.y = -2.57;

		},
		
	};
	
	Extension.inherit_auto(Level, BaseLevel);
	
	exports.Level = Level;
});