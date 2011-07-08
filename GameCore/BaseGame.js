
ModuleSystem.registerModule(function(){
	
	function BaseGame()
	{
		this.name = "foo";
		this.updateInterval = 16;
		this.updateTimer = null;
	}
	
	BaseGame.functions = {
		
		startGameLoop: function startGameLoop()
		{
			if(!this.update)
				throw "No Update Function";
			
			this.update(0);
			
			//this.updateTimer = window.setInterval(this.update.bind(this), this.updateInterval);
		},
				
		/* Initializes the game
		 *
		 */
		init: function init()
		{
			
		},
		
		/* Updates the game
		 *
		 */
		update: function update(deltaTime)
		{
			
		},
	};
	
	Extension.inherit_auto(BaseGame, Object);
	
	return {BaseGame: BaseGame};
	
});