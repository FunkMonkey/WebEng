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
			
			var action = InputCore.getAction("OnCameraMove");
			var trigger = action.addMouseButtonTrigger(1, InputCore.MOUSEBUTTON_STATE_DOWN);
			trigger.obligatory = true;
			trigger = action.addMouseMoveTrigger();
			trigger.obligatory = true;
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