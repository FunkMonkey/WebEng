"use strict";

ModuleSystem.registerModule("GameCore/Plugin_WorldObject3D", function(require, exports){
	
	function Plugin_WorldObject3D()
	{
		this.dontCallUpdate = true;
	}
	
	
	Plugin_WorldObject3D.prototype = {
		constructor: Plugin_WorldObject3D,
		
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
		},
		
		settersAndGetters:
		{
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
			
			getSize: function getSize(){ return this._size;},
		},
		
		setPosRelativeTo: function setPosRelativeTo(otherPos, offset)
		{
			this.pos.x = otherPos.x + offset.x;
			this.pos.y = otherPos.y + offset.y;
			this.pos.z = otherPos.z + offset.z;
		},
		
	};

	
	exports.Plugin_WorldObject3D = Plugin_WorldObject3D;
	
});