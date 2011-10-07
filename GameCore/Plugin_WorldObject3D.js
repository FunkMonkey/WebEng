"use strict";

ModuleSystem.registerModule("GameCore/Plugin_WorldObject3D", function(require, exports){
	
	function Plugin_WorldObject3D()
	{
	}
	
	
	Plugin_WorldObject3D.prototype = {
		constructor: Plugin_WorldObject3D,
		
		/**
		 * Called, when plugin was added to a gameobject
		 * 
		 * @param   {BaseGameObject} gameObj The gameobject
		 */
		onAddedTo: function onAddedTo(gameObj)
		{
			var self = this;
			
			this.gameObj = gameObj;
			this.gameObj.pluginWorldObject3D = this;
			
			this.gameObj._pos = Vector3.fromPool();
			Object.defineProperty(this.gameObj, "pos",	{	get : self.settersAndGetters.getPos,
															set : self.settersAndGetters.setPos,
															enumerable : true, configurable : true });
			
			this.gameObj._rot = Vector3.fromPool();
			Object.defineProperty(this.gameObj, "rot",	{	get : self.settersAndGetters.getRot,
															set : self.settersAndGetters.setRot,
															enumerable : true, configurable : true });
			
			this.gameObj._scale = Vector3.fromPool(1.0, 1.0, 1.0);
			Object.defineProperty(this.gameObj, "scale",	{	get : self.settersAndGetters.getScale,
																set : self.settersAndGetters.setScale,
																enumerable : true, configurable : true });
			
			this.gameObj._size = Vector3.fromPool(0.0, 0.0, 0.0);
			Object.defineProperty(this.gameObj, "size",	{	get : self.settersAndGetters.getSize,
															set : self.settersAndGetters.setSize,
															enumerable : true, configurable : true });
			
			this.gameObj.setPosRelativeTo = this.setPosRelativeTo;
			
			this.gameObj.setPosIn2D = this.functions.setPosIn2D;
			this.gameObj.getPosIn2D = this.functions.getPosIn2D;
		},
		
		settersAndGetters:
		{
			/**
			* Sets the position of the gameobject
			* 
			* @param   {Vector3} val New Position
			*/
			setPos: function setPos(val)
			{
				this._pos.x = val.x;
				this._pos.y = val.y;
				this._pos.z = val.z;
			},
			
			getPos: function getPos(){ return this._pos;},
			
			setRot: function setRot(val)
			{
				this._rot.x = val.x;
				this._rot.y = val.y;
				this._rot.z = val.z;
			},
			
			getRot: function getRot(){ return this._rot;},
			
			setScale: function setScale(val)
			{
				this._scale.x = val.x;
				this._scale.y = val.y;
				this._scale.z = val.z;
			},
			
			getScale: function getScale(){ return this._scale;},
			
			setSize: function setSize(val)
			{
				this._size.x = val.x;
				this._size.y = val.y;
				this._size.z = val.z;
			},
			
			getSize: function getSize(){ return this._size;}
		},
		
		functions: {
			setPosIn2D: function setPosIn2D(pos, anchor)
			{
				var newPos = Vector3.fromPool(pos);
				switch(anchor)
				{
					case "left-top": 
					case "top-left":     newPos.x += this.size.x / 2.0; newPos.y -= this.size.y / 2.0; break;
					case "left-bottom": 
					case "bottom-left":  newPos.x += this.size.x / 2.0; newPos.y += this.size.y / 2.0; break;
					case "right-top": 
					case "top-right":    newPos.x -= this.size.x / 2.0; newPos.y -= this.size.y / 2.0; break;
					case "right-bottom": 
					case "bottom-right": newPos.x -= this.size.x / 2.0; newPos.y += this.size.y / 2.0; break;
				}
				
				this.pos = newPos;
			},
			
			getPosIn2D: function getPosIn2D(anchor)
			{
				var pos = Vector3.fromPool(this.pos);
				
				switch(anchor)
				{
					case "left-top": 
					case "top-left":     pos.x -= this.size.x / 2.0; pos.y += this.size.y / 2.0; break;
					case "left-bottom": 
					case "bottom-left":  pos.x -= this.size.x / 2.0; pos.y -= this.size.y / 2.0; break;
					case "right-top": 
					case "top-right":    pos.x += this.size.x / 2.0; pos.y += this.size.y / 2.0; break;
					case "right-bottom": 
					case "bottom-right": pos.x += this.size.x / 2.0; pos.y -= this.size.y / 2.0; break;
				}
				
				return pos;
			},
			
			
		},
		
		//setPosRelativeTo: function setPosRelativeTo(otherPos, offset)
		//{
		//	this.pos.x = otherPos.x + offset.x;
		//	this.pos.y = otherPos.y + offset.y;
		//	this.pos.z = otherPos.z + offset.z;
		//}
		
	};

	
	exports.Plugin_WorldObject3D = Plugin_WorldObject3D;
	
});