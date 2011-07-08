

var GraphicsCore = null;
var Game = null;

function onLoad()
{
	GraphicsCore = ModuleSystem.require("Engine.Graphics.GraphicsCore").GraphicsCore;
	GraphicsCore.init();
	Game = new (ModuleSystem.require("TestGame.Game")).Game();
	Game.startGameLoop();
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