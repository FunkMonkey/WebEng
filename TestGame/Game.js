ModuleSystem.registerModule("TestGame/Game", function(require, exports){
	
	var BaseGame = require("/GameCore/BaseGame").BaseGame;
	var PhaseTimer = require("/Engine/Timers").PhaseTimer;
	var Plugin_Pickable = require("/TestGame/Scripts/Plugins/Plugin_Pickable").Plugin_Pickable;
	
	/**
	 * Game: Constructor function for a "Troubled Souls" game-instance
	 */
	function Game()
	{
		BaseGame.call(this);
		this.deathReason = "";
	}
	
	Game.functions = {
		
		/**
		 * Loads the games resources (asynchron)
		 * 
		 * @param   {function} callback Function to call when resources have been loaded
		 */
		loadResources: function loadResources(callback)
		{
			AudioCore.createAudio("TestGame/Content/Sounds/music.ogg", (function(audio){
				this.music = audio;
				this.music.loop = true;
				this.music.volume = 0.5;
				
				callback();
			}).bind(this));
		},
		
		/**
		 * Initializes the controls
		 */
		initControls: function initControls()
		{
			var action = null;
			
			action = InputCore.getAction("OnPauseGame");
			action.addKeyboardTrigger(KeyEvent.DOM_VK_ESCAPE, InputCore.KEY_STATE_PRESSED, true);
			
			action = InputCore.getAction("OnMouseDown");
			action.addMouseButtonTrigger(InputCore.MOUSEBUTTON_LEFT, InputCore.MOUSEBUTTON_STATE_DOWN, true);
			
			action = InputCore.getAction("OnCameraMove");
			action.addMouseButtonTrigger(InputCore.MOUSEBUTTON_LEFT, InputCore.MOUSEBUTTON_STATE_DOWN, true);
			action.addMouseMoveTrigger(true, [GraphicsCore.orthoPixelToMeterRatio, -GraphicsCore.orthoPixelToMeterRatio]);
		},
		
		/**
		 * Initializes the menu
		 */
		initUI: function initUI()
		{
			this.jdomUI = $("#game-ui");
			this.jdomMenu = $("#game-menu");
			this.jdomMenuStart = $("#game-menu-start");
			this.jdomMenuRestart = $("#game-menu-restart");
			this.jdomMenuContinue = $("#game-menu-continue");
			this.jdomUINote = $("#game-ui-note");
		},
		
		
		/**
		 * Initializes the game
		 */
		init: function init()
		{
			BaseGame.prototype.init.call(this);
			
			this.initUI();
			this.initControls();
			
			//PhysicsCore.initDebugDraw(document.getElementById("canvas2"));
		},
		
		
		/**
		 * Updates the game
		 * 
		 * @param   {number} dt Time since last frame (in s)
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
				this.music.pause();
				this.jdomUI.show();
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
			    (Plugin_Pickable.userDrop || (this.lastUpdate - Plugin_Pickable.lastDropTime) > 1000) &&
				onCameraMove.isTriggered)
			{
				var pos = GraphicsCore.camera.pos;
				pos.x += onCameraMove.result[0];
				pos.y += onCameraMove.result[1];
			}
			timer.finishPhase("Camera");
			
			GraphicsCore.update(dt);
			
			//PhysicsCore.drawDebug(dt, Vector3.fromPool(GraphicsCore.camera.pos.x / GraphicsCore.orthoPixelToMeterRatio, GraphicsCore.camera.pos.y / GraphicsCore.orthoPixelToMeterRatio));
			
			timer.finishPhase("Graphics");
			//if(timer.time > 16)
			//	timer.print(log);
			
			if(this.level.gameOver && this.lastUpdateInS - this.level.gameOverStart > 2)
			{
				this.stopGameLoop();
				
				switch(this.deathReason)
				{
					case "fall": this.jdomUINote.attr("class", "gameover3"); break;
					case "smashed_sign": this.jdomUINote.attr("class", "gameover1"); break;
					case "smashed_moving": this.jdomUINote.attr("class", "gameover2"); break;
					case "life_distance": this.jdomUINote.attr("class", "gameover4"); break;
				}
				this.jdomUINote.show();
				this.jdomMenuContinue.hide();
				this.jdomUI.show();
				
				// todo show gameover message
			}
			else if(this.level.gameWin && this.lastUpdateInS - this.level.gameWinStart > 2)
			{
				this.stopGameLoop();
				this.jdomUINote.attr("class", "win");
				this.jdomUINote.show();
				this.jdomMenuContinue.hide();
				this.jdomUI.show();
				
				// todo show win message
			}
		},
		
		/**
		 * Unloads the current level
		 */
		unloadCurrentLevel: function unloadCurrentLevel()
		{
			BaseGame.prototype.unloadCurrentLevel.call(this);
			
			// let's clean up
			if(PhysicsCore.bodies.length > 0)
				log("There are still bodies that have not been destroyed");
				
			if(PhysicsCore.joints.length > 0)
				log("There are still joints that have not been destroyed");
			
			PhysicsCore.destroyAllBodiesAndJoints();
			
			if(GraphicsCore.drawableObjects.length > 0)
				log("There are still drawable objects that have not been destroyed");
			
			GraphicsCore.removeAllDrawableObjects();
		},
		
		/**
		 * Destroys the game
		 */
		destroy: function destroy()
		{
			BaseGame.prototype.destroy.call(this);
			PhysicsCore.destroy();
		},
		
		/**
		 * Called when a darksoul dies - gamelogic
		 */
		onDarkSoulDead: function onDarkSoulDead()
		{
			if(!this.level.gameOver)
			{
				this.level.gameOver = true;
				this.level.gameOverStart = this.lastUpdateInS;
				log("Game Over");
			}
			
		},
		
		/* 
		 * Called when all darksouls in win-zone
		 */
		onWin: function onWin()
		{
			this.level.gameWin = true;
			this.level.gameWinStart = this.lastUpdateInS;
		},
		
		/**
		 * Starts the game
		 */
		_start: function _start()
		{
			this.loadLevel("/TestGame/Scripts/Levels/Level1/Level", (function cb(){
				this.jdomMenuStart.hide();
				this.jdomMenuContinue.show();
				this.jdomMenuRestart.show();
				this.jdomUI.hide();
				this.music.play();
				InputCore.update(0);
				this.startGameLoop();
			}).bind(this));
		},
		
		/**
		 * Restarts a new round of the game
		 */
		_restart: function _restart()
		{
			this.loadLevel("/TestGame/Scripts/Levels/Level1/Level", (function cb(){
				this.jdomMenuContinue.show();
				this.jdomUINote.hide();
				this.jdomUI.hide();
				this.music.currentTime = 0;
				this.music.play();
				InputCore.update(0);
				this.startGameLoop();
			}).bind(this));
		},
		
		/**
		 * Continues the game
		 */
		_continue: function _continue()
		{
			this.music.play();
			this.jdomUI.hide();
			InputCore.update(0);
			this.startGameLoop();
		},
		
	};
	
	Extension.inherit_auto(Game, BaseGame);
	
	exports.Game = Game;
	
});