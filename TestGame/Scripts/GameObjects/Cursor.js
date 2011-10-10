
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/GameObjects/Cursor", function(require, exports, module){
	
	var BaseGameObject = require("/GameCore/BaseGameObject").BaseGameObject;
	var Plugin_WorldObject3D = require("/GameCore/Plugin_WorldObject3D").Plugin_WorldObject3D;
	var Plugin_LogicDarkSoul = require("/TestGame/Scripts/GameObjects/DarkSoul").Plugin_LogicDarkSoul;
	
	function Plugin_LogicCursor()
	{
		this._prevPos = Vector3.fromPool();
		this.maxSpeed = 6;
		this.currSpeed = this.maxSpeed;
		this.target = Vector3.fromPool();
		this.idlePauseLength = 0.3;
		this._idlePauseStart = 0;
	}
	
	Plugin_LogicCursor.prototype = {
		constructor: Plugin_LogicCursor,
		
		onAddedTo: function onAddedTo(gameObj)
		{
			this.gameObj = gameObj;
			this.gameObj.pluginLogicCursor = this;
		},
		
		_tmpVec: Vector3.fromPool(),
		_tmpLength:0,
		_tmpLengthFactor: 0,
		update: function update(dt)
		{
			// coloring
			var range = Plugin_LogicDarkSoul.maxDistToCursor - Plugin_LogicDarkSoul.prototype.deathRange + 2;
			if(range < 0)
				this.gameObj.pluginGraphics.color.set(1, 1, 0, 1);
			else if(range > 2)
				this.gameObj.pluginGraphics.color.set(1, 0, 0, 1);
			else
				this.gameObj.pluginGraphics.color.set(1, 1 - (range / 2.0), 0, 1);
			
			Plugin_LogicDarkSoul.maxDistToCursor = 0;
			
			// movement
			var mouseWorldPos = Game.mouseWorldPos;
			if(this.target.distanceTo(mouseWorldPos) > 0.5)
			{
				//var ran = Math.random() * Math.PI * 2;
				//this.target.x = mouseWorldPos.x + Math.cos(ran) * 0.3;
				//this.target.y = mouseWorldPos.y + Math.sin(ran) * 0.3;
				this.target.x = mouseWorldPos.x;
				this.target.y = mouseWorldPos.y;
			}
			
			this._tmpVec.x = this.target.x - this.gameObj.pos.x;
			this._tmpVec.y = this.target.y - this.gameObj.pos.y;
			this._tmpLength = Math.sqrt(this._tmpVec.x * this._tmpVec.x + this._tmpVec.y * this._tmpVec.y);
			
			if(this._tmpLength < 1)
			{
				this.currSpeed = this.maxSpeed / 2;
			}
			else
				this.currSpeed = this.maxSpeed;
			
			if(this._tmpLength > 0.05)
			{
				if(dt === 0) dt = 0.00001;
				this._tmpLengthFactor = this.currSpeed * dt / this._tmpLength;
				
				this.gameObj.pos.x = this.gameObj.pos.x + this._tmpVec.x * this._tmpLengthFactor;
				this.gameObj.pos.y = this.gameObj.pos.y + this._tmpVec.y * this._tmpLengthFactor;
				
			}
			else
			{
				if(Game.lastUpdateInS - this._idlePauseStart > this.idlePauseLength)
				{
					var ran = Math.random() * Math.PI * 2;
					var ranLength = Math.random() * 0.1 + 0.1;
					this.target.x = mouseWorldPos.x + Math.cos(ran) * ranLength;
					this.target.y = mouseWorldPos.y + Math.sin(ran) * ranLength;
					this._idlePauseStart = Game.lastUpdateInS;
				}
			}
		}
		
	};
	
	function createCursor(id)
	{
		var obj = new BaseGameObject(id);
		obj.addPlugin(new Plugin_WorldObject3D());
		obj.size.x = 0.2;
		obj.size.y = 0.2;
		
		obj.addPlugin(new Plugin_LogicCursor());
		obj.addPlugin(new GraphicsCore.Plugin_SimpleColorGraphics2D());
		obj.pluginGraphics.color = GraphicsCore.Color.fromPool(1.0, 1.0, 0.0, 1.0);
		return obj;
	}
	
	
	exports.createCursor = createCursor;
});
