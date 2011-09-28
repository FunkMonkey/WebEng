ModuleSystem.registerModule("TestGame/Game", function(require, exports){
	
	var BaseGame = require("/GameCore/BaseGame").BaseGame;
	var PhaseTimer = require("/Engine/Timers").PhaseTimer;
	var Plugin_Pickable = require("/TestGame/Scripts/Plugins/Plugin_Pickable").Plugin_Pickable;
	
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
			
			// test
			//this.debugDraw = new PhysicsCore.b2DebugDraw();
			//this.debugDraw.canvas = document.getElementById("canvas2");
			//this.debugDraw.context = this.debugDraw.canvas.getContext("2d")
			//this.debugDraw.SetSprite(this.debugDraw.context);
			//this.debugDraw.SetDrawScale(30.0);
			//this.debugDraw.SetFillAlpha(0.5);
			//this.debugDraw.SetLineThickness(1.0);
			//this.debugDraw.SetFlags(PhysicsCore.b2DebugDraw.e_shapeBit | PhysicsCore.b2DebugDraw.e_jointBit);
			//PhysicsCore.world.SetDebugDraw(this.debugDraw);
		},
		
		
		/*
		 *
		 */
		update: function update(dt)
		{
			var timer = new PhaseTimer();
			
			InputCore.update(dt);
			this.mouseWorldPos = GraphicsCore.screenPosToWorldPos(InputCore.mousePos, 0);
			
			timer.finishPhase("Input");
			
			PhysicsCore.update(dt);
			timer.finishPhase("Physics");
			
			BaseGame.prototype.update.call(this, dt);
			timer.finishPhase("Level");
			
			// moving camera
			var onCameraMove = InputCore.actions["OnCameraMove"];
			if( Plugin_Pickable.pickedBody === null &&
			    (this.lastUpdate - Plugin_Pickable.lastDropTime) > 1000 &&
				onCameraMove.isTriggered)
			{
				var pos = GraphicsCore.camera.pos;
				pos.x += onCameraMove.result[0] / GraphicsCore.orthoFactor;
				pos.y -= onCameraMove.result[1] / GraphicsCore.orthoFactor;
			}
			timer.finishPhase("Camera");
			
			GraphicsCore.update(dt);
			
			//var lastTranslate = Vector3.fromPool(50,50);
			//
			//this.debugDraw.context.translate(lastTranslate.x, lastTranslate.y);
			//PhysicsCore.world.DrawDebugData();
			//this.debugDraw.context.translate(-lastTranslate.x, -lastTranslate.y);
			
			timer.finishPhase("Graphics");
			//if(timer.time > 10)
			//	timer.print(log);
		},
		
		onDarkSoulDead: function onDarkSoulDead()
		{
			log("Game Over");
		},
		
	};
	
	Extension.inherit_auto(Game, BaseGame);
	
	exports.Game = Game;
	
});