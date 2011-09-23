
var Vector3 = require("Engine/Vector3").Vector3;

var GraphicsCore = null;
var InputCore = null;
var AudioCore = null;
var Game = null;

function onLoad()
{
	GraphicsCore = ModuleSystem.require("/Engine/Graphics/GraphicsCore").GraphicsCore;
	GraphicsCore.init();
	
	InputCore = ModuleSystem.require("/Engine/Input/InputCore").InputCore;
	//InputCore.init(document.getElementById("glcanvas"));
	InputCore.init(window, document.getElementById("glcanvas"));
	
	AudioCore = ModuleSystem.require("/Engine/Audio/AudioCore").AudioCore;
	AudioCore.init();
	
	Game = new (ModuleSystem.require("/TestGame/Game").Game)();
	
	Game.create();
	Game.loadConfig();
	Game.loadResources(function(){
		Game.init();
		
		Game.loadLevel("/TestGame/Scripts/Levels/Level1", function cb(){
				log("level loaded");
				Game.startGameLoop();
			});
	}); // async
	
}

window.addEventListener("load", onLoad, false);




//Game.startGameLoop();




//======================================================================================//
// BaseClass
//======================================================================================//
/*function BaseClass()
{
	
};

Extension.inherit(BaseClass, Object);

BaseClass.prototype.foo = "suffshit";

function ChildClass()
{
	this.instancefoo = "sdlksdjf";
};

ChildClass.functions = {
	aFunction: function(test){}
};

Extension.inherit_auto(ChildClass, BaseClass);

ChildClass.prototype.fooChild = "upser";

var test = new ChildClass();*/