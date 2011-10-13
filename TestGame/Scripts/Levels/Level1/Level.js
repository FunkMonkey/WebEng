
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
			var newPos = null;
			
			// ---- ISLAND 1 ----
			var Island_1 = GO_BoxWithPhysics.createBoxWithPhysics("Island_1", { 	size: Vector3.fromPool(19, 1, 0),
																					texturePath: "TestGame/Content/Level1/Island_1.png",
																					isStatic: true});
			Island_1.setPosIn2D(Vector3.fromPool(0, 0, 0), "left-bottom");
			this.addGameObject(Island_1);
			
			var Island_1_Border_Left = GO_BoxWithPhysics.createBoxWithPhysics("Island_1_Border_Left", { 	size: Vector3.fromPool(2, 5, 0),
																											texturePath: "TestGame/Content/Level1/Island_1_Border_Left.png",
																											isStatic	: true});
			Island_1_Border_Left.setPosIn2D(Island_1.getPosIn2D("left-bottom"), "right-bottom");
			this.addGameObject(Island_1_Border_Left);
			
			var Island_1_Sign1 = GO_BoxWithPhysics.createBoxWithPhysics("Island_1_Sign1", { 	size: Vector3.fromPool(2.5, 3.0, 0),
																								texturePath: "TestGame/Content/Level1/Island_1_Sign1b.png",
																								noPhysics: true,
																								isStatic	: true});
			newPos = Island_1.getPosIn2D("left-top");
			newPos.x += 2
			newPos.y -= 0.01;
			Island_1_Sign1.setPosIn2D(newPos, "left-bottom");
			this.addGameObject(Island_1_Sign1);
			
			var Island_1_Sign2 = GO_BoxWithPhysics.createBoxWithPhysics("Island_1_Sign2", {		pos: Vector3.fromPool(9, 2, 0),
																								size: Vector3.fromPool(0.1, 0.1, 0),
																								color: GraphicsCore.Color.fromPool(1,0,0,1),
																								noPhysics: true,
																								isStatic	: true});
			this.addGameObject(Island_1_Sign2);
			
			var Island_1_SS_1 = GO_BoxWithPhysics.createBoxWithPhysics("Island_1_SS_1", { 	size: Vector3.fromPool(0.5, 1, 0),
																							texturePath: "TestGame/Content/Level1/Island_1_SS_1.png",
																							isStatic	: true});
			newPos = Island_1.getPosIn2D("right-top");
			newPos.x -= 4;
			Island_1_SS_1.setPosIn2D(newPos, "left-bottom");
			this.addGameObject(Island_1_SS_1);
			
			var Island_1_Sign3 = GO_BoxWithPhysics.createBoxWithPhysics("Island_1_Sign3", { 	size: Vector3.fromPool(0.1, 0.1, 0),
																								color: GraphicsCore.Color.fromPool(1,0,0,1),
																								noPhysics: true,
																								isStatic	: true});
			newPos = Island_1_SS_1.getPosIn2D("center");
			newPos.y += 2;
			Island_1_Sign3.pos = newPos;
			this.addGameObject(Island_1_Sign3);
			
			var Island_1_DZ_1 = GO_DeathZone.create("Island_1_DZ_1", { 	size: Vector3.fromPool(2, 1, 0)});
			Island_1_DZ_1.setPosIn2D(Island_1.getPosIn2D("right-bottom"), "left-top");
			this.addGameObject(Island_1_DZ_1);
			
			var Island_1_Sign4 = GO_BoxWithPhysics.createBoxWithPhysics("Island_1_Sign4", { 	size: Vector3.fromPool(0.1, 0.1, 0),
																								color: GraphicsCore.Color.fromPool(1,0,0,1),
																								noPhysics: true,
																								isStatic	: true});
			newPos = Island_1_DZ_1.getPosIn2D("center");
			newPos.y += 2;
			Island_1_Sign4.pos = newPos;
			this.addGameObject(Island_1_Sign4);
			
			
			// ---- ISLAND 2 ----
			var Island_2 = GO_BoxWithPhysics.createBoxWithPhysics("Island_2", { 	size: Vector3.fromPool(18, 1, 0),
																					texturePath: "TestGame/Content/Level1/Island_2.png",
																					isStatic	: true});
			Island_2.setPosIn2D(Island_1_DZ_1.getPosIn2D("right-top"), "left-bottom");
			this.addGameObject(Island_2);
			
			var Island_2_SS_1 = GO_BoxWithPhysics.createBoxWithPhysics("Island_2_SS_1", { 	size: Vector3.fromPool(0.5, 1, 0),
																							texturePath: "TestGame/Content/Level1/Island_2_SS_1.png",
																							isStatic	: true});
			var newPos = Island_2.getPosIn2D("left-top")
			newPos.x += 1;
			Island_2_SS_1.setPosIn2D(newPos, "left-bottom");
			this.addGameObject(Island_2_SS_1);
			
			var Island_2_Sign1 = GO_BoxWithPhysics.createBoxWithPhysics("Island_2_Sign1", { 	size: Vector3.fromPool(0.1, 0.1, 0),
																								color: GraphicsCore.Color.fromPool(1,0,0,1),
																								noPhysics: true,
																								isStatic	: true});
			newPos = this.gameObjects["Island_2"].getPosIn2D("left-top");
			newPos.x += 10;
			newPos.y += 2;
			Island_2_Sign1.pos = newPos;
			this.addGameObject(Island_2_Sign1);
			
			var Island_2_SS_2 = GO_BoxWithPhysics.createBoxWithPhysics("Island_2_SS_2", { 	size: Vector3.fromPool(0.5, 1, 0),
																							texturePath: "TestGame/Content/Level1/Island_2_SS_2.png",
																							isStatic	: true});
			newPos = Island_2.getPosIn2D("right-top");
			newPos.x -= 6;
			Island_2_SS_2.setPosIn2D(newPos, "left-bottom");
			this.addGameObject(Island_2_SS_2);
			
			var Island_2_DZ_1 = GO_DeathZone.create("Island_2_DZ_1", { 	size: Vector3.fromPool(2, 1, 0)});
			Island_2_DZ_1.setPosIn2D(Island_2.getPosIn2D("right-bottom"), "left-top");
			this.addGameObject(Island_2_DZ_1);
			
			// ---- ISLAND 3 ----
			var Island_3 = GO_BoxWithPhysics.createBoxWithPhysics("Island_3", { 	size: Vector3.fromPool(8, 1, 0),
																					texturePath: "TestGame/Content/Level1/Island_3.png",
																					isStatic	: true});
			Island_3.setPosIn2D(Island_2_DZ_1.getPosIn2D("right-top"), "left-bottom");
			this.addGameObject(Island_3);
			
			var Island_3_SS_1 = GO_BoxWithPhysics.createBoxWithPhysics("Island_3_SS_1", { 	size: Vector3.fromPool(0.5, 1, 0),
																							texturePath: "TestGame/Content/Level1/Island_3_SS_1.png",
																							isStatic	: true});
			newPos = Island_3.getPosIn2D("left-top");
			newPos.x += 3;
			Island_3_SS_1.setPosIn2D(newPos, "left-bottom");
			this.addGameObject(Island_3_SS_1);
			
			var Island_3_Border_Right = GO_BoxWithPhysics.createBoxWithPhysics("Island_3_Border_Right", { 	size: Vector3.fromPool(2, 5, 0),
																											texturePath: "TestGame/Content/Level1/Island_3_Border_Right.png",
																											isStatic	: true});
			Island_3_Border_Right.setPosIn2D(Island_3.getPosIn2D("right-bottom"), "left-bottom");
			this.addGameObject(Island_3_Border_Right);
			
			var Island_3_Sign1 = GO_BoxWithPhysics.createBoxWithPhysics("Island_3_Sign1", { 	size: Vector3.fromPool(0.1, 0.1, 0),
																								color: GraphicsCore.Color.fromPool(1,0,0,1),
																								noPhysics: true,
																								isStatic	: true});
			newPos = this.gameObjects["Island_3"].getPosIn2D("right-top");
			newPos.x -= 3;
			newPos.y += 1;
			Island_3_Sign1.pos = newPos;
			this.addGameObject(Island_3_Sign1);
			
			
			
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
			var newPos = null;
			
			this.addGameObject(GO_FallingBlock.create("FallingBlock", { 	pos: Vector3.fromPool(9, 8, 0),
																			size: Vector3.fromPool(2, 2, 0),
																			color: GraphicsCore.Color.fromPool(0, 0, 0, 1)}));
			
			var MovingBlock = GO_BoxWithPhysics.createBoxWithPhysics("MovingBlock", { 	size: Vector3.fromPool(0.1, 0.1, 0),
																								color: GraphicsCore.Color.fromPool(1,0,0,1),
																								noPhysics: true,
																								isStatic	: true});
			newPos = this.gameObjects["Island_2"].getPosIn2D("left-top");
			newPos.x += 6;
			MovingBlock.pos = newPos;
			this.addGameObject(MovingBlock);
			
			var Blocker = GO_SeparatingBlock.create("Blocker", { 	pos: Vector3.fromPool(1, 2, 0),
																	size: Vector3.fromPool(0.5, 0.5, 0),
																	color: GraphicsCore.Color.fromPool(0, 1, 0, 1)});
			
			newPos = this.gameObjects["Island_2"].getPosIn2D("left-top");
			newPos.x += 10;
			Blocker.setPosIn2D(newPos, "left-bottom");
			this.addGameObject(Blocker);
			
			var Goal = GO_BoxWithPhysics.createBoxWithPhysics("Goal", { 	size: Vector3.fromPool(0.1, 0.1, 0),
																								color: GraphicsCore.Color.fromPool(1,0,0,1),
																								noPhysics: true,
																								isStatic	: true});
			newPos = this.gameObjects["Island_3"].getPosIn2D("right-top");
			newPos.x -= 3;
			newPos.y += 1;
			Goal.pos = newPos;
			this.addGameObject(Goal);
			
			
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