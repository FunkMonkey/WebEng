

var GraphicsCore = null;
var Game = null;

function onLoad()
{
	GraphicsCore = ModuleSystem.require("Engine.Graphics.GraphicsCore").GraphicsCore;
	GraphicsCore.init();
	Game = new (ModuleSystem.require("TestGame.Game").Game)();
	
	Game.create();
	Game.loadConfig();
	log("trying to load resources");
	Game.loadResources(function(){
		log("resources loaded");
		Game.init();
		Game.startGameLoop();
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