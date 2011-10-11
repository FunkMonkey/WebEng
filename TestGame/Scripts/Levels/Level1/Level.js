
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
			
			
			// ---- ISLAND 1 ----
			var Island_1 = GO_BoxWithPhysics.createBoxWithPhysics("Island_1", { 	size: Vector3.fromPool(15, 1, 0),
																							color: groundColor.clone(),
																							isStatic: true});
			Island_1.setPosIn2D(Vector3.fromPool(0, 0, 0), "left-bottom");
			this.addGameObject(Island_1);
			
			var Island_1_Border_Left = GO_BoxWithPhysics.createBoxWithPhysics("Island_1_Border_Left", { 	size: Vector3.fromPool(1, 10, 0),
																						color: groundColor.clone(),
																						isStatic	: true})
			Island_1_Border_Left.setPosIn2D(Island_1.getPosIn2D("left-top"), "left-bottom");
			this.addGameObject(Island_1_Border_Left);
			
			var Island_1_SS_1 = GO_BoxWithPhysics.createBoxWithPhysics("Island_1_SS_1", { 	size: Vector3.fromPool(0.5, 1, 0),
																							color: groundColor.clone(),
																							isStatic	: true})
			var newPos = Island_1.getPosIn2D("right-top")
			newPos.x -= 3;
			Island_1_SS_1.setPosIn2D(newPos, "left-bottom");
			this.addGameObject(Island_1_SS_1);
			
			var Island_1_DZ_1 = GO_DeathZone.create("Island_1_DZ_1", { 	size: Vector3.fromPool(2, 1, 0)});
			Island_1_DZ_1.setPosIn2D(Island_1.getPosIn2D("right-bottom"), "left-top");
			this.addGameObject(Island_1_DZ_1);
			
			
			// ---- ISLAND 2 ----
			var Island_2 = GO_BoxWithPhysics.createBoxWithPhysics("Island_2", { 	size: Vector3.fromPool(10, 1, 0),
																							color: groundColor.clone(),
																							isStatic	: true});
			Island_2.setPosIn2D(Island_1_DZ_1.getPosIn2D("right-top"), "left-bottom");
			this.addGameObject(Island_2);
			
			var Island_2_SS_1 = GO_BoxWithPhysics.createBoxWithPhysics("Island_2_SS_1", { 	size: Vector3.fromPool(0.5, 1, 0),
																							color: groundColor.clone(),
																							isStatic	: true})
			var newPos = Island_2.getPosIn2D("left-top")
			newPos.x += 2;
			Island_2_SS_1.setPosIn2D(newPos, "left-bottom");
			this.addGameObject(Island_2_SS_1);
			
			
			
			
			
			
			
			
			// ------------------ TESTING ------------------
			
			
			//this.addGameObject(GO_BoxWithPhysics.createBoxWithPhysics("test3", {	pos: Vector3.fromPool(2, 2, 0),
			//																				size: Vector3.fromPool(1, 1, 0),
			//																				color: GraphicsCore.Color.fromPool(0, 1, 0, 1),
			//																				isStatic: true}));
			//
			//this.addGameObject(GO_BoxWithPhysics.createBoxWithPhysics("test4", {	pos: Vector3.fromPool(3, 3, 0),
			//																				size: Vector3.fromPool(1, 1, 0),
			//																				color: GraphicsCore.Color.fromPool(0, 1, 0, 1),
			//																				isStatic: true}));
			//this.addGameObject(GO_BoxWithPhysics.createBoxWithPhysics("test4", {	pos: Vector3.fromPool(3, 2, 0),
			//																				size: Vector3.fromPool(1, 1, 0),
			//																				color: GraphicsCore.Color.fromPool(0, 1, 1, 1),
			//																				isStatic: true}));
			//this.addGameObject(GO_SeparatingBlock.create("Sepa1", { 	pos: Vector3.fromPool(2, 3, 0),
			//															size: Vector3.fromPool(1, 1, 0),
			//															color: GraphicsCore.Color.fromPool(0, 1, 0, 1)}));
			
		},
		
		_createItems: function _createItems()
		{
			this.addGameObject(GO_FallingBlock.create("FallingBlock", { 	pos: Vector3.fromPool(7, 8, 0),
																			size: Vector3.fromPool(2, 2, 0),
																			color: GraphicsCore.Color.fromPool(0, 0, 0, 1)}));
			
			var Sepa1 = GO_SeparatingBlock.create("Sepa1", { 	pos: Vector3.fromPool(1, 2, 0),
																size: Vector3.fromPool(1, 1, 0),
																color: GraphicsCore.Color.fromPool(0, 1, 0, 1)});
			
			Sepa1.setPosIn2D(this.gameObjects["Island_2_SS_1"].getPosIn2D("right-bottom"), "left-bottom");
			this.addGameObject(Sepa1);
			
			
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