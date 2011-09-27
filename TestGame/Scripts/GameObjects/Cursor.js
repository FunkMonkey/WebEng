
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/GameObjects/Cursor", function(require, exports, module){
	
	var BaseGameObject = require("/GameCore/BaseGameObject").BaseGameObject;
	var Plugin_WorldObject3D = require("/GameCore/Plugin_WorldObject3D").Plugin_WorldObject3D;
	
	function Plugin_LogicCursor(gameObj)
	{
		this.gameObj = gameObj;
		gameObj.pluginLogic = this;
		this._prevPos = Vector3.fromPool();
		this.maxSpeed = 6;
	}
	
	Plugin_LogicCursor.prototype = {
		constructor: Plugin_LogicCursor,
		
		_tmpVec: Vector3.fromPool(),
		_tmpLength:0,
		_tmpLengthFactor: 0,
		update: function update(dt)
		{
			var mouseWorldPos = Game.mouseWorldPos;
			this._tmpVec.x = mouseWorldPos.x - this.gameObj.pos.x;
			this._tmpVec.y = mouseWorldPos.y - this.gameObj.pos.y;
			this._tmpLength = Math.sqrt(this._tmpVec.x * this._tmpVec.x + this._tmpVec.y * this._tmpVec.y);
			
			if(this._tmpLength > 0.05)
			{
				if(dt === 0) dt = 0.00001;
				this._tmpLengthFactor = this.maxSpeed * dt / this._tmpLength;
				
				this.gameObj.pos.x = this.gameObj.pos.x + this._tmpVec.x * this._tmpLengthFactor;
				this.gameObj.pos.y = this.gameObj.pos.y + this._tmpVec.y * this._tmpLengthFactor;
			}
			else
			{
				this.gameObj.pos.x = mouseWorldPos.x;
				this.gameObj.pos.y = mouseWorldPos.y;
			}
		}
		
	};
	
	function createCursor(id)
	{
		var obj = new BaseGameObject(id);
		obj.addPlugin(new Plugin_WorldObject3D(obj));
		obj.addPlugin(new Plugin_LogicCursor(obj));
		obj.addPlugin(new GraphicsCore.Plugin_SimpleColorGraphics2D(obj));
		obj.pluginGraphics.width = 0.2;
		obj.pluginGraphics.height = 0.2;
		obj.pluginGraphics.color = GraphicsCore.Color.fromPool(1.0, 1.0, 0.0, 1.0);
		return obj;
	}
	
	
	exports.createCursor = createCursor;
});
