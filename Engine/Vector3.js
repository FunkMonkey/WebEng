"use strict";

ModuleSystem.registerModule("Engine/Vector3", function(require, exports, module){
	
	function Vector3(xOrVec, y, z)
	{
		this.set(xOrVec, y, z);
	}
	
	Vector3.functions = {
		
		set: function set(xOrVec, y, z)
		{
			if(xOrVec === undefined)
			{
				this[0] = 0;
				this[1] = 0;
				this[2] = 0;
			}
			else if(y === undefined)
			{
				this[0] = xOrVec[0];
				this[1] = xOrVec[1];
				this[2] = xOrVec[2];
			}
			else
			{
				this[0] = xOrVec;
				this[1] = y;
				this[2] = z;
			}
		},
		
		toString: function toString()
		{
			return "(" + this[0] + ", " + this[1] + ", " + this[2] + ")";
		},
		
		distanceTo: function distanceTo(other)
		{
			var diff0 = this[0] - other[0];
			var diff1 = this[1] - other[1];
			var diff2 = this[2] - other[2];
			return (Math.sqrt(diff0 * diff0 + diff1*diff1 + diff2*diff2));
		},
		
		
	
	};
	
	Vector3.properties = {
			x: 	{	get : function(){ return this[0]; },
					set : function(newValue){ this[0] = newValue; },
					enumerable : true,
					configurable : true
				},
				
			y: 	{	get : function(){ return this[1]; },
					set : function(newValue){ this[1] = newValue; },
					enumerable : true,
					configurable : true
				},
				
			z: 	{	get : function(){ return this[2]; },
					set : function(newValue){ this[2] = newValue; },
					enumerable : true,
					configurable : true
				}
	};
	
	Extension.inherit_auto(Vector3, Array);
	
	require("GCPool").initPoolOn(Vector3, Vector3.prototype.set);
	
	exports.Vector3 = Vector3;
});



