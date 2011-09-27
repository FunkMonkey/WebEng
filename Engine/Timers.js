
//======================================================================================//
// GameTimer																			//
//======================================================================================//

ModuleSystem.registerModule("Engine/Timers", function (require, exports, module)
{
	var GameTimer = function GameTimer()
	{
		this.start = Engine.getTimeInMS();
		this.lastTime = this.start;
		this.deltaTimeMS = 0;
		this.deltaTime = 0;
		this.fps = 0;
		this.frameCount = 0;
		this.gameTime = 0;
		this.remainingTime = 0;
	};
	
	GameTimer.prototype = {
		constructor: GameTimer,
			
		/*
		 *
		 */
		update: function update()
		{
			var newTime = Engine.getTimeInMS();
			this.deltaTimeMS = newTime - this.lastTime;
			this.deltaTime = this.deltaTimeMS / 1000.0;
			this.gameTime += this.deltaTime;
			this.lastTime = newTime;
			this.fps = 1.0 / this.deltaTime;
			this.remainingTime += this.deltaTime;
			++this.frameCount;
		}
	};
	
	var PhaseTimer = function PhaseTimer()
	{
		this.start =  Engine.getHRTimeInMS();
		this.lastTime = this.start;
		
		this.phases = {};

	};
	
	PhaseTimer.prototype = {
		constructor: PhaseTimer,
		
		
		/*
		 *
		 */
		finishPhase: function finishPhase(name)
		{
			var currTime = Engine.getHRTimeInMS();
			this.phases[name] =  currTime - this.lastTime;
			this.lastTime = currTime;
		},
		
		/*
		 *
		 */
		print: function print(printFunc, delimiter)
		{
			if(!delimiter)
				delimiter = "\n";
			
			var str = "";
			for(var prop in this.phases)
				str += prop + ": " + this.phases[prop] + "ms" + delimiter;
				
			printFunc(str);
		},
		
		get time()
		{
			return this.lastTime - this.start;
		}
	};
	
	
	
	// exports
	exports.GameTimer = GameTimer;
	exports.PhaseTimer =  PhaseTimer;
});

