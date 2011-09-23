ModuleSystem.registerModule("TestGame/Game", function(require, exports){
	
	var BaseGame = require("/GameCore/BaseGame").BaseGame;

	
	function Game()
	{
		BaseGame.call(this);
	}
	
	Game.functions = {
		
		init: function init()
		{
			BaseGame.prototype.init.call(this);
			
			var action = null;
			var trigger = null;
			
			action = InputCore.getAction("OnMouseDown");
			trigger = action.addMouseButtonTrigger(1, InputCore.MOUSEBUTTON_STATE_DOWN);
			trigger.obligatory = true;
			
			action = InputCore.getAction("OnCameraMove");
			trigger = action.addMouseButtonTrigger(1, InputCore.MOUSEBUTTON_STATE_DOWN);
			trigger.obligatory = true;
			
			trigger = action.addMouseMoveTrigger();
			trigger.obligatory = true;
		},
		
		
		/*
		 *
		 */
		update: function update(dt)
		{
			InputCore.update(dt);
			this.mouseWorldPos = GraphicsCore.screenPosToWorldPos(InputCore.mousePos, 0);
			
			var onCameraMove = InputCore.actions["OnCameraMove"];
			/*if(onCameraMove.isTriggered)
			{
				var pos = GraphicsCore.camera.pos;
				pos.x += onCameraMove.result[0] / GraphicsCore.orthoFactor;
				pos.y -= onCameraMove.result[1] / GraphicsCore.orthoFactor;
			}*/
			
			PhysicsCore.update(dt);
			
			BaseGame.prototype.update.call(this, dt);
			
			GraphicsCore.update(dt);
		},
	};
	
	Extension.inherit_auto(Game, BaseGame);
	
	exports.Game = Game;
	
});