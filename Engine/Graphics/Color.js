"use strict";

ModuleSystem.registerModule("Engine/Graphics/Color", function(require, exports, module){
	
	function Color(rOrColor, g, b, a)
	{
		this._color = new Float32Array(4);
		this.set(rOrColor, g, b, a);
	}
	
	Color.functions = {
		
		set: function set(rOrColor, g, b, a)
		{
			if(rOrColor === undefined)
			{
				this._color[0] = 0;
				this._color[1] = 0;
				this._color[2] = 0;
				this._color[3] = 1;
			}
			else if(g === undefined)
			{
				this._color[0] = rOrColor._color[0];
				this._color[1] = rOrColor._color[1];
				this._color[2] = rOrColor._color[2];
				this._color[3] = rOrColor._color[3];
			}
			else
			{
				this._color[0] = rOrColor;
				this._color[1] = g;
				this._color[2] = b;
				this._color[3] = a;
			}
		},
		
		clone: function clone()
		{
			return Color.fromPool(this.r, this.g, this.b, this.a);
		},
		
	
	};
	
	Color.properties = {
			r: 	{	get : function(){ return this._color[0]; },
					set : function(newValue){ this._color[0] = newValue; },
					enumerable : true,
					configurable : true
				},
				
			g: 	{	get : function(){ return this._color[1]; },
					set : function(newValue){ this._color[1] = newValue; },
					enumerable : true,
					configurable : true
				},
				
			b: 	{	get : function(){ return this._color[2]; },
					set : function(newValue){ this._color[2] = newValue; },
					enumerable : true,
					configurable : true
				},
				
			a: 	{	get : function(){ return this._color[3]; },
					set : function(newValue){ this._color[3] = newValue; },
					enumerable : true,
					configurable : true
				}
	};
	
	Extension.inherit_auto(Color, Array);
	
	require("/Engine/GCPool").initPoolOn(Color, Color.prototype.set);
	
	exports.Color = Color;
});



