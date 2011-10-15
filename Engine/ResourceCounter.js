
"use strict";

ModuleSystem.registerModule("Engine/ResourceCounter", function(require, exports, module){
	
	function ResourceCounter(countOrCB, callback, checkOnStart)
	{
		if(typeof(countOrCB) === "number")
		{
			this.count = countOrCB;
			this.callback = callback;
			this.started = (checkOnStart === true) ? true : false;
		}
		else
		{
			this.count = 0;
			this.callback = countOrCB;
			this.started = false;
		}
		
		this.resAdded = false;
	}
	
	ResourceCounter.prototype = {
		constructor: ResourceCounter,
		
		/* 
		 * 
		 */
		addResource: function addResource()
		{
			++this.count;
			this.resAdded = true;
		},
		
		removeResource: function removeResource()
		{
			--this.count;
			if(this.started && this.count <= 0)
			{
				if(this.count === 0)
					this.callback();
				else
					throw "Too many resources removed";
			}
		},
		
		/* 
		 * 
		 */
		start: function start()
		{
			if(!this.resAdded)
				throw "No resource ever added";
			
			this.start = true;
			if(this.count <= 0)
			{
				if(this.count === 0)
					this.callback();
				else
					throw "Too many resources removed";
			}
		},
		
	};
	
	exports.ResourceCounter = ResourceCounter;
});