ModuleSystem.registerModule(function(){
	
	var BaseGame = ModuleSystem.require("GameCore.BaseGame").BaseGame;
	var BaseGameObject = ModuleSystem.require("GameCore.BaseGameObject").BaseGameObject;
	
	function Game()
	{
		BaseGame.call(this);
		this.name = "foo";
	}
	
	Game.functions = {
		
		init: function init()
		{
			// creating objects
			this.testObj = new BaseGameObject();
			
			GraphicsCore.SimpleGraphicsObject.createOn(this.testObj, "TestGame/Content/nehe2.gif");
			GraphicsCore.addDrawableObject(this.testObj);
		},
		
		
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