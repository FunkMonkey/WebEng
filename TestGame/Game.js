ModuleSystem.registerModule("TestGame/Game", function(require, exports){
	
	var BaseGame = require("/GameCore/BaseGame").BaseGame;
	var PhaseTimer = require("/Engine/Timers").PhaseTimer;
	var Plugin_Pickable = require("/TestGame/Scripts/Plugins/Plugin_Pickable").Plugin_Pickable;
	
	function Game()
	{
		BaseGame.call(this);
	}
	
	Game.functions = {
		
		initControls: function initControls()
		{
			var action = null;
			
			action = InputCore.getAction("OnPauseGame");
			action.addKeyboardTrigger(KeyboardEvent.DOM_VK_ESCAPE, InputCore.KEY_STATE_PRESSED, true);
			
			action = InputCore.getAction("OnMouseDown");
			action.addMouseButtonTrigger(InputCore.MOUSEBUTTON_LEFT, InputCore.MOUSEBUTTON_STATE_DOWN, true);
			
			action = InputCore.getAction("OnCameraMove");
			action.addMouseButtonTrigger(InputCore.MOUSEBUTTON_LEFT, InputCore.MOUSEBUTTON_STATE_DOWN, true);
			action.addMouseMoveTrigger(true, [1.0 / GraphicsCore.orthoFactor, -1.0 / GraphicsCore.orthoFactor]);
		},
		
		initMenu: function initMenu()
		{
			this.jdomMenu = $("#game-menu");
			this.jdomMenuStart = $("#game-menu-start");
			this.jdomMenuRestart = $("#game-menu-restart");
			this.jdomMenuContinue = $("#game-menu-continue");
		},
		
		
		
		init: function init()
		{
			BaseGame.prototype.init.call(this);
			
			this.initMenu();
			this.initControls();
			
			//PhysicsCore.initDebugDraw(document.getElementById("canvas2"));
		},
		
		
		/*
		 *
		 */
		update: function update(dt)
		{
			var timer = new PhaseTimer();
			
			InputCore.update(dt);
			this.mouseWorldPos = GraphicsCore.screenPosToWorldPos(InputCore.mousePos, 0);
			
			var onPauseGame = InputCore.actions["OnPauseGame"];
			if(onPauseGame.isTriggered)
			{
				this.stopGameLoop();
				this.jdomMenu.show();
				return;
			}
			
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
				pos.x += onCameraMove.result[0];
				pos.y += onCameraMove.result[1];
			}
			timer.finishPhase("Camera");
			
			GraphicsCore.update(dt);
			
			//PhysicsCore.drawDebug(dt);
			
			timer.finishPhase("Graphics");
			//if(timer.time > 10)
			//	timer.print(log);
		},
		
		/* 
		 * 
		 */
		unloadCurrentLevel: function unloadCurrentLevel()
		{
			BaseGame.prototype.unloadCurrentLevel.call(this);
			
			if(PhysicsCore.bodies.length > 0)
				log("There are still bodies that have not been destroyed");
				
			if(PhysicsCore.joints.length > 0)
				log("There are still joints that have not been destroyed");
			
			PhysicsCore.destroyAllBodiesAndJoints();
			
			if(GraphicsCore.drawableObjects.length > 0)
				log("There are still drawable objects that have not been destroyed");
			
			GraphicsCore.removeAllDrawableObjects();
		},
		
		/* 
		 * 
		 */
		destroy: function destroy()
		{
			BaseGame.prototype.destroy.call(this);
			PhysicsCore.destroy();
		},
		
		onDarkSoulDead: function onDarkSoulDead()
		{
			log("Game Over");
		},
		
		_start: function _start()
		{
			this.loadLevel("/TestGame/Scripts/Levels/Level1/Level", (function cb(){
				this.jdomMenuStart.hide();
				this.jdomMenuContinue.show();
				this.jdomMenuRestart.show();
				this.jdomMenu.hide();
				this.startGameLoop();
			}).bind(this));
		},
		
		_restart: function _restart()
		{
			this.loadLevel("/TestGame/Scripts/Levels/Level1/Level", (function cb(){
				this.jdomMenu.hide();
				this.startGameLoop();
			}).bind(this));
		},
		
		_continue: function _continue()
		{
			this.jdomMenu.hide();
			this.startGameLoop();
		},
		
		
		
		
	};
	
	Extension.inherit_auto(Game, BaseGame);
	
	exports.Game = Game;
	
});