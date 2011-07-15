ModuleSystem.registerModule(function(){
	
	var BaseGame = ModuleSystem.require("GameCore.BaseGame").BaseGame;
	var BaseGameObject = ModuleSystem.require("GameCore.BaseGameObject").BaseGameObject;
	var Plugin_WorldObject3D = ModuleSystem.require("GameCore.Plugin_WorldObject3D").Plugin_WorldObject3D;
	
	function Game()
	{
		BaseGame.call(this);
		this.name = "foo";
	}
	
	Game.functions = {
		
		create: function create()
		{
			// creating objects
			this.testObj = new BaseGameObject();
			this.addGameObject(this.testObj);
		},
		
		loadConfig: function loadConfig()
		{
			this.testObj.addPlugin(new Plugin_WorldObject3D(this.testObj));
			this.testObj.pos.z = -7
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
			GraphicsCore.update(deltaTime);
		},
	};
	
	Extension.inherit_auto(Game, BaseGame);
	
	return {Game: Game};
	
});