ScriptLoader.debugOptions.logLoading = false;


var Vector3 = require("Engine/Vector3").Vector3;

var GraphicsCore = null;
var PhysicsCore = null;
var InputCore = null;
var AudioCore = null;
var Game = null;


/**
 * Called when the DOM has finished loading
 *   - initializes the game
 */
function onLoad()
{
	GraphicsCore = ModuleSystem.require("/Engine/Graphics/GraphicsCore").GraphicsCore;
	GraphicsCore.init(document.getElementById("game-viewport"));
	
	InputCore = ModuleSystem.require("/Engine/Input/InputCore").InputCore;
	//InputCore.init(document.getElementById("glcanvas"));
	InputCore.init(window, document.getElementById("game-viewport"));
	
	AudioCore = ModuleSystem.require("/Engine/Audio/AudioCore").AudioCore;
	AudioCore.init();
	
	PhysicsCore = ModuleSystem.require("/Engine/Physics/PhysicsCore").PhysicsCore;
	PhysicsCore.init();
	
	Game = new (ModuleSystem.require("/TestGame/Game").Game)();
	
	Game.create();
	Game.loadConfig();
	Game.loadResources(function(){
		Game.init();
		
		// enabling menu
		Game.jdomUI.show();
		
	}); // async
	
}

window.addEventListener("load", onLoad, false);
