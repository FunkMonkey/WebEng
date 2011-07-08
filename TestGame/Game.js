ModuleSystem.registerModule(function(){
	
	var BaseGame = ModuleSystem.require("GameCore.BaseGame").BaseGame;
	
	function Game()
	{
		BaseGame.call(this);
		this.name = "foo";
	}
	
	Game.functions = {
		/*
		 *
		 */
		update: function update(deltaTime)
		{
			GraphicsCore.update(deltaTime);
		},
	};
	
	Extension.inherit_auto(Game, BaseGame);
	
	return {Game: Game};
	
});