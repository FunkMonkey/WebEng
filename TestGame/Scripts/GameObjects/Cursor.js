
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/GameObjects/Cursor", function(require, exports, module){
	
	var BaseGameObject = require("/GameCore/BaseGameObject").BaseGameObject;
	var Plugin_WorldObject3D = require("/GameCore/Plugin_WorldObject3D").Plugin_WorldObject3D;
	
	function Plugin_LogicCursor(gameObj)
	{
		this.gameObj = gameObj;
		gameObj.pluginLogic = this;
	}
	
	Plugin_LogicCursor.prototype = {
		constructor: Plugin_WorldObject3D,
		
		update: function update(dt)
		{
			//log("updating");
			//this.gameObj.pos.x = InputCore.mousePos.x
			GraphicsCore.screenPosToWorldPos(InputCore.mousePos, this.gameObj.pos.z, this.gameObj.pos);
			//log(InputCore.mousePos.x);
		}
		
	};
	
	function createCursor()
	{
		var obj = new BaseGameObject();
		obj.addPlugin(new Plugin_WorldObject3D(obj));
		obj.addPlugin(new Plugin_LogicCursor(obj));
		obj.addPlugin(new GraphicsCore.Plugin_SimpleTextureGraphics2D(obj));
		obj.pluginGraphics.textureID = "TestGame/Content/1.jpg";
		return obj;
	}
	
	
	exports.createCursor = createCursor;
});
