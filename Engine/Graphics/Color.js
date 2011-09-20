"use strict";

ModuleSystem.registerModule("Engine/Graphics/Color", function(require, exports, module){
	
	function Color(rOrColor, g, b, a)
	{
		this.set(rOrColor, g, b, a);
	}
	
	Color.functions = {
		
		set: function set(rOrColor, g, b, a)
		{
			if(rOrColor === undefined)
			{
				this[0] = 0;
				this[1] = 0;
				this[2] = 0;
				this[3] = 1;
			}
			else if(r === undefined)
			{
				this[0] = rOrColor[0];
				this[1] = rOrColor[1];
				this[2] = rOrColor[2];
				this[3] = rOrColor[3];
			}
			else
			{
				this[0] = rOrColor;
				this[1] = g;
				this[2] = b;
				this[3] = a;
			}
		}
	
	};
	
	Color.properties = {
			r: 	{	get : function(){ return this[0]; },
					set : function(newValue){ this[0] = newValue; },
					enumerable : true,
					configurable : true
				},
				
			g: 	{	get : function(){ return this[1]; },
					set : function(newValue){ this[1] = newValue; },
					enumerable : true,
					configurable : true
				},
				
			b: 	{	get : function(){ return this[2]; },
					set : function(newValue){ this[2] = newValue; },
					enumerable : true,
					configurable : true
				},
				
			a: 	{	get : function(){ return this[3]; },
					set : function(newValue){ this[3] = newValue; },
					enumerable : true,
					configurable : true
				}
	};
	
	Extension.inherit_auto(Color, Array);
	
	require("/Engine/GCPool").initPoolOn(Color, Color.prototype.set);
	
	exports.Color = Color;
});



