ModuleSystem.registerModule("TestGame/Game", function(require, exports){
	
	var BaseGame = require("/GameCore/BaseGame").BaseGame;
	var BaseGameObject = require("/GameCore/BaseGameObject").BaseGameObject;
	var Plugin_WorldObject3D = require("/GameCore/Plugin_WorldObject3D").Plugin_WorldObject3D;
	
	log("start load cursor")
	var M_Cursor = require("Scripts/GameObjects/Cursor");
	log("fin load cursor")
	
	function Game()
	{
		BaseGame.call(this);
		this.name = "foo";
	}
	
	Game.functions = {
		
		create: function create()
		{
			
			var action = InputCore.getAction("OnCameraMove");
			var trigger = action.addMouseButtonTrigger(1, InputCore.MOUSEBUTTON_STATE_DOWN);
			trigger.obligatory = true;
			trigger = action.addMouseMoveTrigger();
			trigger.obligatory = true;
			
			// creating objects
			this.testObj = new BaseGameObject();
			//this.addGameObject(this.testObj);
			this.addGameObject(M_Cursor.createCursor());
		},
		
		loadConfig: function loadConfig()
		{
			this.testObj.addPlugin(new Plugin_WorldObject3D(this.testObj));
			this.testObj.pos.z = 0;
			//this.testObj.rot.z = Math.PI;
			//this.testObj.scale.x = 2;
			
			this.testObj.addPlugin(new GraphicsCore.Plugin_SimpleGraphics2D(this.testObj));
			this.testObj.pluginGraphics.textureID = "TestGame/Content/1.jpg";
		},
				
		/*
		 *
		 */
		update: function update(deltaTime)
		{
			InputCore.update(deltaTime);
			
			var onCameraMove = InputCore.actions["OnCameraMove"];
			if(onCameraMove.isTriggered)
			{
				var pos = GraphicsCore.camera.pos;
				pos.x += onCameraMove.result[0] / GraphicsCore.orthoFactor;
				pos.y -= onCameraMove.result[1] / GraphicsCore.orthoFactor;
			}
			
			BaseGame.prototype.update.call(this, deltaTime);
			
			GraphicsCore.update(deltaTime);
		},
	};
	
	Extension.inherit_auto(Game, BaseGame);
	
	exports.Game = Game;
	
});