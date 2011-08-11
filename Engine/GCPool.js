
"use strict";

ModuleSystem.registerModule("Engine/GCPool", function(require, exports, module){
	
	function initPoolOn(ConstFunc, initFunc, initBoth)
	{
		ConstFunc.pool = [];
		
		function Wrapper(args) {
			return ConstFunc.apply(this, args);
		}
		
		Wrapper.prototype = ConstFunc.prototype;
		
		if(initBoth)
		{
			ConstFunc.fromPool = function fromPool()
			{
				var obj = null;
				if(ConstFunc.pool.length > 0)
					obj = ConstFunc.pool.pop();
				else
					obj = new ConstFunc();
				
				if(initFunc)
					initFunc.apply(obj, arguments);
					
				return obj;
			};
		}
		else
		{
			ConstFunc.fromPool = function fromPool()
			{
				if(ConstFunc.pool.length > 0)
				{
					var obj = ConstFunc.pool.pop();
					if(initFunc)
						initFunc.apply(obj, arguments);
						
					return obj;
				}
				else
					return new Wrapper(arguments);
			};
		}
		
		
		ConstFunc.prototype.toPool = function toPool()
		{
			ConstFunc.pool.push(this); 
		}
	}
	
	exports.initPoolOn = initPoolOn;
});

