
"use strict";

ModuleSystem.registerModule("Engine/EventThrower", function(require, exports, module){
	
	var EventThrower = {
		applyOn: function applyOn(obj)
		{
			obj._eventListeners = {};
			obj.addEventListener = this.addEventListener;
			obj.fireEvent = this.fireEvent;
			obj.fireCancelableEvent = this.fireCancelableEvent;
		},
		
		addEventListener: function addEventListener(eventID, func)
		{
			if(!this._eventListeners[eventID])
				this._eventListeners[eventID] = [];
				
			this._eventListeners[eventID].push(func);
		},
		
		fireEvent: function fireEvent(eventID, data)
		{
			if(!this._eventListeners[eventID])
				return;
			
			var arr = this._eventListeners[eventID];
			for(var i=0; i < arr.length; i++)
				arr[i](this, eventID, data);
		},
		
		fireCancelableEvent: function fireCancelableEvent(eventID, data)
		{
			if(!this._eventListeners[eventID])
				return true;
			
			var arr = this._eventListeners[eventID];
			for(var i=0; i < arr.length; i++)
			{
				if(!(arr[i](this, eventID, data)))
					return false;
			}
				
			return true;
		},
		
	};
	
	exports.EventThrower = EventThrower;
});