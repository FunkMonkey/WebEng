
"use strict";

ModuleSystem.registerModule("Engine/GCPool", function(require, exports, module){
	
	/**
	 * Initializes a GC-Pool on a class
	 * 
	 * @param   {function} ConstFunc Constructor function of the class
	 * @param   {function} initFunc  Function for initalizing
	 * @param   {boolean}  initBoth  If true, the initFunc will also be called for
	 *                               objects created with new
	 */
	function initPoolOn(ConstFunc, initFunc, initBoth)
	{
		ConstFunc.pool = [];
		
		/**
		 * Constructor function for the wrapper-class
		 * 
		 * @param   {Array} args Arguments
		 */
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
		
		/**
		 * Adds the associated object to the pool
		 */
		ConstFunc.prototype.toPool = function toPool()
		{
			ConstFunc.pool.push(this); 
		}
	}
	
	exports.initPoolOn = initPoolOn;
});

